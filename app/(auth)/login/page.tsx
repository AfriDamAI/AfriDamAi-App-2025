"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, X } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCancel = () => {
    window.location.href = "/";
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      await signIn({ email, password })
      router.push("/dashboard") 
    } catch (err: any) {
      setError(err.response?.data?.message || "Check your email or password and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141211] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-[#E1784F]/30 relative overflow-hidden">
      
      {/* Dynamic Background Glows - Larger for "Biggerly Moderate" feel */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E1784F]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#4DB6AC]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-lg space-y-8 relative z-10">
        <div className="text-center">
          {/* Bigger Logo Icon */}
          <div className="w-24 h-24 bg-[#E1784F] rounded-[2rem] flex items-center justify-center font-black text-5xl text-white shadow-[0_20px_50px_rgba(225,120,79,0.3)] mx-auto mb-6 transform hover:rotate-3 transition-transform">
            A
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#F7F3EE] tracking-tighter uppercase italic">
            Welcome <span className="text-[#E1784F]">Back</span>
          </h1>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] mt-3">
            Sign in to AfriDam AI
          </p>
        </div>

        {/* --- THE PREMIUM FORM CARD --- */}
        <div className="bg-white/[0.03] border border-white/10 p-8 md:p-12 rounded-[3rem] shadow-2xl backdrop-blur-2xl relative">
          
          {/* Cancel Button - High Priority */}
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-all cursor-pointer bg-white/5 hover:bg-white/10 rounded-full z-[100]"
          >
            <X className="w-6 h-6" />
          </button>

          <form onSubmit={handleSubmit} className="space-y-6 pt-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#E1784F] transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#E1784F] transition-all text-lg placeholder:text-gray-700"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#E1784F] transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#E1784F] transition-all text-lg placeholder:text-gray-700"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] hover:bg-[#d06b43] text-white font-black uppercase text-sm tracking-[0.2em] py-6 rounded-2xl shadow-[0_15px_30px_rgba(225,120,79,0.2)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.97]"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Login Now <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
          
          <div className="mt-8 text-center">
             <Link href="/forgot-password" intrinsic-role="link" className="text-[10px] font-black uppercase tracking-widest text-gray-600 hover:text-[#E1784F] transition-colors">
               Forgot Password?
             </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 font-medium">
          New here? <Link href="/register" className="text-[#4DB6AC] font-black hover:underline ml-1">Create Account</Link>
        </p>
      </div>
    </div>
  )
}