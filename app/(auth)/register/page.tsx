"use client"

import React, { useState } from "react"
import { Mail, Phone, Lock, ArrowRight, Loader2, User, X, Globe } from "lucide-react"
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
    country: "Nigeria",
    phoneNo: "",
    password: ""
  })
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
      await signUp(formData)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141211] flex flex-col justify-center items-center p-4 sm:p-8 selection:bg-[#E1784F]/30 relative overflow-hidden">
      
      {/* Premium Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#4DB6AC]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-[#E1784F]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 relative z-10">
        <div className="text-center pt-4">
          <div className="w-24 h-24 bg-[#4DB6AC] rounded-[2rem] flex items-center justify-center font-black text-5xl text-white shadow-[0_20px_50px_rgba(77,182,172,0.3)] mx-auto mb-6">
            A
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-[#F7F3EE] tracking-tighter uppercase italic">
            Join <span className="text-[#4DB6AC]">AfriDam</span>
          </h1>
          <p className="text-gray-500 text-xs font-black uppercase tracking-[0.4em] mt-3">Start your skin health journey</p>
        </div>

        {/* --- THE PREMIUM FORM CARD --- */}
        <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 p-8 md:p-14 rounded-[3.5rem] shadow-2xl backdrop-blur-2xl space-y-6 relative">
          
          <button 
            type="button"
            onClick={handleCancel}
            className="absolute top-8 right-8 p-2 text-gray-500 hover:text-white transition-all cursor-pointer bg-white/5 hover:bg-white/10 rounded-full z-[100]"
          >
            <X className="w-6 h-6" />
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold text-center">
              {error}
            </div>
          )}

          {/* Names Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative group">
               <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#4DB6AC] transition-colors" />
               <input
                 type="text"
                 className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-lg placeholder:text-gray-700"
                 placeholder="First Name"
                 onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                 required
               />
            </div>
            <div className="relative group">
               <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#4DB6AC] transition-colors" />
               <input
                 type="text"
                 className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-lg placeholder:text-gray-700"
                 placeholder="Last Name"
                 onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                 required
               />
            </div>
          </div>

          {/* Gender and Country Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative group">
              <select
                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-6 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-lg appearance-none cursor-pointer"
                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                defaultValue="male"
              >
                <option value="male" className="bg-[#1C1A19]">Male</option>
                <option value="female" className="bg-[#1C1A19]">Female</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs font-bold">▼</div>
            </div>

            <div className="relative group">
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#4DB6AC] transition-colors" />
              <select
                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-lg appearance-none cursor-pointer"
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                defaultValue="Nigeria"
              >
                <option value="Nigeria" className="bg-[#1C1A19]">Nigeria</option>
                <option value="Ghana" className="bg-[#1C1A19]">Ghana</option>
                <option value="Kenya" className="bg-[#1C1A19]">Kenya</option>
                <option value="South Africa" className="bg-[#1C1A19]">South Africa</option>
                <option value="Ethiopia" className="bg-[#1C1A19]">Ethiopia</option>
                <option value="Rwanda" className="bg-[#1C1A19]">Rwanda</option>
                <option value="Uganda" className="bg-[#1C1A19]">Uganda</option>
                <option value="Egypt" className="bg-[#1C1A19]">Egypt</option>
                <option value="Morocco" className="bg-[#1C1A19]">Morocco</option>
                <option value="Other" className="bg-[#1C1A19]">Other</option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs font-bold">▼</div>
            </div>
          </div>

          <div className="relative group">
            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#4DB6AC] transition-colors" />
            <input
              type="tel"
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-lg placeholder:text-gray-700"
              placeholder="Phone Number"
              onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#4DB6AC] transition-colors" />
            <input
              type="email"
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-lg placeholder:text-gray-700"
              placeholder="Email Address"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 group-focus-within:text-[#4DB6AC] transition-colors" />
            <input
              type="password"
              className="w-full bg-black/40 border-2 border-white/5 rounded-2xl px-14 py-5 text-[#F7F3EE] font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-lg placeholder:text-gray-700"
              placeholder="Create Password"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>

          <div className="pt-4 text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
               By clicking below, you agree to our <span className="text-[#4DB6AC] cursor-pointer hover:underline">Health Guidelines</span>
             </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E1784F] hover:bg-[#d06b43] text-white font-black uppercase text-sm tracking-[0.2em] py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.97]"
          >
            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Create Account <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 font-medium pb-8">
          Already a member? <Link href="/login" className="text-[#4DB6AC] font-black hover:underline ml-1">Sign In</Link>
        </p>
      </div>
    </div>
  )
}