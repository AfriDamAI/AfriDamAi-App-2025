"use client"

import React from "react"

interface HealthIndicatorProps {
  label: string
  value: string
  color?: "teal" | "orange" | "red" | "muted"
}

export function HealthIndicator({ label, value, color = "teal" }: HealthIndicatorProps) {
  // 🛡️ RE-ENFORCED: Aligned with AfriDam Brand Palette
  const colors = {
    teal: "bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]",
    orange: "bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]",
    red: "bg-red-500/10 border-red-500/20 text-red-500",
    muted: "bg-white/5 border-white/10 text-white/40",
  }

  return (
    <div className={`p-5 rounded-[1.5rem] border transition-all hover:scale-[1.02] ${colors[color]}`}>
      <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60 mb-1">
        {label}
      </p>
      <p className="text-xl font-black italic uppercase tracking-tighter">
        {value}
      </p>
    </div>
  )
}