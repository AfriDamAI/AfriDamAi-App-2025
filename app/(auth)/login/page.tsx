"use client"

import React, { useState } from "react"
import { Lock, Mail, ArrowRight, Loader2, ChevronLeft } from "lucide-react"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      await signIn({ email, password })
      router.push("/dashboard") 
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1A19] flex flex-col justify-center items-center p-6 selection:bg-[#E1784F]/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E1784F]/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F7F3EE] transition-colors text-xs font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#E1784F] rounded-2xl flex items-center justify-center font-black text-4xl text-white shadow-2xl mx-auto mb-6">A</div>
          <h1 className="text-4xl font-bold text-[#F7F3EE] tracking-tight">Login</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Welcome back to AfriDam</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-14 py-4 text-[#F7F3EE] focus:outline-none focus:border-[#E1784F] transition-all"
                  placeholder="Email Address"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-14 py-4 text-[#F7F3EE] focus:outline-none focus:border-[#E1784F] transition-all"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E1784F] hover:brightness-110 text-white font-bold uppercase text-xs tracking-widest py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Login Now <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500">
          Need an account? <Link href="/register" className="text-[#4DB6AC] font-bold">Register here</Link>
        </p>
      </div>
    </div>
  )
}