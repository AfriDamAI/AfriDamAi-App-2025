/**
 * 🛡️ AFRIDAM CLINICAL ACCESS: LOGIN
 * Version: 2026.1.3 (Build Fix Refactor)
 * Focus: High-Contrast, Deep Ambiance, Next.js 15 Compliance.
 */

"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, X, ShieldCheck, Fingerprint } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = () => {
    router.push("/");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      await signIn({ email, password })
      router.push("/dashboard") 
    } catch (err: any) {
      setError("INVALID CREDENTIALS. VERIFY & RETRY.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#050505] flex flex-col justify-center items-center p-6 md:p-12 selection:bg-[#E1784F]/30 relative overflow-hidden">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#E1784F]/5 blur-[120px] md:blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-[#4DB6AC]/5 blur-[100px] md:blur-[200px] rounded-full pointer-events-none" />
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="w-full max-w-2xl space-y-12 md:space-y-20 relative z-10"
      >
        {/* BRANDING HEADER */}
        <div className="text-center space-y-6 md:space-y-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-24 h-24 md:w-32 md:h-32 bg-white text-black rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(255,255,255,0.1)] mx-auto mb-8 relative group cursor-pointer"
          >
            <span className="font-black text-4xl md:text-5xl italic tracking-tighter">A</span>
            <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/20 scale-110 group-hover:scale-125 opacity-0 group-hover:opacity-100 transition-all duration-500" />
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-[1px] md:tracking-[-4px] uppercase italic leading-[0.8] text-center">
              Welcome <br /> <span className="text-[#E1784F]">Back</span>
            </h1>
            <p className="text-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] pt-4">
              Secure Clinical Gateway
            </p>
          </div>
        </div>

        {/* --- THE ENTRY PORTAL --- */}
        <div className="relative">
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute -top-6 -right-2 md:-top-10 md:-right-10 p-4 md:p-6 text-white/20 hover:text-[#E1784F] hover:scale-110 transition-all z-[100]"
          >
            <X className="w-6 h-6 md:w-8 md:h-8" />
          </button>

          <form 
            onSubmit={handleSubmit} 
            className="space-y-8 md:space-y-14"
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-4 px-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6 md:space-y-10">
              <div className="relative group/input">
                <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    <div className="w-[1px] h-4 bg-white/20" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] pl-20 md:pl-28 pr-10 py-7 md:py-10 text-white font-medium focus:outline-none focus:border-[#E1784F] focus:bg-white/[0.05] transition-all text-lg md:text-2xl placeholder:text-white/5 uppercase tracking-tighter"
                  placeholder="ID@AFRIDAMAI.COM"
                  required
                />
              </div>

              <div className="relative group/input">
                <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                    <Lock className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    <div className="w-[1px] h-4 bg-white/20" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] pl-20 md:pl-28 pr-10 py-7 md:py-10 text-white font-medium focus:outline-none focus:border-[#E1784F] focus:bg-white/[0.05] transition-all text-lg md:text-2xl placeholder:text-white/5 uppercase tracking-tighter"
                  placeholder="PROTECTION KEY"
                  required
                />
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="space-y-8">
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full bg-[#E1784F] text-white font-black uppercase text-xs md:text-sm tracking-[0.5em] py-8 md:py-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(225,120,79,0.3)] transition-all flex items-center justify-center gap-6 disabled:opacity-50 hover:bg-[#ff8a5c] active:scale-[0.97]"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>AUTHENTICATE SESSION <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" /></>
                )}
              </button>

              <div className="flex flex-col items-center gap-4">
                 {/* 🛡️ FIXED: Moved attributes to className */}
                 <Link 
                   href="/forgot-password" 
                   className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-[#E1784F] transition-all opacity-30 hover:opacity-100"
                 >
                   Credential Recovery
                 </Link>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center gap-10 pt-10">
            <div className="flex items-center gap-4 opacity-40">
                <Fingerprint size={16} className="text-[#4DB6AC]" />
                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Biometric-Ready Protocol</p>
            </div>
            
            <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
              New Practitioner? 
              <Link href="/register" className="text-white hover:text-[#E1784F] transition-all ml-4 border-b border-white/20">
                Register Here
              </Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}