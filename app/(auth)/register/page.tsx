/**
 * 🛡️ AFRIDAM CLINICAL ACCESS: REGISTRATION
 * Version: 2026.1.2 (Premium Editorial Refactor)
 * Focus: Deep Teal Accents, High-Contrast, Breathing Space.
 */

"use client"

import React, { useState } from "react"
import { Mail, Phone, Lock, ArrowRight, Loader2, User, X, Globe, ChevronLeft, ShieldCheck, Fingerprint } from "lucide-react"
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      await signUp(formData)
      router.push("/dashboard")
    } catch (err: any) {
      setError("REGISTRATION SYNC FAILED. VERIFY DATA.")
      setStep(1) 
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#050505] flex flex-col justify-center items-center p-6 md:p-12 selection:bg-[#4DB6AC]/30 relative overflow-hidden">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] md:w-[900px] h-[500px] md:h-[900px] bg-[#4DB6AC]/5 blur-[120px] md:blur-[250px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#E1784F]/5 blur-[80px] md:blur-[180px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl space-y-12 md:space-y-20 relative z-10"
      >
        
        {/* BRANDING HEADER */}
        <div className="text-center space-y-6 md:space-y-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-24 h-24 md:w-32 md:h-32 bg-white text-black rounded-[2.5rem] md:rounded-[3.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(255,255,255,0.1)] mx-auto mb-8 relative group cursor-pointer"
          >
            <span className="font-black text-4xl md:text-5xl italic tracking-tighter">A</span>
            <div className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/20 scale-110 opacity-50 group-hover:opacity-100 transition-all duration-500" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-[0.8] text-center">
              New <br /> <span className="text-[#4DB6AC]">Account</span>
            </h1>
            
            <div className="flex justify-center gap-4 pt-6">
              <div className={`h-1.5 rounded-full transition-all duration-700 ${step === 1 ? 'w-24 bg-[#4DB6AC]' : 'w-4 bg-white/10'}`} />
              <div className={`h-1.5 rounded-full transition-all duration-700 ${step === 2 ? 'w-24 bg-[#4DB6AC]' : 'w-4 bg-white/10'}`} />
            </div>
            <p className="text-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] pt-2">
              Step {step} / Identity Sync
            </p>
          </div>
        </div>

        {/* --- THE ENTRY PORTAL --- */}
        <div className="relative">
            <button 
                type="button"
                onClick={handleCancel}
                className="absolute -top-10 -right-2 md:-top-16 md:-right-16 p-4 md:p-6 text-white/20 hover:text-[#4DB6AC] hover:scale-110 transition-all z-[100]"
            >
                <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-16">
            
            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-4 px-6 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-500 text-[10px] font-black uppercase tracking-widest text-center">
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
                    className="space-y-8 md:space-y-12"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        <div className="relative group/input">
                            <input
                                type="text"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] px-10 md:px-12 py-7 md:py-10 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-lg md:text-2xl placeholder:text-white/5 uppercase tracking-tighter"
                                placeholder="FIRST NAME"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="relative group/input">
                            <input
                                type="text"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] px-10 md:px-12 py-7 md:py-10 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-lg md:text-2xl placeholder:text-white/5 uppercase tracking-tighter"
                                placeholder="LAST NAME"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                        <div className="relative">
                            <select
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] px-10 md:px-12 py-7 md:py-10 text-white font-black focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-lg md:text-2xl uppercase tracking-widest"
                                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                                value={formData.sex}
                            >
                                <option value="male" className="bg-[#0A0A0A]">MALE</option>
                                <option value="female" className="bg-[#0A0A0A]">FEMALE</option>
                            </select>
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>

                        <div className="relative">
                            <select
                                className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] px-10 md:px-12 py-7 md:py-10 text-white font-black focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-lg md:text-2xl uppercase tracking-widest"
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                value={formData.country}
                            >
                                <option value="Nigeria" className="bg-[#0A0A0A]">NIGERIA</option>
                                <option value="Ghana" className="bg-[#0A0A0A]">GHANA</option>
                                <option value="Kenya" className="bg-[#0A0A0A]">KENYA</option>
                                <option value="USA" className="bg-[#0A0A0A]">USA</option>
                            </select>
                            <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>
                    </div>

                    <div className="relative group/input">
                        <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                            <Phone className="w-6 h-6 text-white" />
                        </div>
                        <input
                            type="tel"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] pl-20 md:pl-28 pr-10 py-7 md:py-10 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-lg md:text-2xl placeholder:text-white/5 uppercase tracking-tighter"
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
                    className="space-y-8 md:space-y-12"
                >
                    <button onClick={() => setStep(1)} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] mb-6">
                        <ChevronLeft size={18} /> Identity Correction
                    </button>
                    
                    <div className="relative group/input">
                        <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                            <Mail className="w-6 h-6 text-white" />
                        </div>
                        <input
                            type="email"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] pl-20 md:pl-28 pr-10 py-7 md:py-10 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-lg md:text-2xl placeholder:text-white/5 uppercase tracking-tighter"
                            placeholder="EMAIL ADDRESS"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <div className="absolute left-8 md:left-12 top-1/2 -translate-y-1/2 flex items-center gap-4 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <input
                            type="password"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-[2rem] md:rounded-[3rem] pl-20 md:pl-28 pr-10 py-7 md:py-10 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-lg md:text-2xl placeholder:text-white/5 uppercase tracking-tighter"
                            placeholder="CREATE PASSWORD"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex items-start gap-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                        <ShieldCheck className="text-[#4DB6AC] shrink-0" size={24} />
                        <p className="text-[10px] text-white/20 font-black leading-relaxed uppercase tracking-[0.3em]">
                            Practitioner data is secured within localized pan-African nodes.
                        </p>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-8">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="group w-full bg-[#E1784F] text-white font-black uppercase text-xs md:text-sm tracking-[0.5em] py-8 md:py-12 rounded-[2.5rem] md:rounded-[3.5rem] shadow-[0_20px_50px_rgba(225,120,79,0.3)] transition-all flex items-center justify-center gap-6 disabled:opacity-50 hover:bg-[#ff8a5c] active:scale-[0.97]"
                >
                    {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <>
                            {step === 1 ? "NEXT PHASE" : "ACTIVATE PORTAL"} 
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" />
                        </>
                    )}
                </button>
            </div>
            </form>
        </div>

        <div className="flex flex-col items-center gap-10 pb-20">
            <div className="flex items-center gap-4 opacity-40">
                <Fingerprint size={16} className="text-[#4DB6AC]" />
                <p className="text-[9px] font-black uppercase tracking-[0.5em]">Secure Biometric Entry</p>
            </div>
            <p className="text-center text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">
              Already Active? <Link href="/login" className="text-white hover:text-[#4DB6AC] transition-all ml-4 border-b border-white/20">Sign In</Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}