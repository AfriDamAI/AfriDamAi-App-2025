import { z } from "zod"

export const brandOnboardingSchema = z.object({
  // Step 1 — Company Information
  businessName: z.string().min(1, "Business name is required"),
  operatingCountry: z.string().min(1, "Operating country is required"),
  locations: z.string().min(1, "Please list your operating cities/locations"),
  contactName: z.string().min(1, "Contact person's full name is required"),
  contactRole: z.string().min(1, "Role/title is required"),
  workEmail: z.string().min(1, "Work email is required").email("Enter a valid email address"),
  phoneWhatsapp: z.string().min(1, "Phone/WhatsApp number is required"),
  website: z.string().min(1, "Website URL is required"),
  instagram: z.string().optional(),
  linkedin: z.string().optional(),

  // Step 2 — Business Scale & Readiness
  industry: z.string().min(1, "Please select an industry category"),
  annualRevenue: z.string().min(1, "Please select an estimated annual revenue"),
  monthlyWebsiteTraffic: z.string().min(1, "Please select an estimated monthly traffic range"),

  // Step 3 — Technical Setup Requirements
  technicalTeam: z.string().min(1, "Please select an option"),
  deploymentMode: z.string().min(1, "Please select a deployment mode"),
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