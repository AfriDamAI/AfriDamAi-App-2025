/**
 * 🛡️ AFRIDAM WELLNESS HUB: HUMAN LOGIN (Rule 7 Sync)
 * Version: 2026.1.2 (Mobile-First, Zero Jargon)
 * Focus: High-Contrast, Clear Language, Mobile Optimization.
 */

"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, X, Fingerprint, Sparkles } from "lucide-react"
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
      setError("We couldn't find an account with those details. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white flex flex-col justify-center items-center p-6 md:p-12 transition-colors duration-500 selection:bg-[#E1784F]/30 relative overflow-hidden">
      
      {/* 🌪️ AMBIANCE OVERLAYS */}
      <div className="absolute top-[-20%] right-[-10%] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#E1784F]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[400px] md:w-[700px] h-[400px] md:h-[700px] bg-[#4DB6AC]/5 blur-[100px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-12 md:space-y-20 relative z-10"
      >
        {/* BRANDING HEADER */}
        <div className="text-center space-y-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 md:w-28 md:h-28 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] flex items-center justify-center shadow-2xl mx-auto mb-6"
          >
            <span className="font-black text-3xl md:text-4xl italic tracking-tighter uppercase">A</span>
          </motion.div>
          
          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-black tracking-tight uppercase italic leading-[0.8] text-center">
              Welcome <br /> <span className="text-[#E1784F]">Back.</span>
            </h1>
            <div className="flex items-center justify-center gap-2 opacity-40">
                <Sparkles size={12} className="text-[#E1784F]" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Secure Entry</p>
            </div>
          </div>
        </div>

        {/* ENTRY FORM */}
        <div className="relative">
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute -top-12 -right-2 md:-top-16 md:-right-16 p-4 text-black/20 dark:text-white/20 hover:text-[#E1784F] transition-all z-[100]"
          >
            <X className="w-8 h-8" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-4 px-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4 md:space-y-6">
              <div className="relative group">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-all">
                    <Mail className="w-5 h-5" />
                    <div className="w-[1px] h-4 bg-current opacity-20" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] pl-20 pr-10 py-7 md:py-9 text-lg md:text-xl font-medium focus:outline-none focus:border-[#E1784F] transition-all placeholder:text-black/20 dark:placeholder:text-white/10"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none opacity-20 group-focus-within:opacity-100 transition-all">
                    <Lock className="w-5 h-5" />
                    <div className="w-[1px] h-4 bg-current opacity-20" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] pl-20 pr-10 py-7 md:py-9 text-lg md:text-xl font-medium focus:outline-none focus:border-[#E1784F] transition-all placeholder:text-black/20 dark:placeholder:text-white/10"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <div className="space-y-8">
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full bg-[#E1784F] text-white font-black uppercase text-[11px] tracking-[0.4em] py-8 md:py-10 rounded-[2rem] shadow-2xl transition-all flex items-center justify-center gap-6 disabled:opacity-50 active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>LOGIN <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></>
                )}
              </button>

              <div className="text-center">
                 <Link 
                   href="/forgot-password" 
                   className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 hover:opacity-100 hover:text-[#E1784F] transition-all"
                 >
                   Forgot Password?
                 </Link>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center gap-10 pt-6">
            <div className="flex items-center gap-4 opacity-20">
                <Fingerprint size={16} />
                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Secure Authentication</p>
            </div>
            
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
              New here? 
              <Link href="/register" className="text-[#E1784F] ml-3 border-b border-[#E1784F]/20">
                Create an Account
              </Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}