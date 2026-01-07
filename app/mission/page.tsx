"use client"

import React from "react"
import { ChevronLeft, ShieldCheck, Zap, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function MissionPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background text-foreground p-8 md:p-24 lg:p-32 transition-colors duration-500 selection:bg-[#E1784F]/30 overflow-x-hidden">
      
      {/* 1. NAVIGATION & LOGO */}
      <div className="max-w-7xl mx-auto flex justify-between items-start mb-20">
        <button 
          onClick={() => router.back()} 
          className="group flex items-center gap-3 bg-muted border border-border px-6 py-3 rounded-full text-[#E1784F] font-black uppercase text-[10px] tracking-[0.4em] hover:bg-[#E1784F] hover:text-white transition-all shadow-sm"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>
        
        <img 
          src="/logo.png" 
          alt="AfriDam AI" 
          className="h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(225,120,79,0.2)]" 
        />
      </div>

      <div className="max-w-5xl mx-auto space-y-24">
        
        {/* 2. THE MANIFESTO HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <span className="text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.6em] block">Clinical Foundation</span>
          <h1 className="text-7xl md:text-[9rem] font-black italic uppercase tracking-tighter leading-[0.85] text-foreground">
            Bridging the <br /> <span className="text-[#E1784F]">Diagnostic Gap.</span>
          </h1>
          <p className="text-2xl md:text-3xl font-bold leading-tight max-w-3xl text-muted-foreground uppercase tracking-tight">
            AfriDam AI was founded in <span className="text-foreground font-black underline decoration-[#4DB6AC] decoration-8 underline-offset-8">Lagos, Nigeria</span> to solve a critical oversight: most dermatological AI models are trained on low-melanin data.
          </p>
        </motion.div>

        {/* 3. CORE VALUES GRID */}
        <div className="grid md:grid-cols-3 gap-12 border-y border-border py-20">
          {[
            { icon: ShieldCheck, title: "Clinical Integrity", text: "Registered Nurse-led development ensuring medical ethics in every line of code." },
            { icon: Zap, title: "Instant Analysis", text: "Proprietary vision engine designed specifically for melanin-rich dermal data." },
            { icon: Globe, title: "Pan-African Reach", text: "Restoring dignity in care for skin types across the continent and the diaspora." }
          ].map((item, i) => (
            <div key={i} className="space-y-6">
              <div className="w-14 h-14 bg-[#4DB6AC]/10 rounded-2xl flex items-center justify-center text-[#4DB6AC]">
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">{item.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* 4. FOUNDER'S SIGNATURE - OGIRIMA OBEY */}
        <section className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
             <div className="p-10 bg-muted border border-border rounded-[4rem] relative overflow-hidden group shadow-2xl">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center relative z-10">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E1784F] to-[#4DB6AC] flex items-center justify-center text-white font-black text-4xl italic shadow-2xl">
                    OO
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">Ogirima Obey</h3>
                    <p className="text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.4em]">Founder • Registered Nurse & AI Developer</p>
                  </div>
                </div>
                <blockquote className="mt-12 text-2xl md:text-3xl italic font-bold leading-snug border-l-8 border-[#E1784F] pl-10 text-foreground">
                  "We’re not just building AI — we’re restoring dignity in care. This is a mission to ensure technology serves all of us, equally."
                </blockquote>
             </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">The Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed font-medium">
              We are engineering the continent's most sophisticated vision engine, specifically designed to recognize conditions on African skin. By combining high-precision analysis with a vetted marketplace, we empower you to decode your skin health instantly.
            </p>
            <div className="flex gap-4 pt-4">
               <div className="h-1 w-20 bg-[#E1784F]" />
               <div className="h-1 w-10 bg-[#4DB6AC]" />
               <div className="h-1 w-5 bg-border" />
            </div>
          </div>
        </section>

        {/* 5. FINAL CTA */}
        <div className="py-24 text-center space-y-10">
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-muted-foreground">© 2026 AfriDam AI Clinical Systems</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-16 py-8 bg-foreground text-background font-black uppercase text-xs tracking-[0.4em] rounded-[2.5rem] hover:bg-[#4DB6AC] hover:text-white transition-all shadow-2xl"
          >
            Access Clinical Portal
          </button>
        </div>
      </div>
    </main>
  )
}