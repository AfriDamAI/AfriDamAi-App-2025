/**
 * 🛡️ AFRIDAM SECURITY GATE: AUTH GUARD
 * Version: 2026.1.2 (Express Bypass Refactor)
 * Focus: Silent Redirection, Zero-Flicker, Rule 8 Theme Compliance.
 */

"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn, isLoading, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 🛡️ OGA FIX: Silent wait to prevent theme/auth flickering
    if (isLoading) return

    const publicPaths = ["/", "/pricing", "/contact", "/mission"]
    const isPublicPath = publicPaths.includes(pathname)

    /**
     * 🚀 EXPRESS BYPASS (Rule 7 & 8): 
     * We have removed the onboarding redirect loop. 
     * The guard now acts as a high-speed clinical proxy.
     */

    // 1. GUEST ACCESS: If trying to access private nodes without session
    if (!isSignedIn && !isPublicPath) {
      router.replace("/")
      return
    }

    // 2. ACTIVE SESSION: If logged in but lingering on landing page
    if (isSignedIn && pathname === "/") {
      router.replace("/dashboard")
      return
    }
  }, [isSignedIn, isLoading, pathname, router])

  /**
   * 🛡️ RULE 8 COMPLIANCE:
   * We return null during loading to prevent 'Theme Shock'.
   * The RootLayout handles the global background texture.
   */
  if (isLoading) return null

  return <>{children}</>
}