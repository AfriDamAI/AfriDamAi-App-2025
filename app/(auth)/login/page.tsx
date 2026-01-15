"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, X, ShieldCheck } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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
      // 🛡️ OGA FIX: Smooth handover to dashboard
      router.push("/dashboard") 
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.response?.data?.message || "Invalid credentials. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-4 sm:p-8 selection:bg-[#E1784F]/30 relative overflow-hidden font-sans">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#E1784F]/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4DB6AC]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-10 relative z-10"
      >
        {/* BRANDING HEADER */}
        <div className="text-center space-y-4">
          <motion.div 
            whileHover={{ rotate: 12, scale: 1.1 }}
            className="w-20 h-20 bg-[#E1784F] rounded-[2.5rem] flex items-center justify-center font-black text-4xl text-white shadow-[0_20px_60px_rgba(225,120,79,0.3)] mx-auto mb-8 cursor-pointer transition-all"
          >
            A
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
            Welcome <br /> <span className="text-[#E1784F]">Back</span>
          </h1>
          <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.5em] pt-2">
            Clinical Portal Access
          </p>
        </div>

        {/* --- PREMIUM GLASS CARD --- */}
        <div className="relative group">
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute -top-4 -right-4 p-4 text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full z-[100] backdrop-blur-xl border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          <form 
            onSubmit={handleSubmit} 
            className="bg-white/[0.02] border border-white/10 p-8 md:p-14 rounded-[4rem] shadow-3xl backdrop-blur-3xl space-y-8"
          >
            {error && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <div className="relative group/input">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-[#E1784F] transition-all" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-3xl px-14 py-6 text-white font-bold focus:outline-none focus:border-[#E1784F]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/10"
                  placeholder="EMAIL ADDRESS"
                  required
                />
              </div>

              <div className="relative group/input">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-[#E1784F] transition-all" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-3xl px-14 py-6 text-white font-bold focus:outline-none focus:border-[#E1784F]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/10"
                  placeholder="PASSWORD"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] hover:bg-[#d06b43] text-white font-black uppercase text-[11px] tracking-[0.3em] py-7 rounded-3xl shadow-[0_20px_40px_rgba(225,120,79,0.2)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>Secure Login <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

            <div className="flex justify-center pt-2">
               <Link href="/forgot-password" size-role="small" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-[#E1784F] transition-colors">
                 Lost Access? Reset Credentials
               </Link>
            </div>
          </form>
        </div>

        {/* FOOTER ACTION */}
        <div className="flex flex-col items-center gap-6 pb-12">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl">
                <ShieldCheck size={14} className="text-[#4DB6AC]" />
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">End-to-End Encrypted Session</p>
            </div>
            
            <p className="text-center text-xs text-white/30 font-medium">
              New to the clinic? 
              <Link href="/register" className="text-[#4DB6AC] font-black hover:underline ml-2 uppercase tracking-widest">
                Create Account
              </Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}