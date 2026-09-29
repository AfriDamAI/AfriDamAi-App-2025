"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import {
  brandOnboardingSchema,
  type BrandOnboardingFormData,
  STEP_FIELDS,
  STEP_META,
} from "./schema"

const TOTAL_STEPS = 4

const INDUSTRY_OPTIONS = [
  "Skincare Manufacturer",
  "Retailer",
  "Pharmacy",
  "Medical Spa",
  "Hospital/Clinic",
  "Independent Dermatologist",
]

const REVENUE_OPTIONS = ["Under $50k", "$50k–$250k", "$250k–$1M", "$1M+"]

const TRAFFIC_OPTIONS = ["Under 1,000", "1,000–10,000", "10,000–50,000", "50,000+"]

const TECHNICAL_TEAM_OPTIONS = [
  { value: "We have an internal technical/developer team", label: "Internal Team", desc: "We have an internal technical/developer team" },
  { value: "We require AfriDam developer assistance", label: "Need Assistance", desc: "We require AfriDam developer assistance" },
]

const DEPLOYMENT_OPTIONS = [
  "Full Empire Kiosk Setup",
  "Website API Integration",
  "Instagram/WhatsApp Bot",
  "White-Label SaaS",
]
function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mt-1 ml-1">
      {message}
    </p>
  )
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 border-b border-white/5 last:border-b-0">
      <p className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30">{label}</p>
      <p className="text-sm text-white/90 sm:text-right">{value?.trim() ? value : "—"}</p>
    </div>
  )
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          className="text-[9px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="bg-white/5 rounded-2xl px-5">{children}</div>
    </div>
  )
}

