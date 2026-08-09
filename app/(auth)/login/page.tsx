"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, Fingerprint, Eye, EyeOff, ArrowLeft, Sparkles, ShieldCheck } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export default function LoginPage() {
  const auth = useAuth() as any
  
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const credentials = {
      email: email.trim(),
      password: password.trim(),
    }

    try {
      await auth.signIn(credentials)
      router.replace("/dashboard")
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Verification failed. Check your credentials."
      setError(typeof message === "string" ? message : "Invalid identity response.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#080B10] text-white flex flex-col justify-center items-center p-4 sm:p-6 md:p-10 relative overflow-hidden selection:bg-[#E1784F]/30 font-sans">
      
      {/* --- PREMIUM DYNAMIC GLOWING BACKGROUND --- */}
      {/* Vibrant Brand Color Orbs: Orange (#E1784F) & Teal-Blue (#4DB6AC) */}
      <div className="absolute top-[-10%] left-[-10%] w-[380px] sm:w-[600px] md:w-[800px] h-[380px] sm:h-[600px] md:h-[800px] bg-[#E1784F]/20 rounded-full blur-[120px] md:blur-[220px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[380px] sm:w-[600px] md:w-[800px] h-[380px] sm:h-[600px] md:h-[800px] bg-[#4DB6AC]/20 rounded-full blur-[120px] md:blur-[220px] pointer-events-none animate-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-[#E1784F]/10 rounded-full blur-[160px] pointer-events-none" />
      
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] pointer-events-none mix-blend-overlay" />

      {/* --- MAIN LOGIN CONTAINER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg space-y-6 sm:space-y-8 relative z-10 my-auto"
      >
        
        {/* BRAND LOGO & HEADER */}
        <div className="text-center space-y-3 sm:space-y-4">
          <motion.div 
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 mx-auto flex items-center justify-center p-3 rounded-3xl bg-gradient-to-br from-[#E1784F]/20 via-black/60 to-[#4DB6AC]/20 border border-white/15 backdrop-blur-xl shadow-[0_0_50px_rgba(225,120,79,0.25)] group cursor-pointer"
          >
            {/* Glowing Accent Ring behind logo */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#E1784F] to-[#4DB6AC] opacity-30 blur-md group-hover:opacity-60 transition-opacity duration-500" />
            
            {/* Brand Logo Container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-black/40 border border-white/10 p-2">
              <Image 
                src="/logo.png" 
                alt="Brand Logo" 
                width={120} 
                height={120} 
                className="object-contain w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-105 transition-transform duration-300"
                priority
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                }}
              />
              {/* Fallback Icon badge if logo image isn't available in local directory */}
              <div className="hidden group-only:flex items-center justify-center w-full h-full">
                <Sparkles className="w-10 h-10 text-[#E1784F]" />
              </div>
            </div>
          </motion.div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
              WELCOME <span className="bg-gradient-to-r from-[#E1784F] via-[#F2936E] to-[#4DB6AC] bg-clip-text text-transparent">BACK</span>
            </h1>
            <p className="text-white/60 text-xs sm:text-sm font-semibold uppercase tracking-widest pt-1 flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-[#4DB6AC]" />
              <span>Sign in to access your portal</span>
            </p>
          </div>
        </div>

        {/* --- FORM CARD WITH GLASSMORPHISM --- */}
        <div className="bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">
          
          {/* Subtle Accent Glow line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E1784F] via-[#4DB6AC] to-[#E1784F]" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="py-3 px-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-semibold uppercase tracking-wider text-center backdrop-blur-md"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-4">
              {/* EMAIL INPUT */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                  Email Address
                </label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#4DB6AC] transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-[#4DB6AC] focus:shadow-[0_0_20px_rgba(77,182,172,0.25)] rounded-2xl pl-12 pr-4 py-3.5 sm:py-4 text-white font-medium focus:outline-none transition-all text-sm sm:text-base placeholder:text-white/30"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD INPUT */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 ml-1">
                  Password
                </label>
                <div className="relative group/input">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-white/40 group-focus-within/input:text-[#E1784F] transition-colors">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/15 focus:border-[#E1784F] focus:shadow-[0_0_20px_rgba(225,120,79,0.25)] rounded-2xl pl-12 pr-12 py-3.5 sm:py-4 text-white font-medium focus:outline-none transition-all text-sm sm:text-base placeholder:text-white/30"
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-[#E1784F] transition-colors p-1"
                    aria-label="Toggle Password Visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* FORGOT PASSWORD LINK */}
            <div className="flex justify-end">
              <Link 
                href="/forgot-password" 
                className="text-xs font-bold uppercase tracking-wider text-white/50 hover:text-[#E1784F] transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="group w-full bg-gradient-to-r from-[#E1784F] to-[#d8683e] hover:from-[#f2865e] hover:to-[#E1784F] text-white font-black uppercase text-xs sm:text-sm tracking-[0.25em] py-4 rounded-2xl shadow-[0_10px_35px_rgba(225,120,79,0.4)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform text-[#4DB6AC]" />
                  </>
                )}
              </button>

              {/* BACK BUTTON */}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full flex items-center justify-center gap-2 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest py-2.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home</span>
              </button>
            </div>
          </form>
        </div>

        {/* --- FOOTER INFO --- */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-white/60 text-xs font-medium">
            <Fingerprint size={15} className="text-[#4DB6AC]" />
            <span>End-to-End Encrypted Authentication</span>
          </div>

          <p className="text-xs text-white/50 font-medium">
            Don't have an account?{" "}
            <Link 
              href="/register" 
              className="text-white hover:text-[#4DB6AC] font-bold underline underline-offset-4 decoration-[#4DB6AC] transition-all ml-1"
            >
              Register here
            </Link>
          </p>
        </div>

      </motion.div>
    </div>
  )
}