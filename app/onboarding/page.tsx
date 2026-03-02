"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import {
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  User,
  Activity,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react"

const STEPS = [
  { id: "welcome", title: "Welcome", subtitle: "Let's personalize your clinical experience" },
  { id: "age", title: "Metrics", subtitle: "Biological data for AI precision" },
  { id: "skin-type", title: "Skin Type", subtitle: "Identify your dermal category" },
  { id: "skin-tone", title: "Skin Tone", subtitle: "Fitzpatrick scale alignment" },
  { id: "concerns", title: "History", subtitle: "Allergies and previous treatments" },
  { id: "complete", title: "Syncing", subtitle: "Securing your clinical identity" }
]

const SKIN_TYPES = [
  { id: "Oily / Shine", label: "Oily / Shine", desc: "Excess sebum, visible pores" },
  { id: "Dry / Tight", label: "Dry / Tight", desc: "Lacks moisture, may flake" },
  { id: "Balanced", label: "Balanced", desc: "Even texture, no major issues" },
  { id: "Sensitive", label: "Sensitive", desc: "Easily irritated or reactive" }
]

const SKIN_TONES = [
  { level: 1, label: "Type I", desc: "Always burns, never tans" },
  { level: 2, label: "Type II", desc: "Burns easily, tans minimally" },
  { level: 3, label: "Type III", desc: "Sometimes burns, tans uniformly" },
  { level: 4, label: "Type IV", desc: "Burns minimally, tans easily" },
  { level: 5, label: "Type V", desc: "Rarely burns, tans profusely" },
  { level: 6, label: "Type VI", desc: "Never burns, deeply pigmented" }
]

