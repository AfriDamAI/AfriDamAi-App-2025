"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, X, Fingerprint, Eye, EyeOff } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { login as loginService } from "@/lib/api-client"

export default function LoginPage() {
  const auth = useAuth() as any; 
  const syncAuthState = auth.login || auth.signIn; 
  
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = () => router.push("/");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const credentials = {
      email: email.trim(),
      password: password.trim(),
    };

    try {
      await auth.signIn(credentials);
      router.replace("/dashboard");
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Verification failed. Check your credentials.";
      setError(typeof message === "string" ? message : "Invalid identity response.");
    } finally {
      setIsLoading(false);
    }
  };

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
              Welcome <br /> <span className="text-[#E1784F]">Back.</span>
            </h1>
            <p className="text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] pt-1">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* --- THE ENTRY PORTAL --- */}
        <div className="relative">
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute -top-6 -right-2 md:-top-8 md:-right-8 p-3 md:p-4 text-white/20 hover:text-[#4DB6AC] hover:scale-110 transition-all z-[100]"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-8">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 px-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
              </motion.div>
            )}

            <div className="space-y-4 md:space-y-6">
              <div className="relative group/input">
                <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-11 md:pl-12 pr-5 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-sm md:text-base placeholder:text-white/10"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative group/input">
                <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-11 md:pl-12 pr-12 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#E1784F] transition-all text-sm md:text-base placeholder:text-white/10"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-[#E1784F] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

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
                    Sign In
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>

              <div className="text-center">
                <Link href="/forgot-password" className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#E1784F] transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>
          </form>
        </div>

        <div className="flex flex-col items-center gap-6 pb-12">
          <div className="flex items-center gap-3 opacity-40">
            <Fingerprint size={14} className="text-[#4DB6AC]" />
            <p className="text-[8px] font-black uppercase tracking-[0.4em]">Secure Login</p>
          </div>
          <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
            Don't have an account? <Link href="/register" className="text-white hover:text-[#4DB6AC] transition-all ml-2 border-b border-white/20">Register</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
