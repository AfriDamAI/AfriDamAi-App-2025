"use client"

import React, { useState } from "react"
import { Mail, Phone, Lock, ArrowRight, Loader2, User, X, Globe, ChevronLeft, ShieldCheck } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function RegisterPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  
  const [step, setStep] = useState(1)
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
    router.push("/");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 1) {
        setStep(2)
        return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      await signUp(formData)
      // 🛡️ OGA FIX: Send them to dashboard, the dashboard logic will handle the onboarding check
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please check your details.")
      setStep(1) // Move back to first step to fix errors if needed
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-4 sm:p-8 selection:bg-[#4DB6AC]/30 relative overflow-hidden font-sans">
      
      {/* --- CINEMATIC BACKGROUND --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#4DB6AC]/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E1784F]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="w-full max-w-xl space-y-10 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-[#4DB6AC] rounded-[2.5rem] flex items-center justify-center font-black text-4xl text-white shadow-[0_20px_60px_rgba(77,182,172,0.4)] mx-auto mb-8 rotate-3"
          >
            A
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
            Create <br /> <span className="text-[#4DB6AC]">Account</span>
          </h1>
          <div className="flex justify-center gap-2 pt-2">
            <div className={`h-1 rounded-full transition-all duration-500 ${step === 1 ? 'w-12 bg-[#4DB6AC]' : 'w-4 bg-white/10'}`} />
            <div className={`h-1 rounded-full transition-all duration-500 ${step === 2 ? 'w-12 bg-[#4DB6AC]' : 'w-4 bg-white/10'}`} />
          </div>
        </div>

        {/* --- MAIN FORM CARD --- */}
        <div className="relative">
            <button 
                type="button"
                onClick={handleCancel}
                className="absolute -top-4 -right-4 p-4 text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full z-[100] backdrop-blur-xl border border-white/10"
            >
                <X className="w-5 h-5" />
            </button>

            <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-white/10 p-8 md:p-12 rounded-[4rem] shadow-3xl backdrop-blur-3xl space-y-8">
            
            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-5 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
                {error}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 ? (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#4DB6AC] transition-all" />
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/5 rounded-3xl px-14 py-6 text-white font-bold focus:outline-none focus:border-[#4DB6AC]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/10"
                                placeholder="FIRST NAME"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-6 text-white font-bold focus:outline-none focus:border-[#4DB6AC]/50 focus:bg-white/10 transition-all text-sm placeholder:text-white/10"
                                placeholder="LAST NAME"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative group">
                            <select
                                className="w-full bg-white/5 border border-white/5 rounded-3xl px-8 py-6 text-white font-bold focus:outline-none focus:border-[#4DB6AC]/50 appearance-none cursor-pointer text-sm uppercase tracking-widest"
                                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                                value={formData.sex}
                            >
                                <option value="male" className="bg-[#0A0A0A]">Male</option>
                                <option value="female" className="bg-[#0A0A0A]">Female</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-[10px]">▼</div>
                        </div>

                        <div className="relative group">
                            <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <select
                                className="w-full bg-white/5 border border-white/5 rounded-3xl px-14 py-6 text-white font-bold focus:outline-none focus:border-[#4DB6AC]/50 appearance-none cursor-pointer text-sm uppercase tracking-widest"
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                value={formData.country}
                            >
                                <option value="Nigeria" className="bg-[#0A0A0A]">Nigeria</option>
                                <option value="Ghana" className="bg-[#0A0A0A]">Ghana</option>
                                <option value="Kenya" className="bg-[#0A0A0A]">Kenya</option>
                                <option value="USA" className="bg-[#0A0A0A]">USA</option>
                            </select>
                        </div>
                    </div>

                    <div className="relative group">
                        <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                            type="tel"
                            className="w-full bg-white/5 border border-white/5 rounded-3xl px-14 py-6 text-white font-bold focus:outline-none focus:border-[#4DB6AC]/50 transition-all text-sm placeholder:text-white/10"
                            placeholder="PHONE NUMBER"
                            value={formData.phoneNo}
                            onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                            required
                        />
                    </div>
                </motion.div>
                ) : (
                <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                >
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4DB6AC] mb-4">
                        <ChevronLeft size={14} /> Back to info
                    </button>
                    
                    <div className="relative group">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#4DB6AC]" />
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/5 rounded-3xl px-14 py-6 text-white font-bold focus:outline-none focus:border-[#4DB6AC]/50 transition-all text-sm placeholder:text-white/10"
                            placeholder="EMAIL ADDRESS"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-[#4DB6AC]" />
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/5 rounded-3xl px-14 py-6 text-white font-bold focus:outline-none focus:border-[#4DB6AC]/50 transition-all text-sm placeholder:text-white/10"
                            placeholder="CREATE PASSWORD"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="bg-[#4DB6AC]/5 p-6 rounded-[2rem] border border-[#4DB6AC]/10 flex items-start gap-4">
                        <ShieldCheck className="text-[#4DB6AC] shrink-0" size={20} />
                        <p className="text-[10px] text-white/40 font-bold leading-relaxed uppercase tracking-widest">
                            Your clinical data is encrypted with enterprise-grade security protocols.
                        </p>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E1784F] hover:bg-[#d06b43] text-white font-black uppercase text-[11px] tracking-[0.3em] py-7 rounded-3xl shadow-[0_20px_40px_rgba(225,120,79,0.2)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
            >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        {step === 1 ? "Next Step" : "Create Account"} 
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
            </form>
        </div>

        <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
          Already registered? <Link href="/login" className="text-[#4DB6AC] hover:underline ml-2">Sign In</Link>
        </p>
      </div>
    </div>
  )
}