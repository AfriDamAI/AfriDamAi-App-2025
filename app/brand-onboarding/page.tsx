"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useForm, Controller, type Control, type UseFormRegister } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { motion, AnimatePresence } from "framer-motion"
import {
  Banknote,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Flag,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Rocket,
  Store,
  TrendingUp,
  User,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  type Option,
  STEP_FIELDS,
  STEP_META,
  COUNTRY_OPTIONS,
  INDUSTRY_OPTIONS,
  REVENUE_OPTIONS,
  TRAFFIC_OPTIONS,
  TECHNICAL_TEAM_OPTIONS,
  DEPLOYMENT_OPTIONS,
  labelFor,
} from "./schema"
import { submitBrandOnboarding } from "./api"

const TOTAL_STEPS = 4
const DRAFT_KEY = "afridam:brand-onboarding-draft:v3"
// Booking calendar height until Calendly reports its real content height.
const CALENDLY_MIN_HEIGHT = 700
const LABEL_CLASS = "text-[11px] font-black uppercase tracking-[0.25em] text-muted-foreground"
// Taller, rounder fields so inputs sit in proportion with the large step buttons.
// Placeholders (inputs, and selects with nothing picked) are lighter than typed values.
const INPUT_CLASS =
  "h-12 rounded-xl placeholder:text-muted-foreground/50 data-[placeholder]:text-muted-foreground/50"
const ARROW_STEP: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }

// Leading icon inside a field; the field itself gets `pl-11` to make room.
function FieldIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <Icon
      aria-hidden="true"
      className="pointer-events-none absolute left-4 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
    />
  )
}

// Prefills the lead's name and email so they don't type them twice.
// `calendlyUrl` comes from the backend's success response (never hard-coded here).
function calendlyEmbedSrc(calendlyUrl: string | null, name: string, email: string) {
  if (!calendlyUrl) return null
  try {
    const url = new URL(calendlyUrl)
    url.searchParams.set("name", name)
    url.searchParams.set("email", email)
    url.searchParams.set("hide_gdpr_banner", "1")
    url.searchParams.set("embed_type", "Inline")
    url.searchParams.set("embed_domain", window.location.hostname)
    return url.toString()
  } catch {
    return null
  }
}

type SelectFieldName = "operatingCountry" | "industry" | "annualRevenue" | "monthlyWebsiteTraffic" | "deploymentMode"

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="text-xs font-bold text-red-500 mt-1 ml-1">
      {message}
    </p>
  )
}

function TextField({
  name,
  label,
  register,
  error,
  optional,
  icon,
  className,
  ...inputProps
}: {
  name: keyof BrandOnboardingFormData
  label: string
  register: UseFormRegister<BrandOnboardingFormData>
  error?: string
  optional?: boolean
  icon?: LucideIcon
  className?: string
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={LABEL_CLASS}>
        {label} {optional && <span className="normal-case tracking-normal">(optional)</span>}
      </Label>
      <div className="relative">
        {icon && <FieldIcon icon={icon} />}
        <Input
          id={name}
          className={cn(INPUT_CLASS, icon && "pl-11")}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          {...inputProps}
          {...register(name)}
        />
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </div>
  )
}

function SelectField({
  name,
  label,
  placeholder,
  options,
  control,
  error,
  icon,
  className,
}: {
  name: SelectFieldName
  label: string
  placeholder: string
  options: Option[]
  control: Control<BrandOnboardingFormData>
  error?: string
  icon?: LucideIcon
  className?: string
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className={LABEL_CLASS}>
        {label}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select onValueChange={field.onChange} value={field.value}>
            <div className="relative">
              {icon && <FieldIcon icon={icon} />}
              <SelectTrigger
                id={name}
                className={cn(INPUT_CLASS, icon && "pl-11")}
                onBlur={field.onBlur}
                aria-invalid={!!error}
                aria-describedby={error ? `${name}-error` : undefined}
              >
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </div>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 py-3 border-b border-border last:border-b-0">
      <p className="text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground sm:text-right break-words">{value?.trim() ? value : "—"}</p>
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
        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#E1784F]">{title}</p>
        <button
          type="button"
          onClick={onEdit}
          aria-label={`Edit ${title}`}
          className="text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          Edit
        </button>
      </div>
      <div className="bg-muted rounded-2xl px-5">{children}</div>
    </div>
  )
}

