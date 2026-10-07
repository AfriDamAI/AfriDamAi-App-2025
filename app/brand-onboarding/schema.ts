import { z } from "zod"

export type Option = { value: string; label: string }

// Stored values are short, stable codes; labels are display copy and can be reworded freely.
// Codes match the backend's allowed values exactly, so they are sent as-is.

// Must match the backend's accepted values exactly; anything else is rejected with a 400.
// To offer more countries, the backend must first accept them.
export const COUNTRY_OPTIONS: Option[] = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Rwanda",
  "Egypt",
  "Côte d'Ivoire",
  "Senegal",
  "United Kingdom",
  "United States",
  "Other",
].map((country) => ({ value: country, label: country }))

export const INDUSTRY_OPTIONS: Option[] = [
  { value: "skincare-manufacturer", label: "Skincare Manufacturer" },
  { value: "retailer", label: "Retailer" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "medical-spa", label: "Medical Spa" },
  { value: "hospital-clinic", label: "Hospital/Clinic" },
  { value: "independent-dermatologist", label: "Independent Dermatologist" },
]

export const REVENUE_OPTIONS: Option[] = [
  { value: "under-50k", label: "Under $50k" },
  { value: "50k-250k", label: "$50k–$250k" },
  { value: "250k-1m", label: "$250k–$1M" },
  { value: "1m-plus", label: "$1M+" },
]

export const TRAFFIC_OPTIONS: Option[] = [
  { value: "under-1k", label: "Under 1,000" },
  { value: "1k-10k", label: "1,000–10,000" },
  { value: "10k-50k", label: "10,000–50,000" },
  { value: "50k-plus", label: "50,000+" },
]

export const TECHNICAL_TEAM_OPTIONS: (Option & { desc: string })[] = [
  { value: "internal", label: "Internal Team", desc: "We have an internal technical/developer team" },
  { value: "assisted", label: "Need Assistance", desc: "We require AfriDam developer assistance" },
]

export const DEPLOYMENT_OPTIONS: Option[] = [
  { value: "full-empire-kiosk", label: "In-Store Scanner Kiosk" },
  { value: "website-api", label: "Website API Integration" },
  { value: "instagram-whatsapp-bot", label: "Instagram/WhatsApp Bot" },
  { value: "white-label-saas", label: "White-Label SaaS" },
]

export const labelFor = (options: Option[], value?: string) =>
  options.find((option) => option.value === value)?.label ?? value ?? ""

const requiredText = (message: string, max = 120) =>
  z.string().trim().min(1, message).max(max, `Keep this under ${max} characters`)

const optionalText = (max = 200) =>
  z.string().trim().max(max, `Keep this under ${max} characters`).optional()

const oneOf = (options: Option[], message: string) =>
  z.string().refine((value) => options.some((option) => option.value === value), { message })

// The backend requires an https:// URL; people usually type just "acme.com".
export const toHttpsUrl = (value: string) => `https://${value.trim().replace(/^https?:\/\//i, "")}`

const isWebsite = (value: string) => {
  try {
    return new URL(toHttpsUrl(value)).hostname.includes(".")
  } catch {
    return false
  }
}

// "Lagos, Abuja" → ["Lagos", "Abuja"]. The backend takes 1–20 cities of up to 120 characters each.
export const toCities = (value: string) =>
  value.split(/[,;\n]/).map((city) => city.trim()).filter(Boolean)
const MAX_CITIES = 20
const MAX_CITY_LENGTH = 120

export const brandOnboardingSchema = z.object({
  // Step 1 — Company Information
  businessName: requiredText("Business name is required"),
  operatingCountry: oneOf(COUNTRY_OPTIONS, "Please select your operating country"),
  locations: z
    .string()
    .trim()
    .min(1, "Please list your operating cities/locations")
    .refine((value) => toCities(value).length <= MAX_CITIES, `List up to ${MAX_CITIES} cities`)
    .refine(
      (value) => toCities(value).every((city) => city.length <= MAX_CITY_LENGTH),
      `Keep each city under ${MAX_CITY_LENGTH} characters`
    ),
  contactName: requiredText("Contact person's full name is required"),
  contactRole: requiredText("Role/title is required"),
  workEmail: requiredText("Work email is required", 254).email("Enter a valid email address"),
  phoneWhatsapp: requiredText("Phone/WhatsApp number is required", 25).regex(
    /^\+[\d\s()-]{7,20}$/,
    "Include your country code, e.g. +234 800 000 0000"
  ),
  website: requiredText("Website URL is required", 200).refine(isWebsite, "Enter a valid website, e.g. acmeskincare.com"),
  instagram: optionalText(100).refine(
    (value) => !value || /^@?[\w.]{1,30}$/.test(value) || /instagram\.com\//i.test(value),
    "Enter an Instagram handle or profile link"
  ),
  linkedin: optionalText().refine((value) => !value || /linkedin\.com\//i.test(value), "Enter a LinkedIn page link"),

  // Step 2 — Business Scale & Readiness
  industry: oneOf(INDUSTRY_OPTIONS, "Please select an industry category"),
  annualRevenue: oneOf(REVENUE_OPTIONS, "Please select an estimated annual revenue"),
  monthlyWebsiteTraffic: oneOf(TRAFFIC_OPTIONS, "Please select an estimated monthly traffic range"),

  // Step 3 — Technical Setup Requirements
  technicalTeam: oneOf(TECHNICAL_TEAM_OPTIONS, "Please select an option"),
  deploymentMode: oneOf(DEPLOYMENT_OPTIONS, "Please select a deployment mode"),

  // Honeypot: hidden from people, filled in by bots. Checked before sending; never sent to the backend.
  faxNumber: z.string().optional(),
})

export type BrandOnboardingFormData = z.infer<typeof brandOnboardingSchema>

export const STEP_FIELDS: Record<number, (keyof BrandOnboardingFormData)[]> = {
  1: ["businessName", "operatingCountry", "locations", "contactName", "contactRole", "workEmail", "phoneWhatsapp", "website", "instagram", "linkedin"],
  2: ["industry", "annualRevenue", "monthlyWebsiteTraffic"],
  3: ["technicalTeam", "deploymentMode"],
  4: [],
}

export const STEP_META = [
  { step: 1, title: "Company Information", subtitle: "Tell us about your brand" },
  { step: 2, title: "Business Scale & Readiness", subtitle: "Help us understand your reach" },
  { step: 3, title: "Technical Setup", subtitle: "How should we integrate with you" },
  { step: 4, title: "Review", subtitle: "Confirm your details before submitting" },
]
