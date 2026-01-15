"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, CheckCircle2, ChevronDown, Globe, ArrowRight, Loader2, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react"
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
  { name: "Morocco", code: "+212" },
  { name: "Other", code: "" }
];

interface AuthModalsProps {
  isOpen: boolean
  onClose: () => void
  type: "signin" | "signup"
}

export function AuthModals({ isOpen, onClose, type: initialType }: AuthModalsProps) {
  const router = useRouter()
  const { signIn, signUp, user } = useAuth()
  
  const [authView, setAuthView] = useState<"signin" | "signup" | "forgot">(initialType)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [sex, setSex] = useState("female")
  const [nationality, setNationality] = useState("Nigeria")
  const [otherCountry, setOtherCountry] = useState("")
  const [phoneNo, setPhoneNo] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false) 
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // 🛡️ RE-ENFORCED: Nuke state when switching views or opening/closing
  const resetStates = () => {
    setError("")
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setPhoneNo("")
    setAgreedToTerms(false)
    setShowPassword(false)
  }

  useEffect(() => {
    setAuthView(initialType)
    resetStates()
  }, [initialType, isOpen])

  useEffect(() => {
    if (user && isOpen) {
      onClose();
      router.push('/dashboard'); 
    }
  }, [user, isOpen, router, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authView === "signup" && !agreedToTerms) {
      setError("PLEASE ACCEPT HEALTH PROTOCOLS.");
      return;
    }

    setError("")
    setIsLoading(true)

    try {
      if (authView === "signin") {
        await signIn({ email, password })
      } else if (authView === "signup") {
        const finalNationality = nationality === "Other" ? otherCountry : nationality;
        await signUp({
          firstName, lastName, email, sex, phoneNo, password, nationality: finalNationality
        })
      } else {
        // Recovery Logic
        setError("RECOVERY LINK SENT IF ACCOUNT EXISTS.")
        setEmail("") 
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Connection Error";
      setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose} 
        className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-xl" 
      />
      
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative bg-[#1C1A19] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-lg z-10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="p-6 md:p-12 max-h-[85vh] md:max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-6 md:mb-10 text-left">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-[#F7F3EE] tracking-tighter uppercase italic leading-none">
                {authView === "signin" ? "Welcome Back" : authView === "signup" ? "Create Account" : "Reset Access"}
              </h2>
              <p className="text-[9px] md:text-[10px] font-black text-[#E1784F] uppercase tracking-[0.4em]">
                {authView === "forgot" ? "Recovery" : "Join AfriDam AI"}
              </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === "signup" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <input required placeholder="FIRST NAME" className="auth-input-premium" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input required placeholder="LAST NAME" className="auth-input-premium" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <div className="relative">
                    <select 
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      className="auth-input-premium appearance-none w-full cursor-pointer pr-10"
                    >
                      <option value="female">FEMALE</option>
                      <option value="male">MALE</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                  </div>
                  <input required type="tel" placeholder="PHONE" className="auth-input-premium" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                </div>

                <div className="relative">
                  <select 
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="auth-input-premium appearance-none w-full cursor-pointer pr-10"
                  >
                    {AFRICAN_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name.toUpperCase()} ({c.code})</option>)}
                  </select>
                  <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                </div>
              </div>
            )}

            <input
              required
              type="email"
              placeholder="EMAIL ADDRESS"
              className="auth-input-premium w-full text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {authView !== "forgot" && (
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  className="auth-input-premium w-full text-white pr-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {authView === "signin" && (
              <button type="button" onClick={() => setAuthView("forgot")} className="text-[9px] font-black uppercase tracking-widest text-[#E1784F] block ml-1">
                Forgot Password?
              </button>
            )}

            {authView === "signup" && (
              <div className="flex items-center gap-4 py-2">
                <div 
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${agreedToTerms ? 'bg-[#4DB6AC] border-[#4DB6AC]' : 'border-white/10 bg-white/5'}`}
                >
                  {agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest cursor-pointer text-left">
                  Accept <span className="text-[#4DB6AC]">Health Protocols</span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] text-white font-black uppercase text-[10px] md:text-[11px] tracking-[0.3em] py-5 md:py-6 rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>{authView === "signin" ? "Login Now" : authView === "signup" ? "Create Account" : "Send Link"} <ArrowRight size={16} /></>
              )}
            </button>

            <button 
              type="button"
              onClick={() => {
                resetStates();
                setAuthView(authView === "signin" ? "signup" : "signin");
              }}
              className="w-full text-center text-[9px] font-black uppercase tracking-widest text-gray-500 pt-2"
            >
              {authView === "signin" ? "New here? Create Account" : "Already a member? Login"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}