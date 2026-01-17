"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn, isLoading, requiresOnboarding } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 🛡️ OGA FIX: Absolute silence while the Auth Node is syncing
    if (isLoading) return

    const isPublicPath = pathname === "/" || pathname === "/pricing" || pathname === "/contact"
    const isOnboardingPath = pathname === "/onboarding"

    // 1. GUEST ACCESS: If not signed in and trying to enter protected gates
    if (!isSignedIn && !isPublicPath) {
      router.replace("/")
      return
    }

    // 2. AUTHENTICATED REDIRECT: If signed in and hitting the landing page, send to Dashboard
    if (isSignedIn && pathname === "/") {
      router.replace("/dashboard")
      return
    }

    /** * 🛡️ OPTIONAL: ONBOARDING ENFORCEMENT
     * If you want to force users to finish the survey before seeing the dashboard, 
     * uncomment the logic below. Otherwise, the Dashboard Banner we built is enough.
     */
    /*
    if (isSignedIn && requiresOnboarding && !isOnboardingPath && !isPublicPath) {
       router.replace("/onboarding")
       return
    }
    */

  }, [isSignedIn, isLoading, pathname, router, requiresOnboarding])

  // 🛡️ RE-ENFORCED: Aesthetic Transition State
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1C1A19] flex flex-col items-center justify-center z-[100]">
        <div className="relative flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#E1784F] animate-spin mb-4" />
            <div className="absolute inset-0 w-10 h-10 border-t-2 border-[#E1784F] rounded-full animate-ping opacity-20" />
        </div>
        <p className="text-[#F7F3EE] text-[10px] font-black uppercase tracking-[0.3em] opacity-40 animate-pulse">
          Syncing Neural Node...
        </p>
      </div>
    )
  }

  return <>{children}</>
}