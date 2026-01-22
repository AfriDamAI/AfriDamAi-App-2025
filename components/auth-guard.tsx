/**
 * 🛡️ AFRIDAM SECURITY GATE: AUTH GUARD
 * Version: 2026.1.10 (Zero-Flicker & Express Bypass)
 * Focus: High-speed clinical proxy with instant redirection.
 */

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

  const publicPaths = ["/", "/pricing", "/contact", "/mission"]
  const isPublicPath = publicPaths.includes(pathname)

  useEffect(() => {
    if (isLoading) return

    // 1. GUEST ACCESS: Kick out unauthenticated users from private routes
    if (!isSignedIn && !isPublicPath) {
      router.replace("/")
      return
    }

    // 2. ACTIVE SESSION: Auto-forward logged-in users to the Hub
    if (isSignedIn && pathname === "/") {
      router.replace("/dashboard")
      return
    }
  }, [isSignedIn, isLoading, pathname, router])

  /**
   * 🛡️ THE SYNERGY GATE:
   * During loading or while the redirect is pending, we return null.
   * This prevents the "Landing Page Flash" that you were likely seeing.
   */
  if (isLoading || (isSignedIn && pathname === "/")) {
    return null 
  }

  // Prevent rendering private content if not signed in
  if (!isSignedIn && !isPublicPath) {
    return null
  }

  return <>{children}</>
}