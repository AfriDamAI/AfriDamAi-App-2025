"use client"

import React from "react"
import { motion } from "framer-motion"
import { 
  Check, 
  ArrowRight,
  Clock,
  Heart,
  UserCheck,
  Sparkles,
  Zap,
  Loader2
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
    pro: "Dermatologist",
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
    pro: "Specialist",
    color: "#C55A32",
    billing: "/mo"
  }
];

interface PricingTableProps {
  onUpgrade?: (plan: string, amount: number) => void;
  isProcessing?: boolean;
}

export function PricingTable({ onUpgrade, isProcessing }: PricingTableProps) {
  return (
    <div className="w-full space-y-12">
      
      {/* 🏥 URGENT CARE BANNER - WIRED TO PAYMENTS */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative group overflow-hidden bg-[#1C1A19] border border-white/5 rounded-[2.5rem] p-8 md:p-10 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/20 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left flex-col md:flex-row">
            <div className="w-14 h-14 bg-[#E1784F] rounded-2xl flex items-center justify-center shadow-lg shrink-0">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <div className="space-y-1">
              <h3 className="text-2xl md:text-3xl font-black italic uppercase text-white leading-none tracking-tighter">Urgent Specialist Session</h3>
              <p className="text-[#4DB6AC] font-black text-[9px] uppercase tracking-[0.3em] flex items-center justify-center md:justify-start gap-2">
                <Clock size={12} /> Instant Connection • Skip the wait
              </p>
            </div>
          </div>
          <div className="flex items-center gap-8 flex-col md:flex-row">
            <div className="text-center md:text-right">
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">One-time Chat</p>
              <p className="text-4xl font-black text-white italic tracking-tighter leading-none">$15</p>
            </div>
            <button 
              disabled={isProcessing}
              onClick={() => onUpgrade?.("Urgent Session", 15)}
              className="px-10 py-5 bg-white text-[#1C1A19] font-black rounded-2xl hover:bg-[#E1784F] hover:text-white transition-all shadow-xl uppercase tracking-widest text-[10px] flex items-center gap-3 active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? <Loader2 className="animate-spin" size={16} /> : "Start Now"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {/* 💎 4-TIER SUBSCRIPTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PLANS.map((plan, i) => (
          <div 
            key={i}
            className={`relative p-8 rounded-[3rem] border transition-all flex flex-col justify-between group overflow-hidden ${
              plan.highlight 
                ? 'bg-card border-[#E1784F] shadow-2xl scale-[1.02] z-10' 
                : 'bg-card/40 border-border hover:border-[#E1784F]/30 shadow-sm'
            }`}
          >
            <div className="absolute top-0 left-0 w-full h-1 opacity-[0.15]" style={{ backgroundColor: plan.color }} />

            <div className="space-y-8 text-left">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] opacity-60">
                  {plan.tagline}
                </span>
                <h4 className="text-3xl font-black italic uppercase text-foreground leading-none">{plan.name}</h4>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black text-foreground italic tracking-tighter">{plan.price}</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  {plan.billing}
                </span>
              </div>

              <p className="text-[11px] font-bold text-muted-foreground leading-relaxed">{plan.description}</p>
              
              <div className="py-4 px-5 bg-muted/50 rounded-2xl border border-border flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-background border border-border text-[#E1784F]">
                   {plan.name === "Free" ? <Sparkles size={14}/> : <UserCheck size={14}/>}
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase tracking-widest opacity-40">Expert Access</p>
                  <p className="text-[10px] font-black italic text-foreground uppercase">{plan.pro}</p>
                </div>
              </div>

              <ul className="space-y-3">
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-0.5 w-4 h-4 rounded-full bg-[#4DB6AC]/10 flex items-center justify-center shrink-0">
                      <Check className="text-[#4DB6AC]" size={10} strokeWidth={4} />
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground leading-tight">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              disabled={isProcessing}
              onClick={() => {
                if(plan.rawPrice > 0) onUpgrade?.(plan.name, plan.rawPrice)
              }}
              className={`w-full mt-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[9px] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${
              plan.highlight 
                ? 'bg-[#E1784F] text-white hover:brightness-110 shadow-lg shadow-[#E1784F]/20' 
                : 'bg-muted text-foreground hover:bg-[#E1784F] hover:text-white transition-all'
            }`}>
              {isProcessing ? <Loader2 className="animate-spin" size={14} /> : plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}