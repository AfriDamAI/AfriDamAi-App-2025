"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { X, ShieldCheck, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"

interface AuthModalsProps {
  isOpen: boolean
  onClose: () => void
  type: "signin" | "signup"
}

export function AuthModals({ isOpen, onClose, type }: AuthModalsProps) {
  const router = useRouter()
  const { signIn, signUp, user } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [sex, setSex] = useState("male")
  const [phoneNo, setPhoneNo] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false) // 🛡️ Mandatory for World-Class status
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user && isOpen) {
      onClose();
      router.push('/dashboard'); // Taking them to the portal hub first
    }
  }, [user, isOpen, router, onClose]); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 🛡️ Legal Check
    if (type === "signup" && !agreedToTerms) {
      setError("Please acknowledge the clinical terms to continue.");
      return;
    }

    setError("")
    setIsLoading(true)

    try {
      if (type === "signin") {
        await signIn({ email, password })
      } else {
        await signUp({
          firstName,
          lastName,
          email,
          sex,
          phoneNo,
          password
        })
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Authentication failed";
      setError(Array.isArray(errorMessage) ? errorMessage[0] : errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/90 z-[60] backdrop-blur-xl transition-all" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1C1A19] border border-white/10 rounded-[3rem] shadow-[0_0_100px_rgba(225,120,79,0.1)] w-full max-w-md z-[70] p-10 overflow-hidden">
        
        {/* Branding Background Glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/10 blur-[60px] rounded-full pointer-events-none" />
        
        <div className="flex justify-between items-center mb-10 relative z-10">
          <div className="flex flex-col">
            <h2 className="text-3xl font-black text-[#F7F3EE] tracking-tighter uppercase italic">
              {type === "signin" ? "Initialize" : "Register"}
            </h2>
            <p className="text-[10px] font-black text-[#E1784F] uppercase tracking-[0.4em]">Your Skin, Decoded</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {type === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#E1784F] transition-all"
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#E1784F] transition-all"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <input
                type="tel"
                placeholder="Phone (e.g. +250...)"
                className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#E1784F] transition-all"
                onChange={(e) => setPhoneNo(e.target.value)}
              />
            </>
          )}

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#E1784F] transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Secure Password"
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-sm outline-none focus:border-[#E1784F] transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {type === "signup" && (
            <div className="flex items-start gap-3 py-4 px-2">
              <div 
                onClick={() => setAgreedToTerms(!agreedToTerms)}
                className={`mt-1 shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${agreedToTerms ? 'bg-[#4DB6AC] border-[#4DB6AC]' : 'border-white/20 bg-white/5'}`}
              >
                {agreedToTerms && <CheckCircle2 size={14} className="text-black" />}
              </div>
              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed cursor-pointer select-none" onClick={() => setAgreedToTerms(!agreedToTerms)}>
                I acknowledge that AI analysis is for informational use and agree to the 
                <span className="text-[#E1784F] ml-1">Terms of Service</span>
              </label>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E1784F] text-white font-black uppercase text-[10px] tracking-[0.3em] py-6 rounded-[1.5rem] shadow-2xl shadow-[#E1784F]/20 disabled:opacity-50 hover:brightness-110 active:scale-[0.98] transition-all mt-4"
          >
            {isLoading ? "Synchronizing..." : (type === "signin" ? "Initialize Portal" : "Generate Account")}
          </button>
        </form>
      </div>
    </>
  )
}