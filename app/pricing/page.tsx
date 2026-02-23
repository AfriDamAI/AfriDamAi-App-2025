"use client"

/**
 * 🛡️ AFRIDAM CARE PLANS (Rule 6 Synergy)
 * Version: 2026.1.22 (Specialist Sync & Paystack Handshake)
 * Focus: Relatable Pricing & Instant Specialist Access.
 */

import React, { useState } from "react"
import { PricingTable } from "@/components/pricing-table"
import { ChevronLeft, ShieldCheck, Zap, Loader2, Fingerprint, Lock, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/providers/auth-provider"
import { initializePayment } from "@/lib/api-client"

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * 💳 DIRECT HANDSHAKE: Paystack Gateway
   * Syncs with the $15 Urgent Consultation and Monthly Plans.
   */
  const handlePaymentInit = async (planType: string, amount: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 🚀 Handshake with the backend webhook logic
      const response = await initializePayment({ 
        plan: planType, 
        amount: amount 
      });

      // Redirect to the Paystack/Flutterwave board
      const authUrl = response.authorizationUrl || response.data?.authorizationUrl;
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        throw new Error("Link failed");
      }
    } catch (err) {
      console.error("Payment sync failed");
      alert("Our payment board is resting. Please try again in a few seconds.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 overflow-x-hidden relative">
      
      {/* --- SOFT AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      {/* 1. NAVIGATION */}
      <nav className="relative z-50 max-w-screen-xl mx-auto px-6 h-24 flex items-center justify-between">
        <button 
          onClick={() => router.push('/dashboard')}
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          <span>Back to Hub</span>
        </button>
        
        <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full">
                <Lock size={12} className="text-[#4DB6AC]" />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Safe Payment</span>
            </div>
            <h2 className="text-lg font-black italic tracking-tighter">AFRIDAM <span className="text-[#E1784F]">AI</span></h2>
        </div>
      </nav>

      <main className="relative z-10 max-w-screen-xl mx-auto px-6 pb-32 space-y-20">
        
        {/* 2. SOFT HEADLINE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-[#E1784F]/10 px-5 py-2 rounded-full border border-[#E1784F]/20">
             <Sparkles className="text-[#E1784F]" size={14} />
             <span className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.3em]">Choose Your Glow Plan</span>
          </div>
          
          <h1 className="text-5xl md:text-[8rem] font-black italic uppercase tracking-tighter leading-none text-black dark:text-white">
            Simple <br /> <span className="text-[#E1784F]">Pricing.</span>
          </h1>
          
          <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 max-w-xl mx-auto leading-relaxed">
            Beautiful skin starts with expert care. Pick a plan that fits your skin goals.
          </p>
        </motion.div>

        {/* 3. PRICING TABLE */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* 🛡️ SYNCED COMPONENT: Now includes the $15 Urgent tier */}
            <PricingTable onUpgrade={handlePaymentInit} isProcessing={isProcessing} />
          </motion.div>
          
          {isProcessing && (
            <div className="fixed inset-0 bg-white/90 dark:bg-black/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center space-y-6">
                <Loader2 className="animate-spin text-[#E1784F]" size={48} />
                <div className="text-center space-y-1">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Opening Secure Board</p>
                   <p className="text-[8px] font-black uppercase tracking-widest opacity-30">Please wait a second...</p>
                </div>
            </div>
          )}
        </div>

        {/* 4. TRUST FOOTER */}
        <footer className="pt-20 border-t border-gray-100 dark:border-white/10 flex flex-col items-center gap-12">
           <div className="flex items-center gap-6 opacity-40">
                <ShieldCheck className="text-[#4DB6AC]" size={20} />
                <span className="font-black italic uppercase tracking-tighter text-2xl">Family Protected</span>
           </div>
           
           <div className="max-w-2xl text-center space-y-8">
              <p className="text-[9px] font-bold text-black dark:text-white uppercase tracking-widest leading-loose opacity-40 italic">
                All help is provided by verified skin specialists. 
                Your photos and data are encrypted and kept private between you and your expert.
              </p>
              <div className="flex justify-center gap-8 text-[9px] font-black uppercase tracking-widest text-[#E1784F]">
                <span className="cursor-pointer">Privacy</span>
                <span className="cursor-pointer">Billing</span>
                <span className="cursor-pointer">Refunds</span>
              </div>
           </div>
           <p className="text-[8px] font-black uppercase tracking-[0.8em] opacity-20">© 2026 AFRIDAM AI</p>
        </footer>
      </main>
    </div>
  )
}