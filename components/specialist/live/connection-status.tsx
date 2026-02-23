"use client"

import React from "react"
import { ShieldCheck, Wifi, Lock } from "lucide-react"

/**
 * 🛡️ AFRIDAM SPECIALIST: CONNECTION STATUS (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Mobile-First Scannability & Specialist Trust.
 */

interface ConnectionStatusProps {
  latency?: number;
  roomId?: string;
}

export function ConnectionStatus({ latency = 24, roomId = "AFR-SYNC" }: ConnectionStatusProps) {
  
  // 🛰️ Logic to determine signal quality in plain English
  const getSignalStatus = (ms: number) => {
    if (ms < 100) return { label: "Excellent", color: "text-[#4DB6AC]" };
    if (ms < 250) return { label: "Stable", color: "text-yellow-500" };
    return { label: "Checking...", color: "text-red-500" };
  };

  const status = getSignalStatus(latency);

  return (
    <div className="flex flex-col gap-2 md:gap-3 text-left">
      
      {/* 🔐 PRIVATE LINK BADGE */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-xl backdrop-blur-md">
        <ShieldCheck size={12} className="text-[#4DB6AC]" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">
          Private Session
        </span>
      </div>

      {/* 🛰️ SIGNAL QUALITY */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-black/20 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl backdrop-blur-md">
        <Wifi size={12} className={status.color} />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
          Signal: <span className="text-black dark:text-white">{status.label}</span>
        </span>
      </div>

      {/* 🔑 SECURE ID */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-black/20 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl backdrop-blur-md">
        <Lock size={12} className="text-[#E1784F]" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
          ID: <span className="text-black dark:text-white uppercase">{roomId.slice(0, 8)}</span>
        </span>
      </div>
    </div>
  )
}