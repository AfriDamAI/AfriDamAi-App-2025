/**
 * 🛡️ AFRIDAM CLINICAL ACCESS: ONBOARDING BYPASS
 * Rule 7: Onboarding loop scrapped at the Prisma and Auth level.
 * This page now serves as a high-speed redirect to the Dashboard.
 */

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      /**
       * 🚀 THE FINAL BYPASS (Rule 6: No Stress)
       * Since we scrapped onboardingCompleted from the Database, 
       * we no longer wait for a survey. We push to Dashboard immediately.
       */
      if (user) {
        // Use replace to ensure they can't 'Go Back' into the loop
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    }
  }, [user, isLoading, router])

  // Cinematic "One-Way" Transition State
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1], 
          rotate: [0, 5, -5, 0],
          opacity: [0.5, 1, 0.5] 
        }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-20 h-20 bg-[#E1784F] rounded-[2.5rem] flex items-center justify-center font-black text-5xl text-white shadow-[0_0_60px_rgba(225,120,79,0.3)]"
      >
        A
      </motion.div>
      <div className="space-y-2 text-center">
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">
          Entering Clinical Hub
        </p>
        <p className="text-white/10 text-[8px] font-medium uppercase tracking-widest">
          Redirecting to your secure space...
        </p>
      </div>
      
      {/* Background Ambiance to match the Dashboard */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,120,79,0.03),transparent_70%)] pointer-events-none" />
    </div>
  )
}