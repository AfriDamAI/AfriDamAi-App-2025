/**
 * 🛡️ AFRIDAM CLINICAL ACCESS: REGISTRATION (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Deep Teal Accents, Nationality Handshake, Mobile-First.
 */

"use client"

import React, { useState } from "react"
import { Mail, Phone, Lock, ArrowRight, Loader2, X, ChevronLeft, ShieldCheck, Fingerprint } from "lucide-react"
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
    country: "Nigeria", // 🌍 This is remapped to 'nationality' in api-client.ts
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
    
    // Step 1 Transition
    if (step === 1) {
        setStep(2)
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      /**
       * 🚀 THE HANDSHAKE:
       * signUp maps 'country' to 'nationality' via the api-client.
       * This resolves the 404/Not Found error from the backend.
       */
      await signUp(formData)
      router.replace("/dashboard")
    } catch (err: any) {
      setError("We couldn't set up your account. Please check your details and try again.")
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
              New <br /> <span className="text-[#4DB6AC]">Account</span>
            </h1>
            
            <div className="flex justify-center gap-3 pt-4">
              <div className={`h-1 rounded-full transition-all duration-700 ${step === 1 ? 'w-16 bg-[#4DB6AC]' : 'w-3 bg-white/10'}`} />
              <div className={`h-1 rounded-full transition-all duration-700 ${step === 2 ? 'w-16 bg-[#4DB6AC]' : 'w-3 bg-white/10'}`} />
            </div>
            <p className="text-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] pt-1">
              Step {step} / Account Details
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

            <AnimatePresence mode="wait">
                {step === 1 ? (
                <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 md:space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative group/input">
                            <input
                                type="text"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-sm md:text-base placeholder:text-white/10"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="relative group/input">
                            <input
                                type="text"
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-sm md:text-base placeholder:text-white/10"
                                placeholder="Last Name"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative">
                            <select
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-sm md:text-base uppercase tracking-widest"
                                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                                value={formData.sex}
                            >
                                <option value="male" className="bg-[#0A0A0A]">Male</option>
                                <option value="female" className="bg-[#0A0A0A]">Female</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>

                        <div className="relative">
                            <select
                                className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-sm md:text-base uppercase tracking-widest"
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                value={formData.country}
                            >
                                <option value="Nigeria" className="bg-[#0A0A0A]">Nigeria</option>
                                <option value="Ghana" className="bg-[#0A0A0A]">Ghana</option>
                                <option value="Kenya" className="bg-[#0A0A0A]">Kenya</option>
                                <option value="USA" className="bg-[#0A0A0A]">USA</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>
                    </div>

                    <div className="relative group/input">
                        <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                            <Phone className="w-4 h-4 text-white" />
                        </div>
                        <input
                            type="tel"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-11 md:pl-12 pr-5 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-sm md:text-base placeholder:text-white/10"
                            placeholder="Phone Number"
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
                    className="space-y-4 md:space-y-6"
                >
                    <button type="button" onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] mb-4">
                        <ChevronLeft size={14} /> Go Back
                    </button>
                    
                    <div className="relative group/input">
                        <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                            <Mail className="w-4 h-4 text-white" />
                        </div>
                        <input
                            type="email"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-11 md:pl-12 pr-5 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-sm md:text-base placeholder:text-white/10"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <div className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 flex items-center gap-3 pointer-events-none opacity-20 group-focus-within/input:opacity-100 transition-all">
                            <Lock className="w-4 h-4 text-white" />
                        </div>
                        <input
                            type="password"
                            className="w-full bg-white/[0.03] border border-white/10 rounded-xl md:rounded-2xl pl-11 md:pl-12 pr-5 py-3.5 md:py-4 text-white font-medium focus:outline-none focus:border-[#4DB6AC] transition-all text-sm md:text-base placeholder:text-white/10"
                            placeholder="Create Password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
                        <ShieldCheck className="text-[#4DB6AC] shrink-0" size={18} />
                        <p className="text-[9px] text-white/20 font-black leading-relaxed uppercase tracking-[0.2em]">
                            Your medical data is encrypted and protected.
                        </p>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

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
                            {step === 1 ? "Continue" : "Create Account"} 
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-2 transition-transform" />
                        </>
                    )}
                </button>
            </div>
            </form>
        </div>

        <div className="flex flex-col items-center gap-6 pb-12">
            <div className="flex items-center gap-3 opacity-40">
                <Fingerprint size={14} className="text-[#4DB6AC]" />
                <p className="text-[8px] font-black uppercase tracking-[0.4em]">Secure Registration</p>
            </div>
            <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.3em]">
              Already have an account? <Link href="/login" className="text-white hover:text-[#4DB6AC] transition-all ml-2 border-b border-white/20">Login</Link>
            </p>
        </div>
      </motion.div>
    </div>
  )
}