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
    // 🛡️ OGA FIX: Prevent redirection logic while auth is still initializing
    if (isLoading) return

    const isPublicPath = pathname === "/" || pathname === "/pricing" || pathname === "/contact"
    const isOnboardingPath = pathname === "/onboarding"

    // 1. If not signed in and trying to access private dashboard area
    if (!isSignedIn && !isPublicPath) {
      router.push("/")
      return
    }

    // 2. If signed in but onboarding is incomplete, force them to survey
    if (isSignedIn && requiresOnboarding && !isOnboardingPath) {
      router.push("/onboarding")
      return
    }

    // 3. If signed in and onboarding is complete, don't let them go back to survey
    if (isSignedIn && !requiresOnboarding && isOnboardingPath) {
      router.push("/dashboard")
      return
    }
  }, [isSignedIn, isLoading, requiresOnboarding, pathname, router])

  // 🛡️ RE-ENFORCED: Sophisticated Loading State for the Dark Theme
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1C1A19] flex flex-col items-center justify-center z-[100]">
        <Loader2 className="w-10 h-10 text-[#E1784F] animate-spin mb-4" />
        <p className="text-[#F7F3EE] text-[10px] font-black uppercase tracking-[0.3em] opacity-50">
          Syncing AfriDam Node...
        </p>
      </div>
    )
  }

  return <>{children}</>
}