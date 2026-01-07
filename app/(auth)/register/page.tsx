"use client"

import React, { useState } from "react"
import { Mail, Phone, Lock, ArrowRight, Loader2, ChevronLeft, User } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    sex: "male",
    phoneNo: "",
    password: ""
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    
    try {
      await signUp(formData)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1C1A19] flex flex-col justify-center items-center p-6 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#4DB6AC]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-xl space-y-8 relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#F7F3EE] transition-colors text-xs font-bold uppercase tracking-widest">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="text-center">
          <div className="w-16 h-16 bg-[#4DB6AC] rounded-2xl flex items-center justify-center font-black text-4xl text-white shadow-2xl mx-auto mb-6">A</div>
          <h1 className="text-4xl font-bold text-[#F7F3EE] tracking-tight">Create Account</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">Join the AfriDam Skincare Network</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-xl space-y-5">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full bg-black/30 border border-white/5 rounded-xl px-6 py-4 text-[#F7F3EE] focus:border-[#4DB6AC] outline-none"
              onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full bg-black/30 border border-white/5 rounded-xl px-6 py-4 text-[#F7F3EE] focus:border-[#4DB6AC] outline-none"
              onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="w-full bg-black/30 border border-white/5 rounded-xl px-6 py-4 text-[#F7F3EE] focus:border-[#4DB6AC] outline-none appearance-none"
              onChange={(e) => setFormData({...formData, sex: e.target.value})}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full bg-black/30 border border-white/5 rounded-xl px-6 py-4 text-[#F7F3EE] focus:border-[#4DB6AC] outline-none"
              onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
              required
            />
          </div>

          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-black/30 border border-white/5 rounded-xl px-6 py-4 text-[#F7F3EE] focus:border-[#4DB6AC] outline-none"
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />

          <input
            type="password"
            placeholder="Create Password"
            className="w-full bg-black/30 border border-white/5 rounded-xl px-6 py-4 text-[#F7F3EE] focus:border-[#4DB6AC] outline-none"
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E1784F] hover:brightness-110 text-white font-bold uppercase text-xs tracking-widest py-5 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create My Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500">
          Already a member? <Link href="/login" className="text-[#4DB6AC] font-bold">Login here</Link>
        </p>
      </div>
    </div>
  )
}