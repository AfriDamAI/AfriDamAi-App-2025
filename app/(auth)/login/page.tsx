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
      router.push("/dashboard") 
    } catch (err: any) {
      console.error("Login Error:", err);
      setError("INVALID CREDENTIALS. VERIFY & RETRY.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#0A0A0A] flex flex-col justify-center items-center p-4 md:p-10 selection:bg-[#E1784F]/30 relative overflow-x-hidden font-sans">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[700px] h-[300px] md:h-[700px] bg-[#E1784F]/10 blur-[120px] md:blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#4DB6AC]/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl space-y-8 md:space-y-12 relative z-10"
      >
        {/* BRANDING HEADER - SCALED FOR MOBILE */}
        <div className="text-center space-y-4 md:space-y-6">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="w-20 h-20 md:w-28 md:h-28 bg-[#E1784F] rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center font-black text-4xl md:text-5xl text-white shadow-[0_20px_40px_rgba(225,120,79,0.4)] mx-auto mb-6 md:mb-10 cursor-pointer transition-all"
          >
            A
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] text-center">
            Welcome <br /> <span className="text-[#E1784F]">Back</span>
          </h1>
          <p className="text-white/30 text-[10px] md:text-xs font-black uppercase tracking-[0.4em] md:tracking-[0.6em] pt-2">
            Clinical Portal Access
          </p>
        </div>

        {/* --- PREMIUM GLASS CARD --- */}
        <div className="relative group">
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute -top-4 -right-2 md:-top-6 md:-right-6 p-4 md:p-5 text-white/40 hover:text-white transition-all bg-white/5 backdrop-blur-3xl rounded-full z-[100] border border-white/10"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <form 
            onSubmit={handleSubmit} 
            className="bg-white/[0.03] border border-white/10 p-6 md:p-20 rounded-[3rem] md:rounded-[5rem] shadow-2xl backdrop-blur-3xl space-y-6 md:space-y-10"
          >
            {error && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4 md:space-y-6">
              <div className="relative group/input">
                <Mail className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#E1784F] transition-all" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-6 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#E1784F] transition-all text-md md:text-xl placeholder:text-white/10 uppercase tracking-tight"
                  placeholder="EMAIL ADDRESS"
                  required
                />
              </div>

              <div className="relative group/input">
                <Lock className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#E1784F] transition-all" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-6 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#E1784F] transition-all text-md md:text-xl placeholder:text-white/10 uppercase tracking-tight"
                  placeholder="PASSWORD"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] text-white font-black uppercase text-sm md:text-lg tracking-[0.3em] md:tracking-[0.4em] py-6 md:py-9 rounded-2xl md:rounded-[2.5rem] shadow-xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <>SECURE LOGIN <ArrowRight className="w-5 h-5 md:w-6 md:h-6" /></>
              )}
            </button>

            <div className="flex justify-center">
               <Link href="/forgot-password" className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-[#E1784F] transition-colors">
                 Lost Access? Reset Credentials
               </Link>
            </div>
          </form>
        </div>

        {/* FOOTER ACTION */}
        <div className="flex flex-col items-center gap-6 pb-10">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/5 rounded-2xl">
                <ShieldCheck size={14} className="text-[#4DB6AC]" />
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">Encrypted Session</p>
            </div>
            
            <p className="text-center text-[11px] text-white/30 font-bold uppercase tracking-widest">
              New here? 
              <Link href="/register" className="text-[#4DB6AC] font-black hover:underline ml-2">
                Create Account
              </Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}