/**
 * 🛡️ AFRIDAM CLINICAL ACCESS: REGISTRATION
 * Version: 2026.1.25
 * Focus: Premium Glassmorphism, Dual Brand Glow (Teal & Orange), Mobile-First Precision.
 */

"use client"

import React, { useEffect, useRef, useState } from "react"
import { 
  Mail, 
  Phone, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ChevronLeft, 
  ShieldCheck, 
  Fingerprint, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles, 
  User, 
  Globe, 
  UserCheck 
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const REGISTER_DRAFT_KEY = "afridam:register-draft"

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  sex: "male",
  country: "Nigeria",
  phoneNo: "",
  password: ""
}

export default function RegisterPage() {
  const { signUp } = useAuth() as any
  const router = useRouter()
  const formTopRef = useRef<HTMLDivElement>(null)
  
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState(initialFormData)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)

  // --- DRAFT PERSISTENCE LOGIC ---
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem(REGISTER_DRAFT_KEY)
      if (draft) {
        const parsed = JSON.parse(draft)
        setStep(parsed.step === 2 ? 2 : 1)
        setFormData({ ...initialFormData, ...parsed.formData })
        setAcceptPrivacy(Boolean(parsed.acceptPrivacy))
      }
    } catch {
      sessionStorage.removeItem(REGISTER_DRAFT_KEY)
    } finally {
      setHasLoadedDraft(true)
    }
  }, [])

  useEffect(() => {
    if (!hasLoadedDraft) return

    sessionStorage.setItem(
      REGISTER_DRAFT_KEY,
      JSON.stringify({ step, formData, acceptPrivacy })
    )
  }, [acceptPrivacy, formData, hasLoadedDraft, step])

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Step 1 Transition
    if (step === 1) {
      setStep(2)
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      return
    }
    
    // Require privacy policy acceptance on step 2
    if (step === 2 && !acceptPrivacy) {
      setError("Please accept the privacy policy to create an account.")
      return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      if (step === 2) {
        await signUp(formData)
        sessionStorage.removeItem(REGISTER_DRAFT_KEY)
        router.push(`/verify-email?email=${encodeURIComponent(formData.email)}`)
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "We couldn't process your request. Please check your details and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#080B10] text-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 relative overflow-y-auto overflow-x-hidden selection:bg-[#4DB6AC]/30 font-sans">
      
      {/* --- PREMIUM DYNAMIC GLOWING BACKGROUND --- */}
      {/* Vibrant Brand Color Orbs: Teal-Blue (#4DB6AC) & Orange (#E1784F) */}
      <div className="absolute top-[-10%] left-[-10%] w-[380px] sm:w-[600px] md:w-[800px] h-[380px] sm:h-[600px] md:h-[800px] bg-[#4DB6AC]/20 rounded-full blur-[120px] md:blur-[220px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[380px] sm:w-[600px] md:w-[800px] h-[380px] sm:h-[600px] md:h-[800px] bg-[#E1784F]/20 rounded-full blur-[120px] md:blur-[220px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#4DB6AC]/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay" />

      {/* --- MAIN CONTAINER --- */}
      <motion.div 
        ref={formTopRef}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-xl space-y-6 sm:space-y-8 relative z-10 my-auto py-6"
      >
        
        {/* BRAND LOGO & HEADER */}
        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto flex items-center justify-center p-3 rounded-3xl bg-gradient-to-br from-[#4DB6AC]/20 via-black/60 to-[#E1784F]/20 border border-white/15 backdrop-blur-xl shadow-[0_0_50px_rgba(77,182,172,0.25)] group cursor-pointer"
          >
            {/* Glowing Accent Ring behind logo */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#4DB6AC] to-[#E1784F] opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500" />
            
            {/* Brand Logo Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-black/40 border border-white/10 p-2">
              <Image 
                src="/logo.png" 
                alt="Brand Logo" 
                width={120} 
                height={120} 
                className="object-contain w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
                priority
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              <div className="hidden group-only:flex items-center justify-center w-full h-full">
                <Sparkles className="w-10 h-10 text-[#4DB6AC]" />
              </div>
            </div>
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
              CREATE <span className="bg-gradient-to-r from-[#4DB6AC] via-[#7CD8CE] to-[#E1784F] bg-clip-text text-transparent">ACCOUNT</span>
            </h1>

            {/* STEP PROGRESS BAR */}
            <div className="flex flex-col items-center gap-2 pt-2">
              <div className="flex justify-center gap-2">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 1 ? 'w-16 bg-gradient-to-r from-[#4DB6AC] to-[#E1784F]' : 'w-4 bg-white/20'}`} />
                <div className={`h-1.5 rounded-full transition-all duration-500 ${step === 2 ? 'w-16 bg-gradient-to-r from-[#4DB6AC] to-[#E1784F]' : 'w-4 bg-white/20'}`} />
              </div>
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Step {step} of 2 — {step === 1 ? "Personal Profile" : "Security Details"}
              </p>
            </div>
          </div>
        </div>

        {/* --- FORM CARD WITH GLASSMORPHISM --- */}
        <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">
          
          {/* Subtle Accent Glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#4DB6AC] via-[#E1784F] to-[#4DB6AC]" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold uppercase tracking-wider text-center backdrop-blur-md"
              >
                {error}
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  {/* FIRST & LAST NAME */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                        First Name
                      </label>
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#4DB6AC] transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          className="w-full bg-white/[0.05] border border-white/15 focus:border-[#4DB6AC] focus:shadow-[0_0_20px_rgba(77,182,172,0.25)] rounded-2xl pl-12 pr-4 py-3.5 text-white font-medium focus:outline-none transition-all text-sm placeholder:text-white/30"
                          placeholder="John"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                        Last Name
                      </label>
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#4DB6AC] transition-colors">
                          <User className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          className="w-full bg-white/[0.05] border border-white/15 focus:border-[#4DB6AC] focus:shadow-[0_0_20px_rgba(77,182,172,0.25)] rounded-2xl pl-12 pr-4 py-3.5 text-white font-medium focus:outline-none transition-all text-sm placeholder:text-white/30"
                          placeholder="Doe"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEX & COUNTRY */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                        Gender
                      </label>
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#4DB6AC] transition-colors">
                          <UserCheck className="w-5 h-5" />
                        </div>
                        <select
                          value={formData.sex}
                          onChange={(e) => setFormData({...formData, sex: e.target.value})}
                          className="w-full bg-[#0E131F] border border-white/15 focus:border-[#4DB6AC] focus:shadow-[0_0_20px_rgba(77,182,172,0.25)] rounded-2xl pl-12 pr-8 py-3.5 text-white font-medium focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                        >
                          <option value="male" className="bg-[#080B10] text-white">Male</option>
                          <option value="female" className="bg-[#080B10] text-white">Female</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                        Country
                      </label>
                      <div className="relative group/input">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#4DB6AC] transition-colors">
                          <Globe className="w-5 h-5" />
                        </div>
                        <select
                          value={formData.country}
                          onChange={(e) => setFormData({...formData, country: e.target.value})}
                          className="w-full bg-[#0E131F] border border-white/15 focus:border-[#4DB6AC] focus:shadow-[0_0_20px_rgba(77,182,172,0.25)] rounded-2xl pl-12 pr-8 py-3.5 text-white font-medium focus:outline-none transition-all text-sm appearance-none cursor-pointer"
                        >
                          <option value="Nigeria" className="bg-[#080B10] text-white">Nigeria</option>
                          <option value="Ghana" className="bg-[#080B10] text-white">Ghana</option>
                          <option value="Kenya" className="bg-[#080B10] text-white">Kenya</option>
                          <option value="USA" className="bg-[#080B10] text-white">USA</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/40 text-xs">▼</div>
                      </div>
                    </div>
                  </div>

                  {/* PHONE NUMBER */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                      Phone Number
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#4DB6AC] transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phoneNo}
                        onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                        className="w-full bg-white/[0.05] border border-white/15 focus:border-[#4DB6AC] focus:shadow-[0_0_20px_rgba(77,182,172,0.25)] rounded-2xl pl-12 pr-4 py-3.5 text-white font-medium focus:outline-none transition-all text-sm placeholder:text-white/30"
                        placeholder="+234 800 000 0000"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  {/* STEP NAV BACK BUTTON */}
                  <button 
                    type="button" 
                    onClick={() => setStep(1)} 
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#4DB6AC] hover:text-white transition-colors"
                  >
                    <ChevronLeft size={16} /> 
                    <span>Back to Personal Details</span>
                  </button>

                  {/* EMAIL ADDRESS */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                      Email Address
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#E1784F] transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-white/[0.05] border border-white/15 focus:border-[#E1784F] focus:shadow-[0_0_20px_rgba(225,120,79,0.25)] rounded-2xl pl-12 pr-4 py-3.5 text-white font-medium focus:outline-none transition-all text-sm placeholder:text-white/30"
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                  </div>

                  {/* CREATE PASSWORD */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                      Create Password
                    </label>
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#E1784F] transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-white/[0.05] border border-white/15 focus:border-[#E1784F] focus:shadow-[0_0_20px_rgba(225,120,79,0.25)] rounded-2xl pl-12 pr-12 py-3.5 text-white font-medium focus:outline-none transition-all text-sm placeholder:text-white/30"
                        placeholder="••••••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#E1784F] transition-colors p-1"
                        aria-label="Toggle Password Visibility"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* SECURITY NOTIFICATION */}
                  <div className="flex items-start gap-3 p-3.5 bg-white/[0.03] rounded-2xl border border-white/10">
                    <ShieldCheck className="text-[#4DB6AC] shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-white/60 font-medium leading-relaxed">
                      Your clinical and identity data is end-to-end encrypted and safeguarded under high compliance standards.
                    </p>
                  </div>

                  {/* PRIVACY POLICY CHECKBOX */}
                  <div className="flex items-start gap-3 p-3.5 bg-white/[0.03] rounded-2xl border border-white/10">
                    <div className="shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        id="privacy-policy"
                        checked={acceptPrivacy}
                        onChange={(e) => setAcceptPrivacy(e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#4DB6AC] focus:ring-[#4DB6AC] focus:ring-offset-0 cursor-pointer accent-[#4DB6AC]"
                      />
                    </div>
                    <label htmlFor="privacy-policy" className="text-xs text-white/70 font-medium leading-relaxed cursor-pointer select-none">
                      I accept the <a href="/privacy-policy" className="text-[#4DB6AC] hover:underline underline-offset-2 font-bold">Privacy Policy</a> and consent to the platform guidelines.
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading || (step === 2 && !acceptPrivacy)}
                className="group w-full bg-gradient-to-r from-[#E1784F] to-[#d8683e] hover:from-[#f2865e] hover:to-[#E1784F] text-white font-black uppercase text-xs sm:text-sm tracking-[0.25em] py-4 rounded-2xl shadow-[0_10px_35px_rgba(225,120,79,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <span>{step === 1 ? "Continue" : "Create Account"}</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform text-[#4DB6AC]" />
                  </>
                )}
              </button>

              {/* BACK TO HOME BUTTON */}
              <button
                type="button"
                onClick={() => {
                  sessionStorage.removeItem(REGISTER_DRAFT_KEY)
                  router.push("/")
                }}
                className="w-full flex items-center justify-center gap-2 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest py-2.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </form>
        </div>

        {/* --- FOOTER INFO --- */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/60 text-xs font-medium">
            <Fingerprint size={15} className="text-[#4DB6AC]" />
            <span>Secure Access Point</span>
          </div>

          <p className="text-xs text-white/50 font-medium">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-white hover:text-[#4DB6AC] font-bold underline underline-offset-4 decoration-[#4DB6AC] transition-all ml-1"
            >
              Log in here
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  )
}