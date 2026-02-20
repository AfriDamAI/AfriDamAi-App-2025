/**
 * 🛡️ AFRIDAM MANIFESTO: MISSION & VISION
 * Version: 2026.1.2 (Premium Editorial Refactor)
 * Focus: High-Contrast, Mature Typography, Clinical Integrity.
 */

"use client"

import React from "react"
import { ChevronLeft, Zap, Globe, HeartPulse, Stethoscope, Users, ArrowRight, ShieldCheck, Fingerprint } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function MissionPage() {
  const router = useRouter();

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 selection:bg-[#E1784F]/30 relative overflow-x-hidden">
      
      {/* --- PREMIUM AMBIANCE --- */}
      <div className="absolute top-0 right-0 w-full h-[800px] bg-[radial-gradient(circle_at_70%_0%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_20%_100%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      {/* WORLD-CLASS NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-b border-gray-100 dark:border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 h-24 flex justify-between items-center">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-3 text-[#E1784F] font-black text-[10px] tracking-[0.4em] transition-all"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
            <span className="hidden sm:inline">Return</span>
          </button>
          
          <div className="flex items-center gap-4">
            <Fingerprint size={18} className="text-[#4DB6AC] opacity-40" />
            <span className="text-[9px] font-black tracking-[0.5em] opacity-30 hidden sm:inline text-black dark:text-white">Clinical Protocol 2026.1</span>
          </div>
        </div>
      </nav>

      <div className="max-w-screen-xl mx-auto px-6 py-16 md:py-32 space-y-24 md:space-y-28 relative z-10">
        
        {/* 1. THE MANIFESTO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
             <div className="w-1.5 h-1.5 rounded-full bg-[#4DB6AC] animate-pulse" />
             <span className="text-black dark:text-white text-[10px] font-black tracking-[0.4em]">The Mandate</span>
          </div>
          <h1 className="text-7xl md:text-[6rem] font-black italic capitalize tracking-[-0.06em] leading-[0.8] text-black dark:text-white">
            Bridging the <br /> <span className="text-[#E1784F]">Care Gap.</span>
          </h1>
          <p className="text-xl md:text-3xl font-medium leading-tight max-w-3xl opacity-60 tracking-tighter">
            AfriDam AI was born in <span className="text-black dark:text-white font-black underline decoration-[#E1784F] underline-offset-8">Lagos</span> to address a global oversight: Skincare technology was never engineered for melanin-rich profiles.
          </p>
        </motion.div>

        {/* 2. CLINICAL REALITY (The "Why") */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <h2 className="text-5xl md:text-4xl font-black italic tracking-tighter leading-[0.9]">
              The Reality <br />of African Care
            </h2>
            <div className="space-y-8 text-lg font-medium opacity-50 leading-relaxed max-w-xl">
              <p>
                In Nigeria, fewer than <span className="text-[#E1784F] font-black border-b border-[#E1784F]/30">200 dermatologists</span> exist for over <span className="text-black dark:text-white font-black">200 million citizens</span>. 
              </p>
              <p>
                Global AI models are trained on low-melanin datasets, yet these tools are deployed across African hospitals, leading to consistent misdiagnosis.
              </p>
            </div>
            
            <div className="flex items-center gap-6 p-8 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10">
               <ShieldCheck className="text-[#4DB6AC]" size={32} />
               <p className="text-[11px] font-black tracking-[0.2em] leading-relaxed opacity-60">
                 We are re-engineering the vision engine to prioritize melanin-rich health.
               </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-10 bg-black dark:bg-white text-white dark:text-black rounded-[4rem] text-center space-y-4 shadow-2xl">
              <Users className="mx-auto opacity-30" size={28} />
              <p className="text-4xl font-black italic tracking-tighter">1:1M</p>
              <p className="text-[10px] font-black capitalize tracking-[0.3em] opacity-40">Doctor Ratio</p>
            </div>
            <div className="p-10 bg-gray-50 dark:bg-white/5 rounded-[4rem] border border-gray-100 dark:border-white/10 text-center space-y-4">
              <Stethoscope className="mx-auto text-[#E1784F]" size={28} />
              <p className="text-4xl font-black italic tracking-tighter">Biased</p>
              <p className="text-[10px] font-black capitalize tracking-[0.3em] opacity-40">Global Models</p>
            </div>
          </div>
        </section>

        {/* 3. CORE CLINICAL VALUES */}
        <div className="grid md:grid-cols-3 gap-16 md:gap-24 py-24 border-y border-gray-100 dark:border-white/10">
          {[
            { icon: HeartPulse, title: "Nurse-Led", text: "Medical ethics are embedded in every line of code by Registered Nurses.", color: "text-[#4DB6AC]" },
            { icon: Zap, title: "Melanin-First", text: "Proprietary AI trained specifically for the nuances of African skin types.", color: "text-[#E1784F]" },
            { icon: Globe, title: "Instant Access", text: "World-class dermatological intelligence in the pocket of every African.", color: "text-blue-500" }
          ].map((item, i) => (
            <div key={i} className="space-y-8 group">
              <div className={`w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                <item.icon size={32} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-black italic tracking-tighter leading-none">{item.title}</h3>
                <p className="text-[11px] font-bold tracking-[0.2em] opacity-40 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 4. THE FOUNDER'S VOW */}
        <section className="grid lg:grid-cols-2 gap-20 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 md:p-20 bg-black dark:bg-white text-white dark:text-black rounded-[5rem] relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#E1784F]/20 blur-[100px] rounded-full" />
            
            <div className="flex gap-6 items-center mb-16 relative z-10">
              <div className="w-20 h-20 rounded-3xl bg-[#E1784F] flex items-center justify-center text-white font-black text-3xl italic shadow-xl">
                OO
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic tracking-tighter">Ogirima Obey</h3>
                <p className="opacity-50 text-[10px] font-black tracking-[0.4em]">Founder • RN & AI Dev</p>
              </div>
            </div>
            
            <blockquote className="text-4xl md:text-6xl italic font-black leading-[0.95] tracking-tighter relative z-10">
              "We are not just building AI — we are restoring dignity in care. Everyone deserves to be seen."
            </blockquote>
          </motion.div>

          <div className="space-y-12 py-10">
            <h2 className="text-5xl md:text-7xl font-black italic capitalize tracking-tighter leading-[0.9]">The Vision</h2>
            <p className="text-xl font-medium opacity-50 leading-relaxed">
              We are engineering the continent's most sophisticated clinical vision engine. By merging precision analysis with a vetted marketplace, we empower you to take total charge of your skin health, instantly and securely.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-4 text-[#E1784F] font-black text-[12px] tracking-[0.4em]"
            >
              Enter Clinic <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
            </button>
          </div>
        </section>

        {/* 5. FINAL CTA */}
        <div className="py-24 text-center space-y-16">
          <div className="space-y-4">
             <p className="text-[10px] font-black tracking-[0.8em] opacity-30">© 2026 AfriDam AI Clinical Systems</p>
             <h4 className="text-2xl font-black italic tracking-tighter opacity-20">Lagos • London • Nairobi</h4>
          </div>
          <button 
            onClick={() => router.push('/register')}
            className="w-full md:w-auto px-16 py-8 bg-[#E1784F] text-white font-black text-[12px] tracking-[0.4em] rounded-[2.5rem] shadow-[0_30px_60px_rgba(225,120,79,0.3)] hover:scale-105 transition-all"
          >
            Start Your Analysis
          </button>
        </div>
      </div>
    </main>
  )
}