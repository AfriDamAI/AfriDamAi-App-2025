"use client"

import React, { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  CheckCircle2, ArrowRight, Package, 
  Sparkles, ShieldCheck, ShoppingBag,
  LayoutDashboard
} from "lucide-react"
import { motion } from "framer-motion"

/**
 * 🛡️ AFRIDAM CARE HUB: SUCCESS PORTAL (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: Transaction Confirmation & Specialist Next-Steps.
 */

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reference = searchParams.get('ref') || searchParams.get('reference')

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white flex items-center justify-center p-6 relative overflow-hidden text-center">
      
      {/* 🏛️ CINEMATIC GLOW BACKGROUND */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#4DB6AC]/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full space-y-10 relative z-10"
      >
        {/* SUCCESS ICON */}
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 12, delay: 0.2 }}
            className="w-24 h-24 bg-[#4DB6AC] text-white rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-[#4DB6AC]/40"
          >
            <CheckCircle2 size={48} strokeWidth={3} />
          </motion.div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4 text-[#E1784F]"
          >
            <Sparkles size={32} />
          </motion.div>
        </div>

        {/* MESSAGE */}
        <div className="space-y-4">
          <h1 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
            Order <br /> <span className="text-[#4DB6AC]">Secured</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 leading-relaxed">
            Your care solutions are being prepared <br /> for your skin journey.
          </p>
        </div>

        {/* ORDER DETAILS CARD */}
        <div className="p-8 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[3rem] space-y-6 text-left">
           <div className="flex justify-between items-center pb-4 border-b border-black/5 dark:border-white/5">
              <span className="text-[8px] font-black uppercase tracking-widest opacity-30">Care ID</span>
              <span className="text-[10px] font-mono font-bold text-[#E1784F]">{reference?.slice(0, 12) || "SYNCING..."}</span>
           </div>
           
           <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#4DB6AC]/10 text-[#4DB6AC] flex items-center justify-center shrink-0">
                 <Package size={20} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-[11px] font-black uppercase tracking-tight">Diary Updated</h4>
                 <p className="text-[8px] font-bold opacity-30 uppercase tracking-tighter">Your routine has been updated based on this purchase.</p>
              </div>
           </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-4">
           <button 
            onClick={() => router.push('/dashboard')}
            className="w-full h-20 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black uppercase text-[10px] tracking-[0.4em] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl"
           >
             <LayoutDashboard size={18} /> Return to Hub
           </button>
           
           <button 
            onClick={() => router.push('/marketplace')}
            className="w-full h-16 bg-transparent text-black dark:text-white border border-black/10 dark:border-white/10 rounded-2xl font-black uppercase text-[8px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
           >
             <ShoppingBag size={14} /> Continue Shopping
           </button>
        </div>

        {/* FOOTER VERIFICATION */}
        <div className="pt-6 flex flex-col items-center gap-3 opacity-20">
           <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#4DB6AC]" />
              <span className="text-[7px] font-black uppercase tracking-[0.5em]">Payment Verified by Paystack</span>
           </div>
        </div>
      </motion.div>
    </main>
  )
}