export default function BrandOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [returnToReview, setReturnToReview] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null)
  const [calendlyHeight, setCalendlyHeight] = useState(CALENDLY_MIN_HEIGHT)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const {
    register,
    control,
    handleSubmit,
    trigger,
    getValues,
    reset,
    subscribe,
    setError,
    formState: { errors, isSubmitting },
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
      faxNumber: "",
    },
  })

  // Restore a draft after a refresh or accidental back navigation.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY)
      if (saved) reset({ ...getValues(), ...JSON.parse(saved), faxNumber: "" })
    } catch {
      // Storage unavailable (private mode) — start empty.
    }
  }, [reset, getValues])

  // Grow the booking calendar to fit its content, so only the page scrolls (no scrollbar inside
  // the calendar). The embedded Calendly page reports its height with a "calendly.page_height" message.
  useEffect(() => {
    if (!submitted) return
    const onMessage = (e: MessageEvent) => {
      if (!/^https:\/\/([a-z0-9-]+\.)*calendly\.com$/.test(e.origin)) return
      if (e.data?.event !== "calendly.page_height") return
      const height = parseInt(e.data.payload?.height, 10)
      if (height > 0) setCalendlyHeight(Math.max(height, CALENDLY_MIN_HEIGHT))
    }
    window.addEventListener("message", onMessage)
    return () => window.removeEventListener("message", onMessage)
  }, [submitted])

  // Save the draft as the user types.
  useEffect(() => {
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        try {
          sessionStorage.setItem(DRAFT_KEY, JSON.stringify(values))
        } catch {
          // Storage unavailable — drafts just won't persist.
        }
      },
    })
  }, [subscribe])

  // Runs once the old step has animated out, so the page height has settled before scrolling.
  const handleStepEntered = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    headingRef.current?.focus({ preventScroll: true })
  }

  const activeStepMeta = STEP_META[currentStep - 1]
  const progressValue = (currentStep / TOTAL_STEPS) * 100

  const handleNext = async () => {
    const isValid = await trigger(STEP_FIELDS[currentStep], { shouldFocus: true })
    if (!isValid) return
    if (returnToReview) {
      setReturnToReview(false)
      setCurrentStep(TOTAL_STEPS)
      return
    }
    setCurrentStep((prev) => Math.min(prev + 1, TOTAL_STEPS))
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1)
  }

  const editStep = (step: number) => {
    setReturnToReview(true)
    setCurrentStep(step)
  }

  // Enter in a text field moves to the next step instead of doing nothing.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter" || currentStep === TOTAL_STEPS) return
    if ((e.target as HTMLElement).tagName !== "INPUT") return
    e.preventDefault()
    void handleNext()
  }

  const onSubmit = async (data: BrandOnboardingFormData) => {
    setSubmitError(null)

    // Honeypot filled in: almost certainly a bot. Show success but send nothing.
    if (data.faxNumber) {
      setCalendlyUrl(null)
      setSubmitted(true)
      return
    }

    const result = await submitBrandOnboarding(data)

    if (result.ok) {
      try {
        sessionStorage.removeItem(DRAFT_KEY)
      } catch {}
      setCalendlyUrl(result.calendlyUrl)
      setSubmitted(true)
      return
    }

    if (result.kind === "validation") {
      // Put each backend message under its field, then go to the first step that has one.
      const entries = Object.entries(result.fieldErrors) as [keyof BrandOnboardingFormData, string][]
      for (const [field, message] of entries) setError(field, { type: "server", message })
      const firstStep = [1, 2, 3].find((step) => STEP_FIELDS[step].some((field) => field in result.fieldErrors))
      if (firstStep) {
        setReturnToReview(true)
        setCurrentStep(firstStep)
      }
      setSubmitError([result.message, ...result.otherMessages].join(" "))
      return
    }

    setSubmitError(result.message)
  }

  if (submitted) {
    const calendlySrc = calendlyEmbedSrc(calendlyUrl, getValues("contactName"), getValues("workEmail"))
    return (
      <div className="bg-background text-foreground flex flex-col items-center px-6 py-16">
        <div role="status" className="max-w-xl text-center space-y-5">
          <p className="text-[#E1784F] text-xs font-black uppercase tracking-[0.4em]">Application received</p>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
            Thank you, {getValues("contactName").split(" ")[0]}
          </h1>
          <p className="text-muted-foreground text-sm">
            We&apos;ve sent a confirmation to {getValues("workEmail")}.{" "}
            {calendlySrc
              ? "Pick a time below to book your discovery call with our Marketing Lead."
              : "Our partnerships team will be in touch shortly to schedule a discovery call."}
          </p>
        </div>

        {calendlySrc ? (
          <div className="w-full max-w-3xl mt-10 space-y-4">
            <iframe
              src={calendlySrc}
              title="Book a discovery call with AfriDam AI"
              style={{ height: calendlyHeight }}
              className="w-full rounded-3xl border border-border bg-card"
            />
            <p className="text-center text-xs text-muted-foreground">
              Calendar not loading?{" "}
              <a href={calendlySrc} target="_blank" rel="noopener noreferrer" className="underline text-foreground">
                Open the booking page in a new tab
              </a>
            </p>
          </div>
        ) : (
          <Button asChild size="lg" className="mt-8">
            <Link href="/">Back to home</Link>
          </Button>
        )}
      </div>
    )
  }

  const values = getValues()

  return (
    // Extra bottom padding on phones keeps the step buttons clear of the fixed chat/scroll widgets.
    <div className="bg-background text-foreground flex flex-col items-center px-6 pt-16 pb-28 md:pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />

      <div className="w-full max-w-3xl z-10 space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <p aria-live="polite" className="text-[#E1784F] text-[11px] font-black uppercase tracking-[0.6em]">
            Step {currentStep} of {TOTAL_STEPS}
          </p>
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-3xl md:text-4xl lg:text-5xl font-black italic uppercase tracking-tighter leading-none text-balance outline-none"
          >
            {activeStepMeta.title}
          </h1>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
            {activeStepMeta.subtitle}
          </p>
          <Progress
            value={progressValue}
            aria-label={`Step ${currentStep} of ${TOTAL_STEPS}`}
            className="max-w-md mx-auto"
          />
        </div>

        {/* Step Content */}
        {/* Overrides Card's hover lift, which is distracting on a form. */}
        <Card className="bg-card border-border hover:shadow-sm hover:border-border">
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} noValidate>
              {/* Honeypot: invisible to people, bots fill it in. Kept outside the steps so it's always in the DOM. */}
              <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label htmlFor="faxNumber">Fax number</label>
                <input id="faxNumber" tabIndex={-1} autoComplete="off" {...register("faxNumber")} />
              </div>

              <AnimatePresence mode="wait" onExitComplete={handleStepEntered}>
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="min-h-[280px] py-2"
                >
                  {currentStep === 1 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      <TextField name="businessName" icon={Building2} label="Business Name" register={register} error={errors.businessName?.message} placeholder="Acme Skincare Ltd" autoComplete="organization" className="md:col-span-2" />
                      <SelectField name="operatingCountry" icon={Flag} label="Operating Country" placeholder="Select a country" options={COUNTRY_OPTIONS} control={control} error={errors.operatingCountry?.message} />
                      <TextField name="locations" icon={MapPin} label="Cities / Locations" register={register} error={errors.locations?.message} placeholder="Lagos, Abuja" />
                      <TextField name="contactName" icon={User} label="Contact Full Name" register={register} error={errors.contactName?.message} placeholder="Jane Doe" autoComplete="name" />
                      <TextField name="contactRole" icon={Briefcase} label="Role / Title" register={register} error={errors.contactRole?.message} placeholder="Head of Operations" autoComplete="organization-title" />
                      <TextField name="workEmail" icon={Mail} label="Work Email Address" type="email" register={register} error={errors.workEmail?.message} placeholder="jane@acmeskincare.com" autoComplete="email" />
                      <TextField name="phoneWhatsapp" icon={Phone} label="Phone / WhatsApp Number" type="tel" register={register} error={errors.phoneWhatsapp?.message} placeholder="+234 800 000 0000" autoComplete="tel" />
                      <TextField name="website" icon={Globe} label="Company Website URL" type="url" register={register} error={errors.website?.message} placeholder="acmeskincare.com" autoComplete="url" className="md:col-span-2" />

                      <fieldset className="md:col-span-2">
                        <legend className={LABEL_CLASS}>
                          Social Media Handles <span className="normal-case tracking-normal">(optional)</span>
                        </legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                          {(
                            [
                              { name: "instagram", label: "Instagram", icon: Instagram, placeholder: "@acmeskincare", error: errors.instagram?.message },
                              { name: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "linkedin.com/company/acme", error: errors.linkedin?.message },
                            ] as const
                          ).map(({ name, label, icon, placeholder, error }) => (
                            <div key={name}>
                              <div className="relative">
                                <FieldIcon icon={icon} />
                                <Input
                                  id={name}
                                  aria-label={label}
                                  aria-invalid={!!error}
                                  aria-describedby={error ? `${name}-error` : undefined}
                                  placeholder={placeholder}
                                  className={cn(INPUT_CLASS, "pl-11")}
                                  {...register(name)}
                                />
                              </div>
                              <FieldError id={`${name}-error`} message={error} />
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectField name="industry" icon={Store} label="Industry Category" placeholder="Select an industry" options={INDUSTRY_OPTIONS} control={control} error={errors.industry?.message} className="md:col-span-2" />
                      {/* Labels kept short enough to stay on one line so both dropdowns line up. */}
                      <SelectField name="annualRevenue" icon={Banknote} label="Annual Revenue (Est.)" placeholder="Select a range" options={REVENUE_OPTIONS} control={control} error={errors.annualRevenue?.message} />
                      <SelectField name="monthlyWebsiteTraffic" icon={TrendingUp} label="Monthly Web Traffic (Est.)" placeholder="Select a range" options={TRAFFIC_OPTIONS} control={control} error={errors.monthlyWebsiteTraffic?.message} />
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="w-full space-y-8">
                      <div className="space-y-4">
                        <p id="technicalTeam-label" className={cn(LABEL_CLASS, "ml-1")}>
                          Technical Team / Integration Support
                        </p>
                        <Controller
                          name="technicalTeam"
                          control={control}
                          render={({ field }) => (
                            <div
                              role="radiogroup"
                              aria-labelledby="technicalTeam-label"
                              aria-describedby={errors.technicalTeam ? "technicalTeam-error" : undefined}
                              className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                              {TECHNICAL_TEAM_OPTIONS.map((option, index) => {
                                const selected = field.value === option.value
                                const count = TECHNICAL_TEAM_OPTIONS.length
                                return (
                                  <button
                                    key={option.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={selected}
                                    // Roving tab stop: Tab enters the group once, arrow keys move within it.
                                    tabIndex={selected || (!field.value && index === 0) ? 0 : -1}
                                    onClick={() => field.onChange(option.value)}
                                    onBlur={field.onBlur}
                                    onKeyDown={(e) => {
                                      const step = ARROW_STEP[e.key]
                                      if (!step) return
                                      e.preventDefault()
                                      const nextIndex = (index + step + count) % count
                                      field.onChange(TECHNICAL_TEAM_OPTIONS[nextIndex].value)
                                      e.currentTarget.parentElement
                                        ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
                                        [nextIndex]?.focus()
                                    }}
                                    className={cn(
                                      "p-5 rounded-2xl text-left transition-all border-2 flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1784F]/50",
                                      selected
                                        ? "border-[#E1784F] bg-[#E1784F]/10 text-foreground"
                                        : "border-border bg-muted/40 text-muted-foreground hover:border-[#E1784F]/40 hover:bg-muted hover:text-foreground"
                                    )}
                                  >
                                    <span
                                      aria-hidden="true"
                                      className={cn(
                                        "mt-0.5 h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors",
                                        selected ? "border-[#E1784F]" : "border-muted-foreground/40"
                                      )}
                                    >
                                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#E1784F]" />}
                                    </span>
                                    <span>
                                      <span className="block font-black uppercase text-xs tracking-widest">{option.label}</span>
                                      <span className="block text-xs font-medium mt-1 normal-case opacity-80">{option.desc}</span>
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        />
                        <FieldError id="technicalTeam-error" message={errors.technicalTeam?.message} />
                      </div>

                      <SelectField name="deploymentMode" icon={Rocket} label="Preferred Deployment Mode" placeholder="Select a deployment mode" options={DEPLOYMENT_OPTIONS} control={control} error={errors.deploymentMode?.message} />
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="w-full space-y-8">
                      <ReviewSection title="Company Information" onEdit={() => editStep(1)}>
                        <ReviewRow label="Business Name" value={values.businessName} />
                        <ReviewRow label="Operating Country" value={labelFor(COUNTRY_OPTIONS, values.operatingCountry)} />
                        <ReviewRow label="Cities / Locations" value={values.locations} />
                        <ReviewRow label="Contact Name" value={values.contactName} />
                        <ReviewRow label="Role / Title" value={values.contactRole} />
                        <ReviewRow label="Work Email" value={values.workEmail} />
                        <ReviewRow label="Phone / WhatsApp" value={values.phoneWhatsapp} />
                        <ReviewRow label="Website" value={values.website} />
                        <ReviewRow label="Instagram" value={values.instagram} />
                        <ReviewRow label="LinkedIn" value={values.linkedin} />
                      </ReviewSection>

                      <ReviewSection title="Business Scale & Readiness" onEdit={() => editStep(2)}>
                        <ReviewRow label="Industry Category" value={labelFor(INDUSTRY_OPTIONS, values.industry)} />
                        <ReviewRow label="Estimated Annual Revenue" value={labelFor(REVENUE_OPTIONS, values.annualRevenue)} />
                        <ReviewRow label="Estimated Monthly Traffic" value={labelFor(TRAFFIC_OPTIONS, values.monthlyWebsiteTraffic)} />
                      </ReviewSection>

                      <ReviewSection title="Technical Setup Requirements" onEdit={() => editStep(3)}>
                        <ReviewRow label="Technical Team" value={labelFor(TECHNICAL_TEAM_OPTIONS, values.technicalTeam)} />
                        <ReviewRow label="Deployment Mode" value={labelFor(DEPLOYMENT_OPTIONS, values.deploymentMode)} />
                      </ReviewSection>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {submitError && (
                <p role="alert" className="mt-8 text-center text-sm font-bold text-red-500">
                  {submitError}
                </p>
              )}

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
                  <Button type="button" size="lg" onClick={handleNext} className="flex-1">
                    {returnToReview ? "Back to review" : "Continue"}
                    <ChevronRight size={16} />
                  </Button>
                )}

                {currentStep === TOTAL_STEPS && (
                  <Button type="submit" size="lg" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting…" : "Submit Application"}
                  </Button>
                )}
              </div>

              {/* Agreement is given by submitting (no checkbox); the payload records consent: true. */}
              {currentStep === TOTAL_STEPS && (
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  By continuing, you agree to our{" "}
                  <Link href="/terms" target="_blank" className="underline text-foreground">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" target="_blank" className="underline text-foreground">
                    Privacy Policy
                  </Link>
                  .
                </p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
