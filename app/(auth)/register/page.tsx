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
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return
    }
    
    setError(null)
    setIsLoading(true)
    
    try {
      await signUp(formData)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.response?.data?.message || "REGISTRATION FAILED. VERIFY DETAILS.")
      setStep(1) 
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#0A0A0A] flex flex-col justify-center items-center p-4 md:p-10 selection:bg-[#4DB6AC]/30 relative overflow-x-hidden font-sans">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-[-20%] left-[-10%] w-[350px] md:w-[700px] h-[350px] md:h-[700px] bg-[#4DB6AC]/10 blur-[100px] md:blur-[180px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-[#E1784F]/10 blur-[80px] md:blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <div className="w-full max-w-2xl space-y-8 md:space-y-12 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4 md:space-y-6">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 md:w-24 md:h-24 bg-[#4DB6AC] rounded-[2rem] flex items-center justify-center font-black text-4xl md:text-5xl text-white shadow-xl mx-auto mb-6 rotate-3"
          >
            A
          </motion.div>
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.85] text-center">
            Create <br /> <span className="text-[#4DB6AC]">Account</span>
          </h1>
          
          <div className="flex justify-center gap-2 pt-2">
            <div className={`h-1.5 rounded-full transition-all duration-700 ${step === 1 ? 'w-12 md:w-16 bg-[#4DB6AC]' : 'w-4 bg-white/10'}`} />
            <div className={`h-1.5 rounded-full transition-all duration-700 ${step === 2 ? 'w-12 md:w-16 bg-[#4DB6AC]' : 'w-4 bg-white/10'}`} />
          </div>
        </div>

        {/* --- MAIN FORM CARD --- */}
        <div className="relative group">
            <button 
                type="button"
                onClick={handleCancel}
                className="absolute -top-4 -right-2 md:-top-6 md:-right-6 p-4 md:p-5 text-white/40 hover:text-white transition-all bg-white/5 backdrop-blur-3xl rounded-full z-[100] border border-white/10"
            >
                <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <form onSubmit={handleSubmit} className="bg-white/[0.03] border border-white/10 p-6 md:p-20 rounded-[3rem] md:rounded-[5rem] shadow-2xl backdrop-blur-3xl space-y-6 md:space-y-10">
            
            {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest text-center">
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
                            <User className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#4DB6AC]" />
                            <input
                                type="text"
                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-6 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-md md:text-xl placeholder:text-white/10 uppercase"
                                placeholder="FIRST NAME"
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                required
                            />
                        </div>
                        <div className="relative group/input">
                            <input
                                type="text"
                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] px-8 md:px-10 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-md md:text-xl placeholder:text-white/10 uppercase"
                                placeholder="LAST NAME"
                                value={formData.lastName}
                                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="relative">
                            <select
                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] px-8 md:px-10 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-md md:text-xl uppercase"
                                onChange={(e) => setFormData({...formData, sex: e.target.value})}
                                value={formData.sex}
                            >
                                <option value="male" className="bg-[#0A0A0A]">MALE</option>
                                <option value="female" className="bg-[#0A0A0A]">FEMALE</option>
                            </select>
                            <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>

                        <div className="relative">
                            <Globe className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                            <select
                                className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-6 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#4DB6AC] appearance-none cursor-pointer text-md md:text-xl uppercase"
                                onChange={(e) => setFormData({...formData, country: e.target.value})}
                                value={formData.country}
                            >
                                <option value="Nigeria" className="bg-[#0A0A0A]">NIGERIA</option>
                                <option value="Ghana" className="bg-[#0A0A0A]">GHANA</option>
                                <option value="Kenya" className="bg-[#0A0A0A]">KENYA</option>
                                <option value="USA" className="bg-[#0A0A0A]">USA</option>
                            </select>
                            <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 text-xs">▼</div>
                        </div>
                    </div>

                    <div className="relative group/input">
                        <Phone className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input
                            type="tel"
                            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-6 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-md md:text-xl placeholder:text-white/10 uppercase"
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
                    className="space-y-4 md:space-y-6"
                >
                    <button onClick={() => setStep(1)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#4DB6AC] mb-4">
                        <ChevronLeft size={16} /> BACK TO IDENTITY
                    </button>
                    
                    <div className="relative group/input">
                        <Mail className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#4DB6AC]" />
                        <input
                            type="email"
                            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-6 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-md md:text-xl placeholder:text-white/10 uppercase"
                            placeholder="EMAIL ADDRESS"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            required
                        />
                    </div>

                    <div className="relative group/input">
                        <Lock className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within/input:text-[#4DB6AC]" />
                        <input
                            type="password"
                            className="w-full bg-black/40 border-2 border-white/5 rounded-2xl md:rounded-[2.5rem] pl-16 md:pl-20 pr-6 py-5 md:py-8 text-white font-bold focus:outline-none focus:border-[#4DB6AC] transition-all text-md md:text-xl placeholder:text-white/10 uppercase"
                            placeholder="CREATE PASSWORD"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            required
                        />
                    </div>

                    <div className="bg-[#4DB6AC]/5 p-5 md:p-8 rounded-2xl md:rounded-[3rem] border border-[#4DB6AC]/10 flex items-start gap-4">
                        <ShieldCheck className="text-[#4DB6AC] shrink-0" size={20} />
                        <p className="text-[9px] text-white/40 font-black leading-relaxed uppercase tracking-widest">
                            Clinical data is encrypted and stored in private African-hosted nodes.
                        </p>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#E1784F] text-white font-black uppercase text-sm md:text-lg tracking-[0.3em] md:tracking-[0.4em] py-6 md:py-9 rounded-2xl md:rounded-[2.5rem] shadow-xl transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-[0.98]"
            >
                {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                    <>
                        {step === 1 ? "CONTINUE" : "CREATE ACCOUNT"} 
                        <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                    </>
                )}
            </button>
            </form>
        </div>

        <p className="text-center text-[11px] text-white/20 font-black uppercase tracking-widest pb-10">
          Already a member? <Link href="/login" className="text-[#4DB6AC] hover:underline ml-2">Sign In</Link>
        </p>
      </div>
    </div>
  )
}