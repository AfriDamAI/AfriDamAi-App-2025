/**
 * 🛡️ AFRIDAM WELLNESS LOADER (Rule 6 Synergy)
 * Version: 2026.1.5 (Clean State Handshake)
 * Focus: High-speed clinical transition with zero redundant wait times.
 */

"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, ShieldCheck, Activity } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"

interface SkinAnalysisLoaderProps {
  children: React.ReactNode
}

export default function SkinAnalysisLoader({ children }: SkinAnalysisLoaderProps) {
  const { isLoading: authLoading } = useAuth()
  const [isReady, setIsReady] = useState(false)
  const [loadingStep, setLoadingStep] = useState("Checking access...")

  useEffect(() => {
    // 🛡️ OGA FIX: Remove artificial delays to keep the app snappy.
    // We only wait for the actual Auth system to be ready.
    if (!authLoading) {
      setLoadingStep("Ready")
      setIsReady(true)
    }
  }, [authLoading])

  /**
   * 🚀 RULE 6: PREVENT FLICKER
   * If the auth system is still thinking, we show the branded screen.
   * Once auth is done, we get out of the way immediately.
   */
  if (authLoading || !isReady) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative space-y-8"
        >
          {/* 🛡️ BRAND ICON */}
          <div className="relative w-20 h-20 mx-auto">
            <div className="relative w-full h-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
              <Activity className="w-8 h-8 text-[#E1784F]" />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">
              AfriDam <span className="text-[#E1784F]">AI</span>
            </h1>
            
            <div className="flex items-center justify-center gap-3 text-[#4DB6AC]">
              <Loader2 className="animate-spin" size={12} />
              <p className="text-[8px] font-black uppercase tracking-[0.3em]">
                {loadingStep}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Badge */}
        <div className="absolute bottom-10 flex items-center gap-2 text-white/20">
          <ShieldCheck size={12} />
          <span className="text-[7px] font-black uppercase tracking-[0.4em]">
            Secured for your family
          </span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}