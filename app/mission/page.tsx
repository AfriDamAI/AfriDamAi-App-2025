"use client"

import React from "react"
import { ChevronLeft, Zap, Globe, HeartPulse, Stethoscope, Users, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function MissionPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-[#E1784F]/30 overflow-x-hidden">
      
      {/* 🛡️ 1. SLIM NAVIGATION FOR MOBILE FOCUS */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-[#E1784F] font-black uppercase text-[9px] tracking-[0.3em] active:scale-90 transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>
          
          <img 
            src="/logo.png" 
            alt="AfriDam AI" 
            className="h-8 md:h-12 w-auto object-contain" 
          />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-24 space-y-20 md:space-y-32">
        
        {/* 🛡️ 2. BOLD MANIFESTO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4DB6AC]/10 border border-[#4DB6AC]/20">
             <span className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.4em]">Our Why</span>
          </div>
          <h1 className="text-5xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter leading-[0.85] text-foreground">
            Bridging the <br /> <span className="text-[#E1784F]">Care Gap.</span>
          </h1>
          <p className="text-lg md:text-2xl font-bold leading-tight max-w-2xl text-muted-foreground uppercase tracking-tight">
            AfriDam AI was born in <span className="text-foreground font-black underline decoration-[#4DB6AC] underline-offset-4">Lagos</span> to fix a global failure: Skin health tools were never built for us.
          </p>
        </motion.div>

        {/* 🛡️ 3. CLINICAL REALITY CARD */}
        <div className="group bg-card border border-border p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all hover:border-[#E1784F]/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/5 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground leading-none">
                The Reality <br />of African Care
              </h2>
              <div className="space-y-6 text-muted-foreground font-medium leading-relaxed text-sm md:text-base">
                <p>
                  In Nigeria, there are fewer than <span className="text-[#E1784F] font-black underline">200 dermatologists</span> for over <span className="text-foreground font-black">200 million people</span>. That is one specialist for every million Nigerians. 
                </p>
                <p>
                  Global AI models are trained on low-melanin data. Yet, many hospitals still use them, leading to misdiagnosis of African skin every single day.
                </p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-8 bg-background/50 backdrop-blur-md rounded-[2.5rem] border border-border text-center space-y-2">
                <Users className="mx-auto text-[#4DB6AC]" size={24} />
                <p className="text-3xl font-black italic text-[#E1784F]">1:1M</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Doctor Ratio</p>
              </div>
              <div className="p-8 bg-background/50 backdrop-blur-md rounded-[2.5rem] border border-border text-center space-y-2">
                <Stethoscope className="mx-auto text-[#4DB6AC]" size={24} />
                <p className="text-3xl font-black italic text-[#E1784F]">Biased</p>
                <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Current Tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🛡️ 4. CORE CLINICAL VALUES */}
        <div className="grid md:grid-cols-3 gap-12 py-16 border-y border-border/50">
          {[
            { icon: HeartPulse, title: "Medical Ethics", text: "Nurse-led development ensures medical safety is in every line of code.", color: "text-[#4DB6AC]" },
            { icon: Zap, title: "Melanin-First", text: "Smart technology trained specifically to understand melanin-rich skin types.", color: "text-[#E1784F]" },
            { icon: Globe, title: "Total Access", text: "Putting a world-class dermatologist in your pocket, anywhere in Africa.", color: "text-blue-400" }
          ].map((item, i) => (
            <div key={i} className="space-y-6">
              <div className={`w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center ${item.color}`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">{item.title}</h3>
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* 🛡️ 5. THE FOUNDER'S VOW */}
        <section className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="relative group">
             <div className="p-10 md:p-14 bg-card border border-border rounded-[3.5rem] relative shadow-2xl transition-all hover:border-[#4DB6AC]/20">
                <div className="flex gap-6 items-center mb-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#E1784F] to-[#4DB6AC] flex items-center justify-center text-white font-black text-2xl italic shadow-lg">
                    OO
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">Ogirima Obey</h3>
                    <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.3em]">Founder • RN & AI Dev</p>
                  </div>
                </div>
                <blockquote className="text-2xl md:text-3xl italic font-black leading-[1.1] text-foreground tracking-tighter">
                  "We’re not just building AI — we’re restoring dignity in care. We believe everyone deserves to be seen by technology, equally."
                </blockquote>
                <div className="mt-8 flex gap-2">
                   <div className="h-1 w-12 bg-[#E1784F] rounded-full" />
                   <div className="h-1 w-6 bg-[#4DB6AC] rounded-full" />
                </div>
             </div>
          </div>

          <div className="space-y-8 pt-4">
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">The Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              We are engineering the continent's most sophisticated vision engine. By combining high-precision analysis with a vetted marketplace of safe products, we empower you to take charge of your skin health instantly.
            </p>
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-3 text-[#E1784F] font-black uppercase text-[11px] tracking-widest"
            >
              Enter Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>

        {/* 🛡️ 6. FOOTER CTA */}
        <div className="py-20 text-center space-y-12">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground opacity-30">© 2026 AfriDam AI Clinical Systems</p>
          <button 
            onClick={() => router.push('/onboarding')}
            className="w-full sm:w-auto px-12 py-7 bg-[#E1784F] text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-[2rem] shadow-2xl active:scale-95 transition-all"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </main>
  )
}