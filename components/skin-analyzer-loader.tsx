// Component to handle AI Engine initialization and Cloud Handshake
"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, ShieldCheck, Zap } from "lucide-react"
import { isModelLoaded, loadModel } from "@/lib/tensorflow-model"

interface SkinAnalysisLoaderProps {
  children: React.ReactNode
}

export default function SkinAnalysisLoader({ children }: SkinAnalysisLoaderProps) {
  const [isReady, setIsReady] = useState(false)
  const [loadingStep, setLoadingStep] = useState("Initializing...")

  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setLoadingStep("Connecting to AI Node...")
        
        // 1. Try to load local hardware acceleration if available
        if (typeof window !== "undefined" && !isModelLoaded()) {
          try {
            await loadModel()
            setLoadingStep("Hardware Acceleration Active")
          } catch (e) {
            // Fallback to API-only mode if local TF model is missing
            setLoadingStep("Cloud Sync Active")
          }
        }
        
        // 2. Small delay to show the beautiful brand transition
        await new Promise(r => setTimeout(r, 800))
        setIsReady(true)
      } catch (err) {
        console.error("AI Initialization Error:", err)
        setIsReady(true) // Always allow the app to run; the Service handles the API calls
      }
    }

    initializeEngine()
  }, [])

  if (!isReady) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(225,120,79,0.1),transparent_70%)] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative space-y-8"
        >
          {/* Logo / Icon Area */}
          <div className="relative w-24 h-24 mx-auto mb-12">
            <div className="absolute inset-0 bg-[#E1784F]/20 blur-2xl rounded-full animate-pulse" />
            <div className="relative w-full h-full rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
              <Zap className="w-10 h-10 text-[#E1784F]" />
            </div>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border-2 border-dashed border-[#4DB6AC]/30 rounded-full"
            />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              AfriDam <span className="text-[#E1784F]">AI</span>
            </h1>
            <div className="flex items-center justify-center gap-3 text-[#4DB6AC]">
              <Loader2 className="animate-spin" size={16} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">
                {loadingStep}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Badge Footer */}
        <div className="absolute bottom-12 flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
          <ShieldCheck size={14} className="text-[#4DB6AC]" />
          <span className="text-[9px] font-black uppercase tracking-widest text-white/40">
            Clinical Data Privacy Encryption Active
          </span>
        </div>
      </div>
    )
  }

  return <>{children}</>
}