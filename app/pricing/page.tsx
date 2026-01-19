/**
 * 🛡️ AFRIDAM CLINICAL BILLING: PRICING
 * Version: 2026.1.2 (Premium Editorial Refactor)
 * Handshake: Fully synced with Flutterwave Gateway
 * Focus: High-Contrast UI, Secure Ambiance, Mature Typography.
 */

"use client"

import React, { useState } from "react"
import { PricingTable } from "@/components/pricing-table"
import { ChevronLeft, ShieldCheck, Star, Zap, Loader2, Fingerprint, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "@/providers/theme-provider"
import { useAuth } from "@/providers/auth-provider"

export default function PricingPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const isDark = theme === "dark";

  // 🛡️ RE-ENFORCED: FLUTTERWAVE INITIALIZATION LOGIC
  const handlePaymentInit = async (planType: string, amount: number) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      // 🚀 HANDSHAKE: Hits the Render Backend /api/payments endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/initialize`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ 
          plan: planType, 
          amount: amount,
          currency: "USD" 
        })
      });

      const data = await response.json();
      
      if (data.resultData?.link || data.link) {
        // Redirect to Flutterwave Secure Checkout
        window.location.href = data.resultData?.link || data.link;
      } else {
        throw new Error("Payment link generation failed");
      }
    } catch (err) {
      console.error("Clinical Payment Sync Error:", err);
      alert("Billing system busy. Please try again in a moment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-x-hidden relative">
      
      {/* --- PREMIUM AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      {/* 1. WORLD-CLASS NAVIGATION */}
      <nav className="relative z-50 max-w-screen-xl mx-auto px-6 h-24 flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F] transition-all"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
          <span className="hidden sm:inline">Back to Hub</span>
        </button>
        
        <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 px-6 py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full">
                <Lock size={14} className="text-[#4DB6AC]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60 text-black dark:text-white">Encrypted Checkout</span>
            </div>
            <img 
              src="/logo.png" 
              alt="AfriDam" 
              className={`h-10 w-auto object-contain transition-all ${isDark ? '' : 'invert'}`} 
            />
        </div>
      </nav>

      <main className="relative z-10 max-w-screen-xl mx-auto px-6 pb-32 space-y-24 md:space-y-40">
        
        {/* 2. SOPHISTICATED HEADLINE */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-10"
        >
          <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-white/5 px-6 py-2 rounded-full border border-gray-200 dark:border-white/10">
             <div className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
             <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-[0.4em]">Membership Protocol</span>
          </div>
          
          <h1 className="text-6xl md:text-[10rem] font-black italic uppercase tracking-[-0.05em] leading-[0.8] text-black dark:text-white">
            Simple <br /> <span className="text-[#E1784F]">Pricing.</span>
          </h1>
          
          <p className="text-[11px] md:text-sm font-black uppercase tracking-[0.5em] opacity-40 max-w-2xl mx-auto leading-relaxed">
            Beautiful skin starts with expert support. Select your clinical access tier to begin.
          </p>
        </motion.div>

        {/* 3. PRICING TABLE CONTAINER */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <PricingTable onUpgrade={handlePaymentInit} isProcessing={isProcessing} />
          </motion.div>
          
          {isProcessing && (
            <div className="fixed inset-0 bg-white/90 dark:bg-black/95 backdrop-blur-2xl z-[100] flex flex-col items-center justify-center space-y-8">
                <Loader2 className="animate-spin text-[#E1784F]" size={60} strokeWidth={3} />
                <div className="text-center space-y-2">
                   <p className="text-[12px] font-black uppercase tracking-[0.6em] text-[#E1784F]">Authenticating Gateway</p>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30">Redirecting to Secure Checkout...</p>
                </div>
            </div>
          )}
        </div>

        {/* 4. CLINICAL TRUST BANNER */}
        <footer className="pt-24 border-t border-gray-100 dark:border-white/10 flex flex-col items-center gap-16">
           <div className="flex flex-col items-center gap-8">
              <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-30">Secure Infrastructure</p>
              <div className="flex items-center gap-6 opacity-30">
                <Fingerprint className="text-[#4DB6AC]" size={24} />
                <span className="font-black italic uppercase tracking-tighter text-4xl">Clinical Grade</span>
              </div>
           </div>
           
           <div className="max-w-3xl text-center space-y-10">
              <p className="text-[11px] font-bold text-black dark:text-white uppercase tracking-[0.2em] leading-relaxed opacity-40 italic">
                All consultations are conducted by board-certified professionals. 
                Your medical data is protected with AES-256 encryption, 
                ensuring 100% privacy between you and your specialist.
              </p>
              <div className="flex flex-wrap justify-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">
                <span className="cursor-pointer hover:underline underline-offset-8">Data Privacy</span>
                <span className="cursor-pointer hover:underline underline-offset-8">Billing Terms</span>
                <span className="cursor-pointer hover:underline underline-offset-8">Refund Policy</span>
              </div>
           </div>
           <p className="text-[9px] font-black uppercase tracking-[1em] opacity-20 pt-10">© 2026 AFRIDAM AI CLINICAL SYSTEMS</p>
        </footer>
      </main>
    </div>
  )
}