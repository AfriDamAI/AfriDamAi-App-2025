"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, CheckCircle2, ChevronDown, Globe, ArrowRight, Loader2, Mail, Lock, User, Phone } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"

const AFRICAN_COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Ethiopia", 
  "Rwanda", "Uganda", "Egypt", "Morocco", "Other"
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

  useEffect(() => {
    if (user && isOpen) {
      onClose();
      router.push('/dashboard'); 
    }
  }, [user, isOpen, router, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (authView === "signup" && !agreedToTerms) {
      setError("Please accept the health protocols.");
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
        setError("Recovery link sent to your email.")
        setTimeout(() => setAuthView("signin"), 3000)
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-[#141211]/95 backdrop-blur-2xl" 
      />
      
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-[#1C1A19] border border-white/10 rounded-[3rem] shadow-2xl w-full max-w-lg z-10 overflow-hidden"
      >
        {/* Decorative Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#E1784F]/10 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="p-8 md:p-12 max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black text-[#F7F3EE] tracking-tighter uppercase italic leading-none">
                {authView === "signin" ? "Welcome Back" : authView === "signup" ? "Create Account" : "Reset Access"}
              </h2>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">
                {authView === "forgot" ? "Recovery" : "Join AfriDam AI"}
              </p>
            </div>
            <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-gray-400">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {authView === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <input required placeholder="First Name" className="auth-input-premium" onChange={(e) => setFirstName(e.target.value)} />
                  <input required placeholder="Last Name" className="auth-input-premium" onChange={(e) => setLastName(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <select 
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      className="auth-input-premium appearance-none w-full cursor-pointer"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                  </div>
                  <input required type="tel" placeholder="Phone Number" className="auth-input-premium" onChange={(e) => setPhoneNo(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <select 
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="auth-input-premium appearance-none w-full cursor-pointer pr-10"
                    >
                      {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                  </div>
                  {nationality === "Other" && (
                    <motion.input 
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      required placeholder="Enter your country" className="auth-input-premium w-full" 
                      onChange={(e) => setOtherCountry(e.target.value)}
                    />
                  )}
                </div>
              </>
            )}

            <div className="relative">
              <input
                required
                type="email"
                placeholder="Email Address"
                className="auth-input-premium w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {authView !== "forgot" && (
              <div className="space-y-3">
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="auth-input-premium w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {authView === "signin" && (
                  <button 
                    type="button" 
                    onClick={() => setAuthView("forgot")}
                    className="text-[10px] font-black uppercase tracking-widest text-[#E1784F] ml-2 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            {authView === "signup" && (
              <div className="flex items-center gap-4 py-2">
                <div 
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${agreedToTerms ? 'bg-[#4DB6AC] border-[#4DB6AC]' : 'border-white/10 bg-white/5'}`}
                >
                  {agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest cursor-pointer">
                  Accept <span className="text-[#4DB6AC]">Health Protocols</span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] text-white font-black uppercase text-[11px] tracking-[0.3em] py-6 rounded-2xl shadow-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {authView === "signin" ? "Login Now" : authView === "signup" ? "Create Account" : "Reset Access"}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={() => setAuthView(authView === "signin" ? "signup" : "signin")}
              className="w-full text-center text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-[#F7F3EE] transition-colors pt-2"
            >
              {authView === "signin" ? "New here? Create Account" : "Already a member? Login"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}