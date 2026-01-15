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
      // 🚀 STRAIGHT TO DASHBOARD - Balanced gatekeeper will handle the rest
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "REGISTRATION FAILED. PLEASE VERIFY DETAILS.")
      setStep(1) 
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col justify-center items-center p-6 sm:p-10 selection:bg-[#4DB6AC]/30 relative overflow-hidden font-sans">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-[#4DB6AC]/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#E1784F]/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="w-full max-w-2xl space-y-12 relative z-10">
        
        {/* HEADER SECTION - BOLDER & LARGER */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-[#4DB6AC] rounded-[2.5rem] flex items-center justify-center font-black text-5xl text-white shadow-[0_30px_60px_rgba(77,182,172,0.4)] mx-auto mb-10 rotate-3"
          >
            A
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.8] text-center">
            Create <br /> <span className="text-[#4DB6AC]">Account</span>
          </h1>
          
          <div className="flex justify-center gap-3 pt-4">
            <div className={`h-1.5 rounded-full transition-all duration-700 ${step === 1 ? 'w-16 bg-[#4DB6AC]' : 'w-6 bg-white/10'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-700 ${step === 2 ? 'w-16 bg-[#4DB6AC]' : 'w-6 bg-white/10'}`} />
          </div>
        </div>

        {/* --- MAIN BOLD FORM CARD --- */}
        <div className="relative">
            <button 
                type="button"
                onClick={handleCancel}
                className="absolute -top-6 -right-6 p-5 text-white/40 hover:text-white transition-all bg-white/5 hover:bg-white/10 rounded-full z-[100] backdrop-blur-3xl border border-white/10 shadow-2xl"
            >
                <X className="w-6 h-6" />
            </button>

            <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 p-10 md:p-20 rounded-[5rem] shadow-[0_50px_100px_rgba(0,0,0,0.5)] backdrop-blur-3xl space-y-10">
            
            {error && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-xs font-black uppercase tracking-widest text-center">
                {error}
                </motion.div>
            )}

            <AnimatePresence mode="wait">
                {step === 1 ? (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-8"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <User className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#4DB6AC] transition-all" />
                            <input
                                type="text"
                                className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-16 py-8 text-white font-black focus:outline-none focus:border-[#4DB6AC] transition-all text-xl placeholder:text-white/10 uppercase"
                                placeholder="FIRST NAME"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="relative group">
                            <input
                                type="text"
                                className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-10 py-8 text-white font-black focus:outline-none focus:border-[#4DB6AC] transition-all text-xl placeholder:text-white/10 uppercase"
                                placeholder="LAST NAME"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <select
                                className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-10 py-8 text-white font-black focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-xl uppercase tracking-tighter"
                                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                                value={formData.sex}
                            >
                                <option value="male" className="bg-[#0A0A0A]">MALE</option>
                                <option value="female" className="bg-[#0A0A0A]">FEMALE</option>
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>

                        <div className="relative group">
                            <Globe className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                            <select
                                className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-16 py-8 text-white font-black focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-xl uppercase tracking-tighter"
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                value={formData.country}
                            >
                                <option value="Nigeria" className="bg-[#0A0A0A]">NIGERIA</option>
                                <option value="Ghana" className="bg-[#0A0A0A]">GHANA</option>
                                <option value="Kenya" className="bg-[#0A0A0A]">KENYA</option>
                                <option value="USA" className="bg-[#0A0A0A]">USA</option>
                            </select>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>
                    </div>

                    <div className="relative group">
                        <Phone className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="tel"
                            className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-16 py-8 text-white font-black focus:outline-none focus:border-[#4DB6AC] transition-all text-xl placeholder:text-white/10 uppercase"
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
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    className="space-y-8"
                >
                    <button onClick={() => setStep(1)} className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.4em] text-[#4DB6AC] mb-6 hover:brightness-125 transition-all">
                        <ChevronLeft size={18} /> BACK TO IDENTITY
                    </button>
                    
                    <div className="relative group">
                        <Mail className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#4DB6AC]" />
                        <input
                            type="email"
                            className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-16 py-8 text-white font-black focus:outline-none focus:border-[#4DB6AC] transition-all text-xl placeholder:text-white/10 uppercase"
                            placeholder="EMAIL ADDRESS"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#4DB6AC]" />
                        <input
                            type="password"
                            className="w-full bg-black/40 border-2 border-white/5 rounded-[2.5rem] px-16 py-8 text-white font-black focus:outline-none focus:border-[#4DB6AC] transition-all text-xl placeholder:text-white/10 uppercase"
                            placeholder="CREATE PASSWORD"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="bg-[#4DB6AC]/5 p-8 rounded-[3rem] border border-[#4DB6AC]/10 flex items-start gap-6">
                        <ShieldCheck className="text-[#4DB6AC] shrink-0" size={24} />
                        <p className="text-[10px] text-white/40 font-black leading-relaxed uppercase tracking-[0.4em]">
                            Your clinical data is encrypted and stored in private African-hosted nodes.
                        </p>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E1784F] hover:bg-[#d06b43] text-white font-black uppercase text-lg tracking-[0.4em] py-9 rounded-[2.5rem] shadow-[0_30px_60px_rgba(225,120,79,0.3)] transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.96]"
            >
                {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                    <>
                        {step === 1 ? "CONTINUE" : "CREATE ACCOUNT"} 
                        <ArrowRight className="w-6 h-6" />
                    </>
                )}
            </button>
            </form>
        </div>

        <p className="text-center text-xs text-white/20 font-black uppercase tracking-[0.6em] pb-10">
          Already a member? <Link href="/login" className="text-[#4DB6AC] hover:underline ml-3">Sign In</Link>
        </p>
      </div>
    </div>
  )
}