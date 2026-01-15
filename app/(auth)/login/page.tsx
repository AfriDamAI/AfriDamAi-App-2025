"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, X, ShieldCheck } from "lucide-react"
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
      // 🚀 Direct handover to dashboard. 
      // The Dashboard now has the 'Balanced' gatekeeper, so no more looping.
      router.push("/dashboard") 
    } catch (err: any) {
      console.error("Login Error:", err);
      setError("INVALID CREDENTIALS. PLEASE VERIFY AND RETRY.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-6 sm:p-10 selection:bg-[#E1784F]/30 relative overflow-hidden font-sans">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[700px] h-[700px] bg-[#E1784F]/10 blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#4DB6AC]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl space-y-12 relative z-10"
      >
        {/* BRANDING HEADER - LARGER & BOLDER */}
        <div className="text-center space-y-6">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-28 h-28 bg-[#E1784F] rounded-[2.5rem] flex items-center justify-center font-black text-5xl text-white shadow-[0_30px_60px_rgba(225,120,79,0.4)] mx-auto mb-10 cursor-pointer transition-all"
          >
            A
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.8] text-center">
            Welcome <br /> <span className="text-[#E1784F]">Back</span>
          </h1>
          <p className="text-white/30 text-xs font-black uppercase tracking-[0.6em] pt-4">
            Clinical Portal Access
          </p>
        </div>

        {/* --- PREMIUM BOLD GLASS CARD --- */}
        <div className="relative group">
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute -top-6 -right-6 p-5 text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full z-[100] backdrop-blur-3xl border border-white/10 shadow-2xl"
          >
            <X className="w-6 h-6" />
          </button>

          <form 
            onSubmit={handleSubmit} 
            className="bg-white/[0.03] border border-white/10 p-10 md:p-20 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl space-y-10"
          >
            {error && (
              <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-xs font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="relative group/input">
                <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within/input:text-[#E1784F] transition-all" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-20 py-8 text-white font-black focus:outline-none focus:border-[#E1784F] transition-all text-xl placeholder:text-white/10 uppercase tracking-tight"
                  placeholder="EMAIL ADDRESS"
                  required
                />
              </div>

              <div className="relative group/input">
                <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within/input:text-[#E1784F] transition-all" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-20 py-8 text-white font-black focus:outline-none focus:border-[#E1784F] transition-all text-xl placeholder:text-white/10 uppercase tracking-tight"
                  placeholder="PASSWORD"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] hover:bg-[#d06b43] text-white font-black uppercase text-lg tracking-[0.4em] py-9 rounded-[2.5rem] shadow-[0_30px_60px_rgba(225,120,79,0.3)] transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.96]"
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : (
                <>SECURE LOGIN <ArrowRight className="w-6 h-6" /></>
              )}
            </button>

            <div className="flex justify-center pt-4">
               <Link href="/forgot-password" intrinsic-role="link" className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#E1784F] transition-colors">
                 Lost Access? Reset Credentials
               </Link>
            </div>
          </form>
        </div>

        {/* FOOTER ACTION */}
        <div className="flex flex-col items-center gap-8 pb-16">
            <div className="flex items-center gap-4 px-8 py-4 bg-white/5 border border-white/5 rounded-3xl">
                <ShieldCheck size={18} className="text-[#4DB6AC]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">End-to-End Encrypted Session</p>
            </div>
            
            <p className="text-center text-sm text-white/30 font-bold uppercase tracking-widest">
              New here? 
              <Link href="/register" className="text-[#4DB6AC] font-black hover:underline ml-3">
                Create Account
              </Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}