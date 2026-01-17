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
  const { signIn, signUp, user, forgotPassword } = useAuth() 
  
  const [authView, setAuthView] = useState<"signin" | "signup" | "forgot">(initialType)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [sex] = useState("female") 
  const [nationality, setNationality] = useState("Nigeria")
  const [countryCode, setCountryCode] = useState("+234") 
  const [phoneNo, setPhoneNo] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false) 
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("") 
  const [isLoading, setIsLoading] = useState(false)

  const resetStates = () => {
    setError("")
    setSuccess("")
    setEmail("")
    setPassword("")
    setFirstName("")
    setLastName("")
    setPhoneNo("")
    setAgreedToTerms(false)
    setShowPassword(false)
  }

  useEffect(() => {
    if (isOpen) {
      setAuthView(initialType)
      resetStates()
    }
  }, [initialType, isOpen])

  useEffect(() => {
    if (user && isOpen) {
      onClose();
      router.push('/dashboard'); 
    }
  }, [user, isOpen, router, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (authView === "signup" && !agreedToTerms) {
      setError("PLEASE ACCEPT HEALTH PROTOCOLS.");
      return;
    }

    setIsLoading(true)

    try {
      if (authView === "signin") {
        await signIn({ email, password })
      } else if (authView === "signup") {
        const fullPhone = `${countryCode}${phoneNo.replace(/\D/g, '')}`; 
        await signUp({
          firstName, lastName, email, sex, phoneNo: fullPhone, password, nationality
        })
      } else if (authView === "forgot") {
        await forgotPassword(email)
        setSuccess("RECOVERY LINK DISPATCHED IF ACCOUNT EXISTS.")
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
        className="relative bg-[#1C1A19] border-t md:border border-white/10 rounded-t-[2.5rem] md:rounded-[3rem] shadow-2xl w-full max-w-lg z-10 overflow-hidden"
      >
        <div className="p-6 md:p-12 max-h-[85vh] md:max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-6 md:mb-10">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-[#F7F3EE] uppercase italic">
                {authView === "signin" ? "Welcome Back" : authView === "signup" ? "Create Account" : "Reset Access"}
              </h2>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 border border-white/10 text-gray-400">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === "signup" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="FIRST NAME" className="auth-input-premium bg-[#252321] text-[#F7F3EE]" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                  <input required placeholder="LAST NAME" className="auth-input-premium bg-[#252321] text-[#F7F3EE]" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="relative">
                    <select 
                      value={nationality}
                      onChange={(e) => {
                        const country = AFRICAN_COUNTRIES.find(c => c.name === e.target.value);
                        setNationality(e.target.value);
                        if (country) setCountryCode(country.code);
                      }}
                      className="auth-input-premium appearance-none w-full bg-[#252321] text-[#F7F3EE] pr-10"
                    >
                      {AFRICAN_COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name.toUpperCase()}</option>)}
                    </select>
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center justify-center bg-[#252321] border border-white/10 rounded-2xl px-3 text-[10px] font-black text-[#E1784F]">{countryCode}</span>
                    <input required type="tel" placeholder="PHONE" className="auth-input-premium bg-[#252321] text-[#F7F3EE] flex-1" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            <input
              required
              type="email"
              placeholder="EMAIL ADDRESS"
              className="auth-input-premium w-full bg-[#252321] text-[#F7F3EE]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {authView !== "forgot" && (
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="PASSWORD"
                  className="auth-input-premium w-full bg-[#252321] text-[#F7F3EE] pr-14"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-white/20">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}

            {authView === "signup" && (
              <div className="flex items-center gap-4 py-2">
                <button 
                  type="button"
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${agreedToTerms ? 'bg-[#4DB6AC] border-[#4DB6AC]' : 'border-white/10 bg-white/5'}`}
                >
                  {agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                </button>
                <label className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
                  Accept <span className="text-[#4DB6AC]">Health Protocols</span>
                </label>
              </div>
            )}

            {error && <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase text-center">{error}</div>}
            {success && <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 text-[9px] font-black uppercase text-center">{success}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] text-white font-black uppercase text-[11px] tracking-[0.3em] py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>{authView === "signin" ? "Login Now" : authView === "signup" ? "Create Account" : "Send Link"} <ArrowRight size={16} /></>
              )}
            </button>

            <button 
              type="button"
              onClick={() => { resetStates(); setAuthView(authView === "signin" ? "signup" : "signin"); }}
              className="w-full text-center text-[9px] font-black uppercase tracking-widest text-gray-500 pt-2"
            >
              {authView === "signin" ? "New here? Create Account" : "Already a member? Login"}
            </button>
            {authView === "signin" && (
              <button 
                type="button"
                onClick={() => setAuthView("forgot")}
                className="w-full text-center text-[9px] font-black uppercase tracking-widest text-[#E1784F] opacity-70 hover:opacity-100 transition-opacity"
              >
                Forgot Password?
              </button>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  )
}