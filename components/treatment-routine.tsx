"use client"

import { getTreatmentRoutine } from "@/lib/treatment-data"
import { Clock, Droplets, Sun, Moon } from 'lucide-react'
import { motion } from "framer-motion"

export function TreatmentRoutine() {
  const routine = getTreatmentRoutine()

  return (
    <div className="space-y-10 text-left">
      {/* ☀️ MORNING ROUTINE */}
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-3">
          <Sun className="text-[#E1784F]" size={18} />
          <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground italic">Morning Protocol</h4>
        </div>
        <div className="space-y-3">
          {routine.morning.map((step, idx) => (
            <div key={idx} className="flex gap-4 p-5 bg-card border border-border rounded-2xl hover:border-[#E1784F]/30 transition-all shadow-sm">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#E1784F]/10 border border-[#E1784F]/20">
                  <span className="text-sm font-black italic text-[#E1784F]">{idx + 1}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-black uppercase italic tracking-tight text-foreground">{step.name}</p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-[#4DB6AC] uppercase tracking-widest">
                  <Clock size={12} />
                  {step.duration}
                </div>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🌙 EVENING ROUTINE */}
      <div>
        <div className="flex items-center gap-3 mb-6 border-b border-border pb-3">
          <Moon className="text-[#4DB6AC]" size={18} />
          <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground italic">Evening Protocol</h4>
        </div>
        <div className="space-y-3">
          {routine.evening.map((step, idx) => (
            <div key={idx} className="flex gap-4 p-5 bg-card border border-border rounded-2xl hover:border-[#4DB6AC]/30 transition-all shadow-sm">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-[#4DB6AC]/10 border border-[#4DB6AC]/20">
                  <span className="text-sm font-black italic text-[#4DB6AC]">{idx + 1}</span>
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-sm font-black uppercase italic tracking-tight text-foreground">{step.name}</p>
                <div className="flex items-center gap-2 text-[9px] font-bold text-[#4DB6AC] uppercase tracking-widest">
                  <Clock size={12} />
                  {step.duration}
                </div>
                <p className="text-[11px] font-medium text-muted-foreground leading-relaxed mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🧴 RECOMMENDED PRODUCTS */}
      <div className="pt-6">
        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 flex items-center gap-3">
          <Droplets className="w-4 h-4 text-[#E1784F]" />
          Clinical Product Match
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {routine.products.map((product, idx) => (
            <div key={idx} className="p-5 bg-muted/40 border border-border rounded-2xl flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-black uppercase italic text-foreground tracking-tight">{product.name}</p>
                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-2 leading-relaxed">{product.benefit}</p>
              </div>
              <button className="mt-4 text-[8px] font-black uppercase tracking-[0.2em] text-[#E1784F] flex items-center gap-2">
                View in Care Shop <ArrowRight size={10} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}