"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, ShieldCheck, CheckCircle2, ChevronDown, Globe, Lock, ArrowRight, Loader2 } from "lucide-react"
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
      setError("Please agree to the clinical protocols.");
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
        // Forgot Password Logic Placeholder
        setError("Recovery instructions sent to your email.")
        setTimeout(() => setAuthView("signin"), 3000)
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Server Error (500)";
      setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose} 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl" 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-background border border-border rounded-[3.5rem] shadow-2xl w-full max-w-md z-10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/10 blur-[60px] rounded-full" />
        
        <div className="p-10 max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-start mb-10">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-foreground tracking-tighter uppercase italic leading-none">
                {authView === "signin" ? "Login" : authView === "signup" ? "Join" : "Reset"}
              </h2>
              <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.4em]">
                {authView === "forgot" ? "Account Recovery" : "Dignity in Care"}
              </p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
              <X size={18} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authView === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <input required placeholder="First Name" className="auth-input" onChange={(e) => setFirstName(e.target.value)} />
                  <input required placeholder="Last Name" className="auth-input" onChange={(e) => setLastName(e.target.value)} />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <select 
                      value={sex}
                      onChange={(e) => setSex(e.target.value)}
                      className="auth-input appearance-none w-full cursor-pointer"
                    >
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={14} />
                  </div>
                  <input required type="tel" placeholder="Phone No" className="auth-input" onChange={(e) => setPhoneNo(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <select 
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      className="auth-input appearance-none w-full cursor-pointer"
                    >
                      {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Globe className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 pointer-events-none" size={14} />
                  </div>
                  {nationality === "Other" && (
                    <motion.input 
                      initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                      required placeholder="Enter your country" className="auth-input w-full" 
                      onChange={(e) => setOtherCountry(e.target.value)}
                    />
                  )}
                </div>
              </>
            )}

            <input
              required
              type="email"
              placeholder="Email Address"
              className="auth-input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {authView !== "forgot" && (
              <div className="space-y-2">
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="auth-input w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {authView === "signin" && (
                  <button 
                    type="button" 
                    onClick={() => setAuthView("forgot")}
                    className="text-[9px] font-black uppercase tracking-widest text-[#E1784F] ml-2 hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
            )}

            {authView === "signup" && (
              <div className="flex items-center gap-4 py-2 px-2">
                <div 
                  onClick={() => setAgreedToTerms(!agreedToTerms)}
                  className={`shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${agreedToTerms ? 'bg-[#4DB6AC] border-[#4DB6AC]' : 'border-border bg-muted'}`}
                >
                  {agreedToTerms && <CheckCircle2 size={14} className="text-white" />}
                </div>
                <label className="text-[9px] text-muted-foreground font-black uppercase tracking-[0.15em] cursor-pointer">
                  Accept <span className="text-[#E1784F]">Clinical Protocols</span>
                </label>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest text-center animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] text-white font-black uppercase text-[10px] tracking-[0.3em] py-6 rounded-2xl shadow-2xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : (
                <>
                  {authView === "signin" ? "Authorize Entry" : authView === "signup" ? "Create Account" : "Send Reset Link"}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button 
              type="button"
              onClick={() => setAuthView(authView === "signin" ? "signup" : "signin")}
              className="w-full text-center text-[9px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              {authView === "signin" ? "New here? Sign Up" : "Already a member? Login"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}