export default function OnboardingPage() {
  const { user, isLoading, createProfile, skipOnboarding } = useAuth()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    ageRange: 25,
    skinType: "Balanced",
    skinToneLevel: 4,
    knownSkinAllergies: [] as string[],
    previousTreatments: [] as string[],
    onboardingSkipped: false
  })

  useEffect(() => {
    if (!isLoading && user?.onboardingCompleted) {
      router.replace("/dashboard")
    }
  }, [user, isLoading, router])

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await createProfile({
        ...formData,
        onboardingSkipped: false
      })
      router.replace("/dashboard")
    } catch (error) {
      console.error("Onboarding failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSkip = async () => {
    setIsSubmitting(true)
    try {
      await skipOnboarding()
      router.replace("/dashboard")
    } catch (error) {
      console.error("Skip failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return null

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-[#E1784F] shadow-[0_0_15px_rgba(225,120,79,0.5)]"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-xl z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="space-y-2 text-center">
              <p className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.6em] mb-4">
                Step {currentStep + 1} of {STEPS.length}
              </p>
              <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                {STEPS[currentStep].title}
              </h1>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest leading-loose">
                {STEPS[currentStep].subtitle}
              </p>
            </div>

            {/* Content Rendering based on Step */}
            <div className="min-h-[300px] flex items-center justify-center">
              {currentStep === 0 && (
                <div className="flex flex-col items-center space-y-8">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-32 h-32 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center"
                  >
                    <User className="text-[#E1784F]" size={48} />
                  </motion.div>
                  <p className="text-center text-white/60 text-sm max-w-xs leading-relaxed">
                    Hello <span className="text-white font-bold">{user?.firstName}</span>, we need a few details to optimize our AI dermatology logic for your unique skin profile.
                  </p>
                </div>
              )}

              {currentStep === 1 && (
                <div className="w-full space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 ml-2">Age Range</label>
                    <div className="grid grid-cols-4 gap-4">
                      {[18, 25, 35, 50].map((age) => (
                        <button
                          key={age}
                          onClick={() => setFormData({ ...formData, ageRange: age })}
                          className={`py-6 rounded-2xl text-sm font-black transition-all border-2 ${formData.ageRange === age
                              ? "bg-[#E1784F] border-[#E1784F] text-white shadow-lg shadow-[#E1784F]/20"
                              : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                            }`}
                        >
                          {age === 50 ? "50+" : age === 18 ? "<25" : age === 25 ? "25-34" : "35-49"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="w-full grid grid-cols-1 gap-4">
                  {SKIN_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setFormData({ ...formData, skinType: type.id })}
                      className={`p-6 rounded-3xl text-left transition-all border-2 flex items-center justify-between ${formData.skinType === type.id
                          ? "bg-[#4DB6AC] border-[#4DB6AC] text-white shadow-lg shadow-[#4DB6AC]/20"
                          : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                        }`}
                    >
                      <div>
                        <p className="font-black uppercase text-[11px] tracking-widest">{type.label}</p>
                        <p className="text-[9px] opacity-60 font-medium uppercase tracking-tighter mt-1">{type.desc}</p>
                      </div>
                      {formData.skinType === type.id && <Check size={18} />}
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 3 && (
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {SKIN_TONES.map((tone) => (
                      <button
                        key={tone.level}
                        onClick={() => setFormData({ ...formData, skinToneLevel: tone.level })}
                        className={`p-4 rounded-2xl text-center transition-all border-2 ${formData.skinToneLevel === tone.level
                            ? "bg-[#E1784F] border-[#E1784F] text-white"
                            : "bg-white/5 border-transparent text-white/40"
                          }`}
                      >
                        <div
                          className="w-full h-8 rounded-lg mb-2"
                          style={{ backgroundColor: `hsl(25, ${30 + tone.level * 5}%, ${80 - tone.level * 10}%)` }}
                        />
                        <p className="font-black text-[9px] uppercase tracking-widest">{tone.label}</p>
                      </button>
                    ))}
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#E1784F] mb-1">Selected: {SKIN_TONES[formData.skinToneLevel - 1].label}</p>
                    <p className="text-[8px] text-white/40 uppercase tracking-tighter">{SKIN_TONES[formData.skinToneLevel - 1].desc}</p>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="w-full space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-2">
                      <AlertCircle size={12} className="text-red-500" />
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Known Skin Allergies</label>
                    </div>
                    <textarea
                      value={formData.knownSkinAllergies.join(", ")}
                      onChange={(e) => setFormData({ ...formData, knownSkinAllergies: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                      placeholder="e.g. Fragrance, Vitamin C, Benzoyl Peroxide"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-[#E1784F] transition-all resize-none h-24"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 ml-2">
                      <ShieldCheck size={12} className="text-[#4DB6AC]" />
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Previous Treatments</label>
                    </div>
                    <textarea
                      value={formData.previousTreatments.join(", ")}
                      onChange={(e) => setFormData({ ...formData, previousTreatments: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                      placeholder="e.g. Chemical Peels, Laser Therapy, Accutane"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm outline-none focus:border-[#4DB6AC] transition-all resize-none h-24"
                    />
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="flex flex-col items-center space-y-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="w-20 h-20 border-4 border-t-[#E1784F] border-white/5 rounded-full"
                  />
                  <div className="text-center space-y-2">
                    <p className="text-white/80 font-black uppercase text-[11px] tracking-[0.4em]">Finalizing your vault</p>
                    <p className="text-white/30 font-medium uppercase text-[8px] tracking-widest">Encrypting clinical data nodes...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center gap-4">
                {currentStep > 0 && currentStep < STEPS.length - 1 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/60 hover:text-white transition-all group"
                  >
                    <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                  </button>
                )}

                {currentStep < STEPS.length - 1 && (
                  <button
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className={`h-16 rounded-2xl flex items-center justify-center font-black uppercase tracking-[0.3em] text-[11px] transition-all ${currentStep === 0 ? "w-full" : "flex-[3]"
                      } bg-[#E1784F] text-white shadow-xl shadow-[#E1784F]/20 hover:scale-[1.02] active:scale-95`}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : (
                      <>
                        {currentStep === 4 ? "Review & Sync" : "Continue"}
                        <ChevronRight className="ml-2" size={16} />
                      </>
                    )}
                  </button>
                )}
              </div>

              {currentStep < 5 && (
                <button
                  onClick={handleSkip}
                  disabled={isSubmitting}
                  className="w-full py-4 text-white/20 hover:text-white/40 text-[9px] font-black uppercase tracking-[0.5em] transition-all"
                >
                  Skip Onboarding for now
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Aesthetic Footer */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center opacity-10">
        <div className="flex items-center gap-8">
          <Activity size={14} />
          <div className="w-12 h-[1px] bg-white" />
          <Zap size={14} />
          <div className="w-12 h-[1px] bg-white" />
          <ShieldCheck size={14} />
        </div>
      </div>
    </div>
  )
}
