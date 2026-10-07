import { toCities, toHttpsUrl, type BrandOnboardingFormData } from "./schema"

// Same backend base URL the rest of the app uses (ends in /api).
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://afridam-backend-prod-107032494605.us-central1.run.app/api"

export const BRAND_SUBMIT_URL = `${API_BASE_URL}/v1/onboarding/brand-submit`

type FormField = keyof BrandOnboardingFormData

// Backend field paths (dot paths for nested fields) → the form input that shows the error.
const FORM_FIELD_FOR: Record<string, FormField> = {
  businessName: "businessName",
  operatingCountry: "operatingCountry",
  cities: "locations",
  "contactPerson.fullName": "contactName",
  "contactPerson.role": "contactRole",
  workEmail: "workEmail",
  phoneWhatsApp: "phoneWhatsapp",
  websiteUrl: "website",
  "socialHandles.instagram": "instagram",
  "socialHandles.linkedin": "linkedin",
  industryCategory: "industry",
  annualRevenue: "annualRevenue",
  monthlyTraffic: "monthlyWebsiteTraffic",
  hasInternalDevTeam: "technicalTeam",
  preferredDeploymentMode: "deploymentMode",
}

// The request body the backend expects (see brand-onboarding-backend-spec.md).
export function toPayload(data: BrandOnboardingFormData) {
  const instagram = data.instagram?.trim()
  const linkedin = data.linkedin?.trim()
  return {
    businessName: data.businessName,
    operatingCountry: data.operatingCountry,
    cities: toCities(data.locations),
    contactPerson: { fullName: data.contactName, role: data.contactRole },
    workEmail: data.workEmail,
    phoneWhatsApp: data.phoneWhatsapp,
    websiteUrl: toHttpsUrl(data.website),
    ...(instagram || linkedin
      ? { socialHandles: { ...(instagram && { instagram }), ...(linkedin && { linkedin }) } }
      : {}),
    industryCategory: data.industry,
    annualRevenue: data.annualRevenue,
    monthlyTraffic: data.monthlyWebsiteTraffic,
    hasInternalDevTeam: data.technicalTeam === "internal",
    preferredDeploymentMode: data.deploymentMode,
    // Submitting is the agreement ("By continuing, you agree…" under the Submit button).
    consent: true,
  }
}

// The backend may repeat a field; keep the first message per field. Errors on fields the form
// doesn't have (e.g. `consent`) are returned separately so they can be shown as a general message.
export function fieldErrorsFrom(errors: unknown) {
  const fieldErrors: Partial<Record<FormField, string>> = {}
  const otherMessages: string[] = []
  if (!Array.isArray(errors)) return { fieldErrors, otherMessages }

  for (const error of errors) {
    const path = typeof error?.field === "string" ? error.field : ""
    const message = typeof error?.message === "string" ? error.message : ""
    if (!message) continue
    // "cities.2" → "cities"
    const field = FORM_FIELD_FOR[path] ?? FORM_FIELD_FOR[path.replace(/(\.\d+)+$/, "")]
    if (!field) otherMessages.push(message)
    else if (!fieldErrors[field]) fieldErrors[field] = message
  }
  return { fieldErrors, otherMessages }
}

export type SubmitResult =
  | { ok: true; calendlyUrl: string | null }
  | {
      ok: false
      kind: "validation"
      message: string
      fieldErrors: Partial<Record<FormField, string>>
      otherMessages: string[]
    }
  | { ok: false; kind: "rate-limit" | "server" | "network"; message: string }

const GENERIC_ERROR = "We couldn't send your application. Please try again."

export async function submitBrandOnboarding(data: BrandOnboardingFormData): Promise<SubmitResult> {
  let res: Response
  try {
    res = await fetch(BRAND_SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toPayload(data)),
    })
  } catch {
    return { ok: false, kind: "network", message: "Network error — check your connection and try again." }
  }

  const body = await res.json().catch(() => null)

  if (res.ok && body?.succeeded !== false) {
    // calendlyUrl can be null if the backend is misconfigured; the success screen handles that.
    return { ok: true, calendlyUrl: typeof body?.calendlyUrl === "string" ? body.calendlyUrl : null }
  }
  if (res.status === 400) {
    return {
      ok: false,
      kind: "validation",
      message: "Some details need fixing. We've taken you to the first one.",
      ...fieldErrorsFrom(body?.errors),
    }
  }
  if (res.status === 429) {
    // Don't retry automatically: every request counts towards the limit.
    return { ok: false, kind: "rate-limit", message: body?.message ?? "Too many submissions. Please try again later." }
  }
  return { ok: false, kind: "server", message: GENERIC_ERROR }
}
