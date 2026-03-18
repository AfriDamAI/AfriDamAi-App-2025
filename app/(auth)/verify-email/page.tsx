"use client"

import React, { useState, useEffect, Suspense } from "react"
import { Lock, ArrowRight, Loader2, X, Fingerprint } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

function VerifyEmailForm() {
  const { verifyRegister } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""
  
  const [verificationCode, setVerificationCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push("/register")
    }
  }, [email, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setError(null)
    setIsLoading(true)
    
    try {
      if (!verificationCode || verificationCode.length < 4) {
        setError("Please enter a valid verification code.")
        setIsLoading(false)
        return
      }
      await verifyRegister(email, verificationCode)
      router.replace("/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "We couldn't process your request. Please check your details and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 px-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
          {error}
        </motion.div>
      )}

      <motion.div 
        key="step3"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-4 md:space-y-6"
      >
        <div className="text-center space-y-2 mb-6">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">
            We've sent a code to
          </p>
          <p className="text-[#4DB6AC] text-sm font-black italic">
            {email}
          </p>
        </div>
        
        <div className="relative group/input">
          <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
            <Lock className="w-4 h-4 text-white" />
          </div>
          <input
            type="text"
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-11 md:pl-12 pr-5 py-6 md:py-8 text-white font-black italic focus:outline-none focus:border-[#4DB6AC] transition-all text-2xl md:text-3xl tracking-[0.5em] text-center placeholder:text-white/5 placeholder:tracking-normal"
            placeholder="CODE"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            maxLength={10}
            required
          />
        </div>

        <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.2em] pt-4 leading-relaxed">
          Didn't receive the code? <br />
          <span className="text-[#E1784F] cursor-pointer hover:underline" onClick={() => router.push("/register")}>Check your email or try again</span>
        </p>
      </motion.div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full bg-[#E1784F] text-white font-black uppercase text-xs md:text-sm tracking-[0.3em] py-4 md:py-5 rounded-xl md:rounded-2xl shadow-[0_10px_30px_rgba(225,120,79,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-[#ff8a5c] active:scale-[0.97]"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Complete Registration 
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}

function VerificationLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="w-8 h-8 text-[#4DB6AC] animate-spin mb-4" />
      <p className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Preparing Verification...</p>
    </div>
  )
}

export default function VerifyEmailPage() {
  const router = useRouter()

  return (
    <div className="min-h-[100svh] bg-[#050505] flex flex-col justify-center items-center p-6 md:p-12 selection:bg-[#4DB6AC]/30 relative overflow-hidden">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#4DB6AC]/5 blur-[120px] md:blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#E1784F]/5 blur-[80px] md:blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-6 md:space-y-10 relative z-10"
      >
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-4 md:space-y-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 md:w-20 md:h-20 bg-white text-black rounded-2xl md:rounded-3xl flex items-center justify-center shadow-[0_20px_40px_rgba(255,255,255,0.1)] mx-auto mb-4 relative group cursor-pointer"
          >
            <span className="font-black text-2xl md:text-3xl italic tracking-tighter">A</span>
            <div className="absolute inset-0 rounded-2xl md:rounded-3xl border border-white/20 scale-110 opacity-50 group-hover:opacity-100 transition-all duration-500" />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic leading-[0.8] text-center">
              Verify <br /> <span className="text-[#4DB6AC]">Account</span>
            </h1>
            
            <div className="flex justify-center gap-3 pt-4">
              <div className={`h-1 rounded-full transition-all duration-700 w-16 bg-[#4DB6AC]`} />
            </div>
            <p className="text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] pt-1">
              Final Step / Email Verification
            </p>
          </div>
        </div>

        {/* --- THE ENTRY PORTAL --- */}
        <div className="relative">
            <button 
                type="button"
                onClick={() => router.push("/")}
                className="absolute -top-6 -right-2 md:-top-8 md:-right-8 p-3 md:p-4 text-white/20 hover:text-[#4DB6AC] hover:scale-110 transition-all z-[100]"
            >
                <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <Suspense fallback={<VerificationLoader />}>
              <VerifyEmailForm />
            </Suspense>
        </div>

        <div className="flex flex-col items-center gap-6 pb-12">
            <div className="flex items-center gap-3 opacity-40">
                <Fingerprint size={14} className="text-[#4DB6AC]" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Secure Verification</p>
            </div>
            <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
              Already have an account? <Link href="/login" className="text-white hover:text-[#4DB6AC] transition-all ml-2 border-b border-white/20">Login</Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}
