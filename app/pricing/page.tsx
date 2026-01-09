"use client"

import React from "react"
import { PricingTable } from "@/components/pricing-table"
import { ChevronLeft, ShieldCheck, Heart, Sparkles, Star, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"

export default function PricingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-hidden relative">
      
      {/* --- WORLD-CLASS BACKGROUND MESH --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#E1784F]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4DB6AC]/5 blur-[120px] rounded-full" />
      </div>

      {/* 1. PREMIUM NAVIGATION */}
      <nav className="relative z-20 p-8 md:p-12 max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center group-hover:bg-[#E1784F] group-hover:text-white transition-all shadow-sm">
            <ChevronLeft size={18} /> 
          </div>
          <span>Back to Dashboard</span>
        </button>
        
        <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-muted/50 backdrop-blur-md border border-border rounded-full shadow-sm">
                <ShieldCheck size={14} className="text-[#4DB6AC]" />
                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Secure Payment in USD</span>
            </div>
            <img 
              src="/logo.png" 
              alt="AfriDam" 
              className={`h-8 w-auto object-contain ${isDark ? 'brightness-100' : 'brightness-0'}`} 
            />
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-8 pb-32 space-y-20">
        
        {/* 2. SOPHISTICATED & PORTABLE HEADLINE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-3 bg-[#E1784F]/10 px-6 py-2 rounded-full border border-[#E1784F]/20">
             <Zap size={14} className="text-[#E1784F] fill-[#E1784F]" />
             <span className="text-[10px] font-black text-[#E1784F] uppercase tracking-[0.4em]">Experience Premium Care</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-foreground">
            Simple <span className="text-[#E1784F]">Care.</span>
          </h1>
          
          <p className="text-muted-foreground font-medium max-w-xl mx-auto text-base leading-relaxed">
            Beautiful skin starts with expert support. Choose a plan that fits your lifestyle and get the clinical care you deserve.
          </p>
        </motion.div>

        {/* 3. THE PRICING TABLE (Updated for USD internally) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative"
        >
          <PricingTable />
        </motion.div>

        {/* 4. CLINICAL TRUST BANNER */}
        <div className="pt-24 border-t border-border flex flex-col items-center gap-12">
           <div className="flex flex-col items-center gap-6">
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground">Trusted Technology</p>
              <div className="flex flex-wrap justify-center gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="flex items-center gap-2">
                    <Star className="fill-current text-[#E1784F]" size={16} />
                    <span className="font-black italic uppercase tracking-tighter text-2xl">Verified Expert Care</span>
                  </div>
              </div>
           </div>
           
           <div className="max-w-2xl text-center space-y-6">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-loose opacity-60">
                All consultations are conducted by board-certified professionals. 
                Your medical data is protected with AES-256 encryption, 
                ensuring 100% privacy between you and your specialist.
              </p>
              <div className="flex justify-center gap-6 text-[9px] font-black uppercase tracking-widest text-[#E1784F]">
                <span className="cursor-pointer hover:opacity-100 opacity-60 transition-opacity">Privacy</span>
                <span className="cursor-pointer hover:opacity-100 opacity-60 transition-opacity">Clinical Terms</span>
                <span className="cursor-pointer hover:opacity-100 opacity-60 transition-opacity">Refunds</span>
              </div>
           </div>
        </div>
      </main>

      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-64 bg-gradient-to-t from-[#E1784F]/5 to-transparent pointer-events-none" />
    </div>
  )
}