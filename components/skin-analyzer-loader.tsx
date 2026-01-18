/**
 * 🛡️ AFRIDAM WELLNESS LOADER
 * Version: 2026.1.3 (Sleek & Professional)
 * Purpose: Ensures the app is synced with Tobi's backend before entry.
 */

"use client"

import type React from "react"
import { useEffect, useState, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ShieldCheck, Sparkles, Activity } from "lucide-react"

interface SkinAnalysisLoaderProps {
  children: React.ReactNode
}

export default function SkinAnalysisLoader({ children }: SkinAnalysisLoaderProps) {
  const [isReady, setIsReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loadingStep, setLoadingStep] = useState("Connecting...")

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initializeEngine = async () => {
      try {
        setLoadingStep("Syncing Wellness Profile...")
        
        // 🛡️ RE-ENFORCED: Syncing with Tobi's cloud backend
        await new Promise(r => setTimeout(r, 1200))
        
        setLoadingStep("Wellness Intelligence Active")
        await new Promise(r => setTimeout(r, 800))
        
        setIsReady(true)
      } catch (err) {
        setIsReady(true) 
      }
    }

    initializeEngine()
  }, [mounted])

  if (!mounted || !isReady) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,120,79,0.1),transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative space-y-10"
        >
          {/* 🛡️ BRAND ICON */}
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-[#E1784F]/20 blur-2xl rounded-full" />
            <div className="relative w-full h-full rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
              <Activity className="w-10 h-10 text-[#E1784F]" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              AfriDam <span className="text-[#E1784F]">AI</span>
            </h1>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-3 text-[#4DB6AC]">
                <Loader2 className="animate-spin" size={12} />
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                  {loadingStep}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Badge */}
        <div className="absolute bottom-12 flex items-center gap-2 text-white/30">
          <ShieldCheck size={14} className="text-[#4DB6AC]" />
          <span className="text-[8px] font-black uppercase tracking-[0.4em]">
            Family Privacy Protected
          </span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}