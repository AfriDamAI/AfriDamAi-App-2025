"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { OnboardingSurvey } from "@/components/onboarding/onboarding-survey"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // 🛡️ SECURITY GUARD: 
    // 1. If we aren't loading and there's no user, they shouldn't be here.
    if (!isLoading && !user) {
      router.push("/")
      return
    }

    // 2. If the user ALREADY completed onboarding, don't let them do it again.
    // This respects the 'onboardingCompleted' flag we built into your Dashboard.
    if (user?.profile?.onboardingCompleted) {
      router.push("/dashboard")
    }
  }, [user, isLoading, router])

  // Loading state with the "A" logo pulse
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#1C1A19] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-[#E1784F] rounded-[2rem] flex items-center justify-center font-black text-white shadow-2xl"
        >A</motion.div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#1C1A19] relative overflow-hidden flex items-center justify-center">
      {/* 🌿 PREMIUM AESTHETIC GLOWS */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(77,182,172,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      {/* --- THE ONBOARDING COMPONENT --- */}
      <div className="relative z-10 w-full">
         <OnboardingSurvey onComplete={() => router.push("/dashboard")} />
      </div>

      {/* SUBTLE BRANDING */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-20 pointer-events-none">
        <img src="/logo.png" alt="AfriDam AI" className="h-4 w-auto grayscale" />
      </div>
    </main>
  )
}