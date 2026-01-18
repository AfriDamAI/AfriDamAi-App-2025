/**
 * 🛡️ AFRIDAM WELLNESS HUB: AUTH MODALS
 * Version: 2026.1.5 (Professional & Mobile-First)
 * Handshake: Fully synced with archived api-client.ts
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, CheckCircle2, Globe, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion } from "framer-motion"

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
      setError("PLEASE ACCEPT WELLNESS TERMS.");
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
        setSuccess("RECOVERY LINK SENT.")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Connection Error");
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={onClose} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} className="relative bg-[#1C1A19] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[3rem] w-full max-w-lg z-10">
        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto no-scrollbar">
          
          <header className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
              {authView === "signin" ? "Welcome" : authView === "signup" ? "Join Us" : "Recover"}
            </h2>
            <button onClick={onClose} className="p-2 bg-white/5 rounded-xl text-gray-500"><X size={20} /></button>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === "signup" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="FIRST NAME" className="auth-input-premium" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input required placeholder="LAST NAME" className="auth-input-premium" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   <div className="relative">
                    <select 
                      value={nationality}
                      onChange={(e) => {
                        const country = AFRICAN_COUNTRIES.find(c => c.name === e.target.value);
                        setNationality(e.target.value);
                        if (country) setCountryCode(country.code);
                      }}
                      className="auth-input-premium appearance-none w-full pr-10"
                    >
                      {AFRICAN_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name.toUpperCase()}</option>)}
                    </select>
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center justify-center bg-[#252321] border border-white/5 rounded-2xl px-3 text-[9px] font-black text-[#E1784F]">{countryCode}</span>
                    <input required type="tel" placeholder="PHONE" className="auth-input-premium flex-1" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <input required type="email" placeholder="EMAIL ADDRESS" className="auth-input-premium w-full" value={email} onChange={(e) => setEmail(e.target.value)} />

            {authView !== "forgot" && (
              <div className="relative">
                <input required type={showPassword ? "text" : "password"} placeholder="PASSWORD" className="auth-input-premium w-full pr-14" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {authView === "signup" && (
              <div className="flex items-center gap-3 py-2">
                <button 
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`shrink-0 w-5 h-5 rounded-lg border transition-all flex items-center justify-center ${agreedToTerms ? 'bg-[#4DB6AC] border-[#4DB6AC]' : 'border-white/10 bg-white/5'}`}
                >
                  {agreedToTerms && <CheckCircle2 size={12} className="text-white" />}
                </button>
                <label className="text-[8px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  I Accept the <span className="text-[#4DB6AC]">Wellness Terms</span>
                </label>
              </div>
            )}

            {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[8px] font-black uppercase text-center">{error}</div>}
            {success && <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-[8px] font-black uppercase text-center">{success}</div>}

            <button disabled={isLoading} className="w-full bg-[#E1784F] text-white font-black uppercase text-[10px] tracking-[0.3em] py-5 rounded-2xl shadow-xl flex items-center justify-center gap-2">
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <>{authView === "signin" ? "Enter Hub" : "Create Account"} <ArrowRight size={14} /></>}
            </button>

            <button type="button" onClick={() => { resetStates(); setAuthView(authView === "signin" ? "signup" : "signin"); }} className="w-full text-[8px] font-black uppercase tracking-widest text-gray-500">
              {authView === "signin" ? "New? Join Us" : "Already a member? Login"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}