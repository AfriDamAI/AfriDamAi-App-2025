"use client"

import React from "react"
import { ChevronLeft, ShieldCheck, Zap, Globe, Users, HeartPulse, Stethoscope } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function MissionPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-24 lg:p-32 transition-colors duration-500 selection:bg-[#E1784F]/30 overflow-x-hidden">
      
      {/* 1. NAVIGATION & LOGO */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-16 md:mb-20">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-2 bg-muted border border-border px-5 py-2.5 rounded-full text-[#E1784F] font-black uppercase text-[9px] tracking-[0.3em] hover:bg-[#E1784F] hover:text-white transition-all shadow-sm"
        >
          <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        
        <img 
          src="/logo.png" 
          alt="AfriDam AI" 
          className="h-12 md:h-16 w-auto object-contain" 
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-16 md:space-y-24">
        
        {/* 2. THE MANIFESTO HEADER - Fixed for Mobile Fitting */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 md:space-y-8 text-center md:text-left"
        >
          <span className="text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.6em] block">Our Why</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] text-foreground">
            Bridging the <br /> <span className="text-[#E1784F]">Care Gap.</span>
          </h1>
          <p className="text-xl md:text-2xl font-bold leading-tight max-w-3xl text-muted-foreground uppercase tracking-tight mx-auto md:mx-0">
            AfriDam AI was born in <span className="text-foreground font-black underline decoration-[#4DB6AC] underline-offset-4">Lagos</span> to fix a global failure: Skin health tools were never built for us.
          </p>
        </motion.div>

        {/* 3. THE SHOCKING TRUTH SECTION */}
        <div className="bg-card border border-border p-8 md:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/10 blur-3xl rounded-full" />
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-foreground leading-none">
                The Reality <br />of African Care
              </h2>
              <div className="space-y-4 text-muted-foreground font-medium leading-relaxed">
                <p>
                  In Nigeria, there are fewer than <span className="text-[#E1784F] font-black underline">200 dermatologists</span> for over <span className="text-foreground font-black">200 million people</span>. That is one specialist for every million Nigerians. 
                </p>
                <p>
                  Global AI models are trained on low-melanin data. Yet, many hospitals still use them, leading to misdiagnosis of African skin every single day.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-background rounded-3xl border border-border text-center">
                <Users className="mx-auto mb-2 text-[#4DB6AC]" />
                <p className="text-2xl font-black italic text-[#E1784F]">1 : 1M</p>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Doctor Ratio</p>
              </div>
              <div className="p-6 bg-background rounded-3xl border border-border text-center">
                <Stethoscope className="mx-auto mb-2 text-[#4DB6AC]" />
                <p className="text-2xl font-black italic text-[#E1784F]">Biased</p>
                <p className="text-[8px] font-bold uppercase tracking-widest opacity-60">Global AI Tools</p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. CORE VALUES GRID */}
        <div className="grid md:grid-cols-3 gap-10 border-y border-border py-16">
          {[
            { icon: HeartPulse, title: "Medical Ethics", text: "Nurse-led development ensures medical safety is in every line of code." },
            { icon: Zap, title: "Melanin-First", text: "Smart technology trained specifically to understand melanin-rich skin types." },
            { icon: Globe, title: "Total Access", text: "Putting a world-class dermatologist in your pocket, anywhere in Africa." }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="w-12 h-12 bg-[#4DB6AC]/10 rounded-xl flex items-center justify-center text-[#4DB6AC]">
                <item.icon size={24} />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* 5. FOUNDER'S SIGNATURE */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
             <div className="p-8 md:p-12 bg-muted border border-border rounded-[3rem] relative shadow-xl">
                <div className="flex gap-6 items-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-[#E1784F] to-[#4DB6AC] flex items-center justify-center text-white font-black text-2xl italic shadow-lg">
                    OO
                  </div>
                  <div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">Ogirima Obey</h3>
                    <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.3em]">Founder • RN & AI Dev</p>
                  </div>
                </div>
                <blockquote className="mt-8 text-xl md:text-2xl italic font-bold leading-snug border-l-4 border-[#E1784F] pl-6 text-foreground">
                  "We’re not just building AI — we’re restoring dignity in care. We believe everyone deserves to be seen by technology, equally."
                </blockquote>
             </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter">The Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              We are engineering the continent's most sophisticated vision engine. By combining high-precision analysis with a vetted marketplace of safe products, we empower you to take charge of your skin health instantly.
            </p>
            <div className="flex gap-2 pt-2">
               <div className="h-1 w-12 bg-[#E1784F] rounded-full" />
               <div className="h-1 w-6 bg-[#4DB6AC] rounded-full" />
               <div className="h-1 w-3 bg-border rounded-full" />
            </div>
          </div>
        </section>

        {/* 6. FINAL CTA */}
        <div className="py-20 text-center space-y-10">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground">© 2026 AfriDam AI Clinical Systems</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full sm:w-auto px-12 py-6 bg-foreground text-background font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl hover:bg-[#4DB6AC] hover:text-white transition-all shadow-xl"
          >
            Access Clinical Portal
          </button>
        </div>
      </div>
    </main>
  )
}