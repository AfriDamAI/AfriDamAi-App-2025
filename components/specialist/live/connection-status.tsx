/**
 * 🛡️ AFRIDAM SPECIALIST: CONNECTION STATUS
 * Version: 2026.1.3 (Human-First & Socket Sync)
 * Rule 5: Synced with Socket latency and Session identifiers.
 */

"use client"

import React from "react"
import { ShieldCheck, Wifi, Lock } from "lucide-react"

interface ConnectionStatusProps {
  latency?: number;
  roomId?: string;
}

export function ConnectionStatus({ latency = 24, roomId = "AFR-SYNC-01" }: ConnectionStatusProps) {
  // 🛰️ Logic to determine connection quality based on latency
  const getSignalStrength = (ms: number) => {
    if (ms < 50) return { label: "Excellent", color: "text-[#4DB6AC]" };
    if (ms < 150) return { label: "Stable", color: "text-yellow-500" };
    return { label: "Weak", color: "text-red-500" };
  };

  const signal = getSignalStrength(latency);

  return (
    <div className="flex flex-col gap-2 md:gap-3">
      {/* 🔐 ENCRYPTION BADGE */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-xl backdrop-blur-md">
        <ShieldCheck size={14} className="text-[#4DB6AC]" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">
          Secure & Private
        </span>
      </div>

      {/* 🛰️ CONNECTION STRENGTH */}
      <div className="flex items-center gap-3 px-4 py-2 bg-black/20 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl backdrop-blur-md">
        <Wifi size={14} className={signal.color} />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
          Connection: <span className="text-black dark:text-white">{signal.label}</span>
        </span>
      </div>

      {/* 🔑 SESSION ID */}
      <div className="flex items-center gap-3 px-4 py-2 bg-black/20 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl backdrop-blur-md">
        <Lock size={14} className="text-[#E1784F]" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40">
          Session: <span className="text-black dark:text-white uppercase">{roomId.slice(0, 10)}</span>
        </span>
      </div>
    </div>
  )
}