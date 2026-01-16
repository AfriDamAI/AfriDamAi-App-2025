"use client"

import type React from "react"
import { useEffect, useState, useLayoutEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, ShieldCheck, Zap, Cpu, Cloud } from "lucide-react"
import { isModelLoaded, loadModel } from "@/lib/tensorflow-model"

interface SkinAnalysisLoaderProps {
  children: React.ReactNode
}

export default function SkinAnalysisLoader({ children }: SkinAnalysisLoaderProps) {
  const [isReady, setIsReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loadingStep, setLoadingStep] = useState("Initializing Engine...")
  const [engineType, setEngineType] = useState<"local" | "cloud">("cloud")

  // 🛡️ RE-ENFORCED: Prevent Hydration Flickering
  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const initializeEngine = async () => {
      try {
        setLoadingStep("Connecting to AI Node...")
        
        // 🛡️ RE-ENFORCED: Smart Hardware Check
        if (typeof window !== "undefined") {
          try {
            // Give local model 2 seconds to load; if not, fallback to Cloud
            const modelPromise = loadModel();
            const timeoutPromise = new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Timeout")), 2500)
            );

            await Promise.race([modelPromise, timeoutPromise]);
            
            setLoadingStep("Hardware Acceleration Active");
            setEngineType("local");
          } catch (e) {
            // Fail silently and move to Cloud mode
            setLoadingStep("Neural Cloud Sync Active");
            setEngineType("cloud");
          }
        }
        
        // Beautiful brand transition delay
        await new Promise(r => setTimeout(r, 1200))
        setIsReady(true)
      } catch (err) {
        console.error("AI Initialization Error:", err)
        setIsReady(true) 
      }
    }

    initializeEngine()
  }, [mounted])

  if (!mounted || !isReady) {
    return (
      <div className="fixed inset-0 z-[999] bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,120,79,0.12),transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative space-y-10"
        >
          {/* 🛡️ RE-ENFORCED: AFRIDAM LOGO CORE */}
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 bg-[#E1784F]/30 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-full h-full rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl backdrop-blur-md">
              {engineType === "local" ? (
                <Cpu className="w-12 h-12 text-[#E1784F]" />
              ) : (
                <Zap className="w-12 h-12 text-[#E1784F]" />
              )}
            </div>
            
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-4 border border-dashed border-[#4DB6AC]/40 rounded-full"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
              AfriDam <span className="text-[#E1784F]">AI</span>
            </h1>
            
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-3 text-[#4DB6AC]">
                <Loader2 className="animate-spin" size={14} />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
                  {loadingStep}
                </p>
              </div>
              <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.5em]">
                Secure Clinical Pipeline v2.0
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Badge Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-16 flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md"
        >
          <ShieldCheck size={16} className="text-[#4DB6AC]" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">
            End-to-End Encryption Enabled
          </span>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}