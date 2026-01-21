/**
 * 🛡️ AFRIDAM PRICING ARCHITECTURE (Rule 7 Sync)
 * Version: 2026.1.4 (Payment Handshake Alignment)
 * Focus: High-Precision Transaction Triggers for Paystack.
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation" // Rule 7: For Free tier routing
import { 
  Check, ArrowRight, Clock, Sparkles, 
  Zap, Loader2, Stethoscope, ShieldCheck, Video
} from "lucide-react"

const PLANS = [
  {
    name: "Free",
    tagline: "The Helper",
    price: "$0",
    rawPrice: 0,
    description: "Start your journey and help our AI learn to care for others.",
    features: ["Unlimited Skin Checks", "Simple Skin Reports", "Join our Community", "Ingredient Analysis"],
    buttonText: "Stay Free",
    highlight: false,
    pro: "AI Assistant",
    icon: Sparkles,
    color: "#4DB6AC",
    billing: "/mo"
  },
  {
    name: "Starter",
    tagline: "Special Entry",
    price: "$3",
    rawPrice: 3,
    description: "Your first month of clinical care at a special entry price.",
    features: ["Everything in Free", "Chat with Specialist", "30-Day Full Access", "Routine Analysis"],
    buttonText: "Try for $3",
    highlight: false,
    pro: "Dermatologist",
    icon: Stethoscope,
    color: "#E1784F",
    billing: " once"
  },
  {
    name: "Standard",
    tagline: "The Essential",
    price: "$10",
    rawPrice: 10,
    description: "Complete care for your daily radiant skin journey.",
    features: ["Everything in Starter", "Personal Specialist", "Voice Note Support", "Custom Routines"],
    buttonText: "Choose Standard",
    highlight: true,
    pro: "Dedicated Dr.",
    icon: ShieldCheck,
    color: "#E1784F",
    billing: "/mo"
  },
  {
    name: "Premium",
    tagline: "Dignity Care",
    price: "$20",
    rawPrice: 20,
    description: "Board-certified medical care for serious issues.",
    features: ["Everything in Standard", "Video Call with Specialist", "Digital Prescriptions", "Priority Lab Access"],
    buttonText: "Get Premium",
    highlight: false,
    pro: "Board Specialist",
    icon: Video,
    color: "#C55A32",
    billing: "/mo"
  }
];

interface PricingTableProps {
  onUpgrade?: (plan: string, amount: number) => void;
  isProcessing?: boolean;
}

export function PricingTable({ onUpgrade, isProcessing }: PricingTableProps) {
  const router = useRouter();

  return (
    <div className="w-full space-y-12 text-left">
      
      {/* ⚡ URGENT CARE BANNER */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative group overflow-hidden bg-[#1C1A19] border border-white/5 rounded-[2.8rem] p-8 md:p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#E1784F]/20 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8 text-center md:text-left flex-col md:flex-row">
            <div className="w-16 h-16 bg-[#E1784F] rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-[#E1784F]/40 shrink-0">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-black italic uppercase text-white leading-none tracking-tighter">Urgent Specialist Session</h3>
              <p className="text-[#4DB6AC] font-black text-[10px] uppercase tracking-[0.4em] flex items-center justify-center md:justify-start gap-3">
                <Clock size={14} /> Neural Link Active • Zero Wait Time
              </p>
            </div>
          </div>
          <div className="flex items-center gap-10 flex-col md:flex-row w-full lg:w-auto">
            <div className="text-center md:text-right">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] mb-2 italic">Clinical Credit</p>
              <p className="text-5xl font-black text-white italic tracking-tighter leading-none">$15</p>
            </div>
            <button 
              disabled={isProcessing}
              onClick={() => onUpgrade?.("URGENT_CONSULTATION", 15)}
              className="w-full md:w-auto px-12 h-20 bg-white text-black font-black rounded-2xl hover:bg-[#E1784F] hover:text-white transition-all shadow-xl uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={18} /> : "Initiate Request"} <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 🏛️ SUBSCRIPTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-12">
        {PLANS.map((plan, i) => (
          <div 
            key={i}
            className={`relative p-10 rounded-[3.5rem] border transition-all flex flex-col justify-between group ${
              plan.highlight 
                ? 'bg-card border-[#E1784F] shadow-2xl scale-[1.03] z-10' 
                : 'bg-card/40 border-border hover:border-[#E1784F]/30 shadow-sm'
            }`}
          >
            <div className="space-y-10">
              <div className="space-y-3">
                <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[#4DB6AC]">
                  {plan.tagline}
                </span>
                <h4 className="text-4xl font-black italic uppercase text-foreground leading-none tracking-tighter">{plan.name}</h4>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-foreground italic tracking-tighter">{plan.price}</span>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                  {plan.billing}
                </span>
              </div>

              <p className="text-[11px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">{plan.description}</p>
              
              <div className="py-5 px-6 bg-muted/30 rounded-[1.8rem] border border-border flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-background border border-border text-[#E1784F] shadow-sm">
                   <plan.icon size={18}/>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Clinical Level</p>
                  <p className="text-[10px] font-black italic text-foreground uppercase tracking-tighter">{plan.pro}</p>
                </div>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-4 group/item">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-[#4DB6AC]/10 flex items-center justify-center shrink-0 transition-colors group-hover/item:bg-[#4DB6AC]/20">
                      <Check className="text-[#4DB6AC]" size={12} strokeWidth={4} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground leading-tight uppercase tracking-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              disabled={isProcessing}
              onClick={() => {
                /** 🚀 RULE 7 HANDSHAKE
                 * If price is 0, we simply route to dashboard.
                 * Otherwise, we trigger the payment initializer.
                 */
                if(plan.rawPrice === 0) {
                  router.push("/dashboard");
                } else {
                  onUpgrade?.(plan.name.toUpperCase(), plan.rawPrice);
                }
              }}
              className={`w-full mt-12 h-20 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 ${
              plan.highlight 
                ? 'bg-[#E1784F] text-white hover:shadow-2xl shadow-[#E1784F]/30' 
                : 'bg-muted text-foreground hover:bg-[#E1784F] hover:text-white transition-all'
            }`}>
              {isProcessing ? <Loader2 className="animate-spin" size={16} /> : plan.buttonText}
              <ArrowRight size={14} className="opacity-40" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}