"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { OnboardingSurvey } from "@/components/onboarding-survey"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function OnboardingPage() {
  const { user, isLoading, requiresOnboarding, refreshUser } = useAuth()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      // 1. If no user, go home.
      if (!user) {
        router.push("/")
        return
      }

      // 2. 🛡️ THE ANTI-BOOM GUARD: 
      // If the user has ALREADY finished, send them to dashboard.
      if (!requiresOnboarding && !isRedirecting) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, requiresOnboarding, router, isRedirecting])

  /**
   * 🚀 OGA FIX: Robust Completion Logic
   * We ensure the state is fully synchronized before moving Nathan.
   */
  const handleSurveySuccess = async () => {
    setIsRedirecting(true);
    try {
      // 1. Sync the AuthProvider state with the database
      await refreshUser();
      
      // 2. 🛡️ NUCLEAR SYNC: 
      // Using window.location.replace instead of router.push for the final jump
      // ensures the dashboard starts with a fresh, clean state—killing the loop forever.
      window.location.replace("/dashboard");
    } catch (err) {
      console.error("Redirect Sync Failed:", err);
      window.location.replace("/dashboard");
    }
  }

  // Cinematic Loading State
  if (isLoading || !user || isRedirecting) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-20 h-20 bg-[#E1784F] rounded-[2.5rem] flex items-center justify-center font-black text-5xl text-white shadow-[0_0_60px_rgba(225,120,79,0.3)]"
        >A</motion.div>
        <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.6em] animate-pulse">
          Synchronizing Clinical Profile
        </p>
      </div>
    )
  }

  // Only render if needed
  if (!requiresOnboarding) return null;

  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center p-6 md:p-10">
      {/* --- WORLD CLASS AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(77,182,172,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-5xl"
      >
         <OnboardingSurvey onComplete={handleSurveySuccess} />
      </motion.div>

      {/* Subtle Brand Watermark */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center opacity-10 pointer-events-none">
        <img src="/logo.png" alt="AfriDam AI" className="h-5 w-auto grayscale" />
      </div>
    </main>
  )
}