export default function BrandOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)

    const {
    register,
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<BrandOnboardingFormData>({
    resolver: zodResolver(brandOnboardingSchema),
    mode: "onTouched",
    defaultValues: {
      businessName: "",
      operatingCountry: "",
      locations: "",
      contactName: "",
      contactRole: "",
      workEmail: "",
      phoneWhatsapp: "",
      website: "",
      instagram: "",
      linkedin: "",
      industry: "",
      annualRevenue: "",
      monthlyWebsiteTraffic: "",
      technicalTeam: "",
      deploymentMode: "",
    },
  })

  const activeStepMeta = STEP_META[currentStep - 1]
  const progressValue = (currentStep / TOTAL_STEPS) * 100
  const values = watch()

  const handleNext = async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep]
    const isValid = await trigger(fieldsToValidate)
    if (!isValid) return
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  // 🚧 TEMPORARY — real submission wiring lands in Phase 8, owned by Georgina
  const onSubmit = (data: BrandOnboardingFormData) => {
    console.log("Brand onboarding payload (placeholder):", data)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-2xl z-10 space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <p className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.6em]">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
            {activeStepMeta.title}
          </h1>
          <p className="text-white/40 text-xs font-medium uppercase tracking-widest">
            {activeStepMeta.subtitle}
          </p>
          <Progress value={progressValue} className="max-w-md mx-auto" />
        </div>

        {/* Step Content */}
        <Card className="bg-white/5 border-white/10">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="min-h-[280px] flex items-center justify-center py-2"
                >
                  {/* 🚧 Placeholder — real fields land in Phases 4–7 */}
                  {currentStep === 1 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="businessName" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Business Name
                        </Label>
                        <Input id="businessName" {...register("businessName")} placeholder="Acme Skincare Ltd" />
                        <FieldError message={errors.businessName?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="operatingCountry" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Operating Country
                        </Label>
                        <Input id="operatingCountry" {...register("operatingCountry")} placeholder="Nigeria" />
                        <FieldError message={errors.operatingCountry?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="locations" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Cities / Locations
                        </Label>
                        <Input id="locations" {...register("locations")} placeholder="Lagos, Abuja" />
                        <FieldError message={errors.locations?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactName" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Contact Full Name
                        </Label>
                        <Input id="contactName" {...register("contactName")} placeholder="Jane Doe" />
                        <FieldError message={errors.contactName?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="contactRole" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Role / Title
                        </Label>
                        <Input id="contactRole" {...register("contactRole")} placeholder="Head of Operations" />
                        <FieldError message={errors.contactRole?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="workEmail" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Work Email Address
                        </Label>
                        <Input id="workEmail" type="email" {...register("workEmail")} placeholder="jane@acmeskincare.com" />
                        <FieldError message={errors.workEmail?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneWhatsapp" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Phone / WhatsApp Number
                        </Label>
                        <Input id="phoneWhatsapp" {...register("phoneWhatsapp")} placeholder="+234 800 000 0000" />
                        <FieldError message={errors.phoneWhatsapp?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Website URL
                        </Label>
                        <Input id="website" {...register("website")} placeholder="https://acmeskincare.com" />
                        <FieldError message={errors.website?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="instagram" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Instagram <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                        </Label>
                        <Input id="instagram" {...register("instagram")} placeholder="@acmeskincare" />
                        <FieldError message={errors.instagram?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedin" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          LinkedIn <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                        </Label>
                        <Input id="linkedin" {...register("linkedin")} placeholder="linkedin.com/company/acme" />
                        <FieldError message={errors.linkedin?.message} />
                      </div>
                    </div>
                  )}

                     {currentStep === 2 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2 space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Industry Category
                        </Label>
                        <Controller
                          name="industry"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an industry" />
                              </SelectTrigger>
                              <SelectContent>
                                {INDUSTRY_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError message={errors.industry?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Estimated Annual Revenue
                        </Label>
                        <Controller
                          name="annualRevenue"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a range" />
                              </SelectTrigger>
                              <SelectContent>
                                {REVENUE_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError message={errors.annualRevenue?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Estimated Monthly Website Traffic
                        </Label>
                        <Controller
                          name="monthlyWebsiteTraffic"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a range" />
                              </SelectTrigger>
                              <SelectContent>
                                {TRAFFIC_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError message={errors.monthlyWebsiteTraffic?.message} />
                      </div>
                    </div>
                  )}

                 {currentStep === 3 && (
                    <div className="w-full space-y-8">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-1">
                          Technical Team / Integration Support
                        </Label>
                        <Controller
                          name="technicalTeam"
                          control={control}
                          render={({ field }) => (
                            <div className="grid grid-cols-1 gap-4">
                              {TECHNICAL_TEAM_OPTIONS.map((option) => (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => field.onChange(option.value)}
                                  className={`p-6 rounded-3xl text-left transition-all border-2 flex items-center justify-between ${
                                    field.value === option.value
                                      ? "bg-[#4DB6AC] border-[#4DB6AC] text-white shadow-lg shadow-[#4DB6AC]/20"
                                      : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                                  }`}
                                >
                                  <div>
                                    <p className="font-black uppercase text-[11px] tracking-widest">{option.label}</p>
                                    <p className="text-[9px] opacity-70 font-medium tracking-tight mt-1 normal-case">{option.desc}</p>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        />
                        <FieldError message={errors.technicalTeam?.message} />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">
                          Preferred Deployment Mode
                        </Label>
                        <Controller
                          name="deploymentMode"
                          control={control}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a deployment mode" />
                              </SelectTrigger>
                              <SelectContent>
                                {DEPLOYMENT_OPTIONS.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FieldError message={errors.deploymentMode?.message} />
                      </div>
                    </div>
                  )}

                   {currentStep === 4 && (
                    <div className="w-full space-y-8">
                      <ReviewSection title="Company Information" onEdit={() => setCurrentStep(1)}>
                        <ReviewRow label="Business Name" value={values.businessName} />
                        <ReviewRow label="Operating Country" value={values.operatingCountry} />
                        <ReviewRow label="Cities / Locations" value={values.locations} />
                        <ReviewRow label="Contact Name" value={values.contactName} />
                        <ReviewRow label="Role / Title" value={values.contactRole} />
                        <ReviewRow label="Work Email" value={values.workEmail} />
                        <ReviewRow label="Phone / WhatsApp" value={values.phoneWhatsapp} />
                        <ReviewRow label="Website" value={values.website} />
                        <ReviewRow label="Instagram" value={values.instagram} />
                        <ReviewRow label="LinkedIn" value={values.linkedin} />
                      </ReviewSection>

                      <ReviewSection title="Business Scale & Readiness" onEdit={() => setCurrentStep(2)}>
                        <ReviewRow label="Industry Category" value={values.industry} />
                        <ReviewRow label="Estimated Annual Revenue" value={values.annualRevenue} />
                        <ReviewRow label="Estimated Monthly Traffic" value={values.monthlyWebsiteTraffic} />
                      </ReviewSection>

                      <ReviewSection title="Technical Setup Requirements" onEdit={() => setCurrentStep(3)}>
                        <ReviewRow label="Technical Team" value={values.technicalTeam} />
                        <ReviewRow label="Deployment Mode" value={values.deploymentMode} />
                      </ReviewSection>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
                <div className="flex items-center gap-4 mt-10 max-w-md mx-auto">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={handleBack}
                    aria-label="Back"
                    className="w-16 shrink-0 px-0"
                  >
                    <ChevronLeft size={18} />
                  </Button>
                )}

                {currentStep < TOTAL_STEPS && (
                  <Button
                    type="button"
                    size="lg"
                    onClick={handleNext}
                    className="flex-1"
                  >
                    Continue
                    <ChevronRight size={16} />
                  </Button>
                )}

                {currentStep === TOTAL_STEPS && (
                  <Button type="submit" size="lg" className="flex-1">
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}