/**
 * 🛡️ AFRIDAM NEURAL LINK: CONNECTION STATUS
 * Version: 2026.1.2 (Dynamic Integrity Sync)
 * Rule 5: Synced with Socket latency and Prisma Appointment ID.
 */

"use client"

import React from "react"
import { ShieldCheck, Wifi, Lock } from "lucide-react"

interface ConnectionStatusProps {
  latency?: number;
  roomId?: string;
}

export function ConnectionStatus({ latency = 24, roomId = "AFR-SYNC-01" }: ConnectionStatusProps) {
  // 🛰️ Logic to determine signal quality based on latency
  const getSignalStrength = (ms: number) => {
    if (ms < 50) return { label: "Excellent", color: "text-[#4DB6AC]" };
    if (ms < 150) return { label: "Stable", color: "text-yellow-500" };
    return { label: "Degraded", color: "text-red-500" };
  };

  const signal = getSignalStrength(latency);

  return (
    <div className="flex flex-col gap-3">
      {/* 🔐 ENCRYPTION BADGE: Neural Tunnel Verification */}
      <div className="flex items-center gap-3 px-4 py-2 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-xl backdrop-blur-md">
        <ShieldCheck size={14} className="text-[#4DB6AC]" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">
          End-to-End Encrypted
        </span>
      </div>

      {/* 🛰️ SIGNAL STRENGTH: Latency Handshake */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
        <Wifi size={14} className={signal.color} />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">
          Neural Link: <span className="text-white">{signal.label}</span>
        </span>
      </div>

      {/* 🔑 PRIVACY LOCK: Clinical Session ID */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-md">
        <Lock size={14} className="text-[#E1784F]" />
        <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/40">
          Room: <span className="text-white uppercase">{roomId.slice(0, 10)}</span>
        </span>
      </div>
    </div>
  )
}