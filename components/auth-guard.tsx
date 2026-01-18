"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 🛡️ OGA FIX: Silent wait while checking session
    if (isLoading) return

    const isPublicPath = pathname === "/" || pathname === "/pricing" || pathname === "/contact"

    /**
     * 🚀 EMERGENCY LAUNCH FIX: 
     * We are stripping the 'requiresOnboarding' check here to prevent the redirect loop.
     * The guard now only cares if you are logged in or not.
     */

    // 1. If NOT signed in and trying to access private dashboard area -> Go Home
    if (!isSignedIn && !isPublicPath) {
      router.replace("/")
      return
    }

    // 2. If SIGNED IN and on the landing page -> Go straight to Dashboard
    if (isSignedIn && pathname === "/") {
      router.replace("/dashboard")
      return
    }
  }, [isSignedIn, isLoading, pathname, router])

  // 🛡️ RE-ENFORCED: Keep it simple. No distracting loaders or technical text.
  if (isLoading) return null

  return <>{children}</>
}