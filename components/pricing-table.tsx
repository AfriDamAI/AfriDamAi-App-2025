/**
 * 🛡️ AFRIDAM PRICING ARCHITECTURE (Rule 6 Synergy)
 * Version: 2026.1.22 (Handshake & Soft Tone Alignment)
 * Focus: High-Precision Transaction Triggers & Relatable English.
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  Check, ArrowRight, Clock, Sparkles,
  Zap, Loader2, UserCircle, ShieldCheck, Video
} from "lucide-react"

const PLANS = [
  {
    name: "Free",
    tagline: "The Helper",
    price: "₦0",
    rawPrice: 0,
    description: "Start your journey and help our AI learn how to care for others.",
    features: ["Daily Skin Checks", "Simple Reports", "Community Access", "Ingredient Check"],
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
    price: "₦3",
    rawPrice: 3,
    description: "Your first month of expert care at a special entry price.",
    features: ["Everything in Free", "Chat with Specialist", "30-Day Full Access", "Routine Analysis"],
    buttonText: "Try for ₦3",
    highlight: false,
    pro: "Skin Specialist",
    icon: UserCircle,
    color: "#E1784F",
    billing: " once"
  },
  {
    name: "Standard",
    tagline: "The Essential",
    price: "₦10",
    rawPrice: 10,
    description: "Complete care for your daily radiant skin journey.",
    features: ["Everything in Starter", "Personal Specialist", "Voice Note Support", "Custom Routines"],
    buttonText: "Choose Standard",
    highlight: true,
    pro: "Personal Expert",
    icon: ShieldCheck,
    color: "#E1784F",
    billing: "/mo"
  },
  {
    name: "Premium",
    tagline: "Full Support",
    price: "₦20",
    rawPrice: 20,
    description: "Expert medical care for serious skin concerns.",
    features: ["Everything in Standard", "Video Call with Expert", "Digital Prescriptions", "Priority Support"],
    buttonText: "Get Premium",
    highlight: false,
    pro: "Senior Specialist",
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
    <div className="w-full space-y-10 text-left">

      {/* ⚡ URGENT CARE BANNER */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative group overflow-hidden bg-[#0F0F0F] border border-[#E1784F]/20 rounded-[3rem] p-8 md:p-12 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/10 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 bg-[#E1784F] rounded-[1.2rem] flex items-center justify-center shadow-xl shrink-0">
              <Zap className="w-6 h-6 text-white fill-current" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white leading-none tracking-tighter">Urgent Specialist Help</h3>
              <p className="text-[#4DB6AC] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
                <Clock size={12} /> Fast Response • No Waiting
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8 flex-col md:flex-row w-full lg:w-auto">
            <div className="text-center md:text-right">
              <p className="text-white/30 text-[8px] font-black uppercase tracking-[0.4em] mb-1">Expert Credit</p>
              <p className="text-4xl font-black text-white italic tracking-tighter leading-none">₦15</p>
            </div>
            <button
              disabled={isProcessing}
              onClick={() => onUpgrade?.("URGENT_CONSULTATION", 15)}
              className="w-full md:w-auto px-10 h-16 bg-white text-black font-black rounded-2xl hover:bg-[#E1784F] hover:text-white transition-all shadow-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={16} /> : "Pay ₦15 now"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 🏛️ SUBSCRIPTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
        {PLANS.map((plan, i) => (
          <div
            key={i}
            className={`relative p-8 rounded-[2.8rem] border transition-all flex flex-col justify-between group ${plan.highlight
                ? 'bg-card border-[#E1784F] shadow-2xl z-10'
                : 'bg-card/30 border-border hover:border-[#E1784F]/20'
              }`}
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">
                  {plan.tagline}
                </span>
                <h4 className="text-3xl font-black italic uppercase text-foreground leading-none tracking-tighter">{plan.name}</h4>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-foreground italic tracking-tighter">{plan.price}</span>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest opacity-40">
                  {plan.billing}
                </span>
              </div>

              <p className="text-[10px] font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">{plan.description}</p>

              <div className="py-4 px-5 bg-muted/20 rounded-[1.5rem] border border-border flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-background border border-border text-[#E1784F]">
                  <plan.icon size={16} />
                </div>
                <div>
                  <p className="text-[7px] font-black uppercase tracking-widest opacity-30">Care Level</p>
                  <p className="text-[9px] font-black italic text-foreground uppercase tracking-tighter">{plan.pro}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-[#4DB6AC]/10 flex items-center justify-center shrink-0">
                      <Check className="text-[#4DB6AC]" size={10} strokeWidth={4} />
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground leading-tight uppercase tracking-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              disabled={isProcessing}
              onClick={() => {
                if (plan.rawPrice === 0) {
                  router.push("/dashboard");
                } else {
                  onUpgrade?.(plan.name.toUpperCase(), plan.rawPrice);
                }
              }}
              className={`w-full mt-10 h-16 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${plan.highlight
                  ? 'bg-[#E1784F] text-white shadow-lg shadow-[#E1784F]/20'
                  : 'bg-muted text-foreground hover:bg-[#E1784F] hover:text-white'
                }`}>
              {isProcessing ? <Loader2 className="animate-spin" size={14} /> : plan.buttonText}
              <ArrowRight size={14} className="opacity-30" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}