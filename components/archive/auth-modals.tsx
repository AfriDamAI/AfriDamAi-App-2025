/**
 * 🛡️ AFRIDAM CLINICAL ACCESS: AUTH MODALS
 * Version: 2026.1.5 (World-Class & Mobile-First)
 * Handshake: Fully synced with lib/api-client.ts
 * Focus: High-Contrast, Mature Typography, Rule 8 Compliance.
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, CheckCircle2, Globe, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck, Fingerprint } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

const AFRICAN_COUNTRIES = [
  { name: "Nigeria", code: "+234" },
  { name: "Ghana", code: "+233" },
  { name: "Kenya", code: "+254" },
  { name: "South Africa", code: "+27" },
  { name: "Ethiopia", code: "+251" },
  { name: "Rwanda", code: "+250" },
  { name: "Uganda", code: "+256" },
  { name: "Egypt", code: "+20" },
  { name: "Morocco", code: "+212" }
];

interface AuthModalsProps {
  isOpen: boolean
  onClose: () => void
  type: "signin" | "signup"
}

export function AuthModals({ isOpen, onClose, type: initialType }: AuthModalsProps) {
  const router = useRouter()
  const { signIn, signUp, user, forgotPassword } = useAuth() 
  
  const [authView, setAuthView] = useState<"signin" | "signup" | "forgot">(initialType)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [nationality, setNationality] = useState("Nigeria")
  const [countryCode, setCountryCode] = useState("+234") 
  const [phoneNo, setPhoneNo] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false) 
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("") 
  const [isLoading, setIsLoading] = useState(false)

  const resetStates = () => {
    setError(""); setSuccess(""); setEmail(""); setPassword("");
    setFirstName(""); setLastName(""); setPhoneNo("");
    setAgreedToTerms(false); setShowPassword(false);
  }

  useEffect(() => {
    if (isOpen) { setAuthView(initialType); resetStates(); }
  }, [initialType, isOpen])

  useEffect(() => {
    if (user && isOpen) { onClose(); router.push('/dashboard'); }
  }, [user, isOpen, router, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(""); setSuccess("");

    if (authView === "signup" && !agreedToTerms) {
      setError("AUTHENTICATION REQUIRES WELLNESS TERMS ACCEPTANCE.");
      return;
    }

    setIsLoading(true)
    try {
      if (authView === "signin") {
        await signIn({ email, password })
      } else if (authView === "signup") {
        const fullPhone = `${countryCode}${phoneNo.replace(/\D/g, '')}`; 
        await signUp({
          firstName, lastName, email, sex: "not_specified", phoneNo: fullPhone, password, nationality
        })
      } else if (authView === "forgot") {
        await forgotPassword(email)
        setSuccess("RECOVERY NODE INITIALIZED. CHECK EMAIL.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "ENGINE ROOM TIMEOUT. RETRY.");
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[500] flex items-end md:items-center justify-center">
      {/* 🛡️ THEME-ADAPTIVE BACKDROP (RULE 8) */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/80 dark:bg-black/95 backdrop-blur-2xl" 
      />
      
      <motion.div 
        initial={{ y: "100%", opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-white dark:bg-[#0A0A0A] border-t md:border border-gray-100 dark:border-white/10 rounded-t-[3.5rem] md:rounded-[4rem] w-full max-w-2xl z-10 overflow-hidden shadow-2xl"
      >
        {/* Cinematic Ambiance Orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="p-10 md:p-16 max-h-[90vh] overflow-y-auto no-scrollbar relative z-10">
          
          <header className="flex justify-between items-start mb-12">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-[#E1784F] uppercase tracking-[0.4em]">Clinical Access</p>
              <h2 className="text-5xl md:text-7xl font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">
                {authView === "signin" ? "Enter" : authView === "signup" ? "Join" : "Recover"}
              </h2>
            </div>
            <button onClick={onClose} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-400 hover:text-[#E1784F] transition-all">
              <X size={24} />
            </button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {authView === "signup" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input required placeholder="FIRST NAME" className="auth-input-v2" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input required placeholder="LAST NAME" className="auth-input-v2" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="relative group">
                    <select 
                      value={nationality}
                      onChange={(e) => {
                        const country = AFRICAN_COUNTRIES.find(c => c.name === e.target.value);
                        setNationality(e.target.value);
                        if (country) setCountryCode(country.code);
                      }}
                      className="auth-input-v2 appearance-none w-full pr-12 cursor-pointer"
                    >
                      {AFRICAN_COUNTRIES.map(c => <option key={c.name} value={c.name} className="bg-white dark:bg-[#0A0A0A]">{c.name.toUpperCase()}</option>)}
                    </select>
                    <Globe className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#E1784F] transition-colors" size={16} />
                  </div>
                  <div className="flex gap-4">
                    <span className="flex items-center justify-center bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[1.5rem] px-5 text-[11px] font-black text-[#E1784F]">{countryCode}</span>
                    <input required type="tel" placeholder="MOBILE" className="auth-input-v2 flex-1" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <input required type="email" placeholder="EMAIL ADDRESS" className="auth-input-v2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />

              {authView !== "forgot" && (
                <div className="relative group">
                  <input required type={showPassword ? "text" : "password"} placeholder="PASSWORD" className="auth-input-v2 w-full pr-16" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#E1784F] transition-all">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              )}
            </div>

            {authView === "signup" && (
              <div className="flex items-start gap-4 py-4 px-4 bg-gray-50 dark:bg-white/5 rounded-3xl border border-gray-100 dark:border-white/10">
                <button 
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`shrink-0 w-6 h-6 rounded-xl border transition-all flex items-center justify-center ${agreedToTerms ? 'bg-[#4DB6AC] border-[#4DB6AC]' : 'border-gray-200 dark:border-white/20 bg-white dark:bg-[#0A0A0A]'}`}
                >
                  {agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                </button>
                <label className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  I accept the <span className="text-black dark:text-white font-black underline decoration-[#E1784F] underline-offset-4 cursor-pointer">Wellness Protocols</span> & Data Protection Act.
                </label>
              </div>
            )}

            {error && <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center italic">{error}</div>}
            {success && <div className="p-5 bg-[#4DB6AC]/5 border border-[#4DB6AC]/10 rounded-2xl text-[#4DB6AC] text-[10px] font-black uppercase tracking-widest text-center">{success}</div>}

            <div className="pt-6 space-y-8">
              <button disabled={isLoading} className="w-full bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[12px] tracking-[0.4em] py-8 rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-[#E1784F] hover:text-white disabled:opacity-50 active:scale-[0.98]">
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>{authView === "signin" ? "Authenticate" : "Create Profile"} <ArrowRight size={18} /></>}
              </button>

              <div className="flex flex-col items-center gap-4">
                <button type="button" onClick={() => { resetStates(); setAuthView(authView === "signin" ? "signup" : "signin"); }} className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#4DB6AC] transition-colors">
                  {authView === "signin" ? "Need a profile? Initialize Join" : "Active session? Proceed to Login"}
                </button>
                {authView === "signin" && (
                  <button type="button" onClick={() => setAuthView("forgot")} className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-400/50 hover:text-[#E1784F] transition-colors">
                    Credentials Lost? Reset Node
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* SECURITY LEGEND */}
          <div className="mt-16 pt-10 border-t border-gray-100 dark:border-white/10 flex items-center justify-center gap-6 opacity-30">
            <div className="flex items-center gap-2">
              <ShieldCheck size={14} />
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">AES-256</span>
            </div>
            <div className="flex items-center gap-2">
              <Fingerprint size={14} />
              <span className="text-[8px] font-black uppercase tracking-[0.4em]">Identity Locked</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}