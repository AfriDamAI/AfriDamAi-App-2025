"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { OnboardingSurvey } from "@/components/onboarding-survey"
import { motion } from "framer-motion"

export default function OnboardingPage() {
  // 🛡️ OGA FIX: Added 'requiresOnboarding' to handle the gatekeeping
  const { user, isLoading, requiresOnboarding, refreshUser } = useAuth()
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
      // If requiresOnboarding is FALSE, it means they are done.
      if (!requiresOnboarding) {
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, requiresOnboarding, router])

  // Handle the completion of the survey
  const handleSurveySuccess = async () => {
    // 1. Refresh the user data from the backend to get the new 'onboardingCompleted: true' status
    await refreshUser();
    // 2. Only THEN go to the dashboard
    router.push("/dashboard");
  }

  // Loading state
  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-[#E1784F] rounded-[2rem] flex items-center justify-center font-black text-white shadow-[0_0_50px_rgba(225,120,79,0.2)]"
        >A</motion.div>
      </div>
    )
  }

  // 🛡️ Only render the survey if the user actually needs it
  if (!requiresOnboarding) return null;

  return (
    <main className="min-h-screen bg-[#0A0A0A] relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl">
         <OnboardingSurvey onComplete={handleSurveySuccess} />
      </div>

      <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-10 pointer-events-none">
        <img src="/logo.png" alt="AfriDam AI" className="h-4 w-auto grayscale" />
      </div>
    </main>
  )
}