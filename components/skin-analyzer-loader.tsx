/**
 * 🛡️ AFRIDAM WELLNESS LOADER (Rule 7 Sync)
 * Version: 2026.1.4 (Handshake & State Alignment)
 * Focus: Synchronizing Auth State before UI visibility.
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
  const [loadingStep, setLoadingStep] = useState("Initializing...")

  useEffect(() => {
    const synchronizeSystems = async () => {
      // 🛡️ THE HANDSHAKE SYNC (Rule 7)
      // We wait for the Auth Provider to finish checking the JWT
      if (!authLoading) {
        setLoadingStep("Syncing Wellness Profile...")
        
        // Artificial delay for cinematic ambiance and database stability
        await new Promise(r => setTimeout(r, 800))
        
        setLoadingStep("Wellness Intelligence Active")
        await new Promise(r => setTimeout(r, 500))
        
        setIsReady(true)
      }
    };

    synchronizeSystems();
  }, [authLoading])

  /**
   * 🚀 RULE 7: PREVENT HYDRATION ERRORS
   * We return the loader until the Auth state is 100% determined.
   */
  if (authLoading || !isReady) {
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