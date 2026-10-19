import { NextResponse } from "next/server"
import {
  brandOnboardingSchema,
  labelFor,
  INDUSTRY_OPTIONS,
  REVENUE_OPTIONS,
  TRAFFIC_OPTIONS,
  TECHNICAL_TEAM_OPTIONS,
  DEPLOYMENT_OPTIONS,
  type BrandOnboardingFormData,
} from "@/app/brand-onboarding/schema"

// CEO, Marketing Lead and Operational Manager. Override with a comma-separated
// BRAND_ONBOARDING_NOTIFY_EMAILS if the list changes.
const DEFAULT_NOTIFY_EMAILS = ["ogirima@afridamai.com", "chiamaka@afridamai.com", "ibukun@afridamai.com"]

const notifyEmails = () =>
  process.env.BRAND_ONBOARDING_NOTIFY_EMAILS?.split(",").map((email) => email.trim()).filter(Boolean) ??
  DEFAULT_NOTIFY_EMAILS

// Best-effort per-IP limit. Memory is per server instance, so on Vercel this complements
// (doesn't replace) a Firewall rate-limit rule on this path.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const recentSubmissions = new Map<string, number[]>()

function isRateLimited(ip: string) {
  const now = Date.now()
  if (recentSubmissions.size > 1000) {
    for (const [key, times] of recentSubmissions) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) recentSubmissions.delete(key)
    }
  }
  const recent = (recentSubmissions.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  const limited = recent.length >= RATE_LIMIT
  if (!limited) recent.push(now)
  recentSubmissions.set(ip, recent)
  return limited
}

const escapeHtml = (value = "") =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!)

// Header values must never contain line breaks.
const oneLine = (value: string) => value.replace(/[\r\n]+/g, " ")

function summaryRows(data: BrandOnboardingFormData): [string, string | undefined][] {
  return [
    ["Business name", data.businessName],
    ["Operating country", data.operatingCountry],
    ["Cities / locations", data.locations],
    ["Contact name", data.contactName],
    ["Role / title", data.contactRole],
    ["Work email", data.workEmail],
    ["Phone / WhatsApp", data.phoneWhatsapp],
    ["Website", data.website],
    ["Instagram", data.instagram],
    ["LinkedIn", data.linkedin],
    ["Industry", labelFor(INDUSTRY_OPTIONS, data.industry)],
    ["Annual revenue", labelFor(REVENUE_OPTIONS, data.annualRevenue)],
    ["Monthly website traffic", labelFor(TRAFFIC_OPTIONS, data.monthlyWebsiteTraffic)],
    ["Technical team", labelFor(TECHNICAL_TEAM_OPTIONS, data.technicalTeam)],
    ["Deployment mode", labelFor(DEPLOYMENT_OPTIONS, data.deploymentMode)],
    ["Agreed to Terms & Privacy Policy (by submitting)", new Date().toISOString()],
  ]
}

function teamEmailHtml(data: BrandOnboardingFormData) {
  const rows = summaryRows(data)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px;color:#666">${label}</td><td style="padding:6px 12px">${escapeHtml(value || "—")}</td></tr>`
    )
    .join("")
  return `<h2>New brand partner application</h2><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows}</table>`
}

function applicantEmailHtml(data: BrandOnboardingFormData) {
  return `<div style="font-family:sans-serif;font-size:14px;line-height:1.6">
    <p>Hi ${escapeHtml(data.contactName.split(" ")[0])},</p>
    <p>Thanks for applying to partner with AfriDam AI on behalf of <strong>${escapeHtml(data.businessName)}</strong>.
    Our partnerships team will review your application and get back to you soon.</p>
    <p>— The AfriDam AI team</p>
  </div>`
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) console.error("Brand onboarding: Resend error", res.status, await res.text())
  return res.ok
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { message: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429 }
    )
  }

  const body = await request.json().catch(() => null)

  // Honeypot filled in: almost certainly a bot. Pretend it worked so it doesn't retry.
  if (body?.faxNumber) return NextResponse.json({ ok: true })

  // Never trust browser-side validation — re-check everything here.
  const parsed = brandOnboardingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Some details are missing or invalid. Please review the form.", errors: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }
  const data = parsed.data

  const from = process.env.BRAND_ONBOARDING_FROM_EMAIL
  if (!process.env.RESEND_API_KEY || !from) {
    console.error("Brand onboarding: RESEND_API_KEY or BRAND_ONBOARDING_FROM_EMAIL is not set")
    return NextResponse.json(
      { message: "Applications are temporarily unavailable. Please try again later." },
      { status: 500 }
    )
  }

  const teamSent = await sendEmail({
    from,
    to: notifyEmails(),
    reply_to: data.workEmail,
    subject: oneLine(`New brand partner application — ${data.businessName}`),
    html: teamEmailHtml(data),
  })
  if (!teamSent) {
    return NextResponse.json({ message: "We couldn't send your application. Please try again." }, { status: 502 })
  }

  // The applicant's confirmation is a courtesy; don't fail the submission if it bounces.
  await sendEmail({
    from,
    to: data.workEmail,
    subject: "We've received your AfriDam AI partner application",
    html: applicantEmailHtml(data),
  })

  return NextResponse.json({ ok: true })
}
