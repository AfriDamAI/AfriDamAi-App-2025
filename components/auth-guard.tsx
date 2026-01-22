/**
 * 🛡️ AFRIDAM SECURITY GATE: AUTH GUARD (Rule 6 Synergy)
 * Version: 2026.1.11 (Express Bypass Recovery)
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

  /** * 🚀 RULE 6 FIX: 
   * Whitelisting the /auth/ directory so users can actually reach the Login/Register pages.
   */
  const publicPaths = ["/", "/pricing", "/contact", "/mission", "/auth/login", "/auth/register"]
  const isPublicPath = publicPaths.includes(pathname)

  useEffect(() => {
    if (isLoading) return

    // 1. GUEST ACCESS: Kick out unauthenticated users from private routes
    if (!isSignedIn && !isPublicPath) {
      router.replace("/")
      return
    }

    /**
     * 🛡️ SYNERGY UPGRADE:
     * If already logged in, don't let them go back to Login/Register pages either.
     * Forward them straight to the Hub.
     */
    if (isSignedIn && (pathname === "/" || pathname.startsWith("/auth"))) {
      router.replace("/dashboard")
      return
    }
  }, [isSignedIn, isLoading, pathname, router, isPublicPath])

  /**
   * 🛡️ THE SYNERGY GATE:
   * Prevents flickering during the Express Bypass redirect.
   */
  if (isLoading || (isSignedIn && (pathname === "/" || pathname.startsWith("/auth")))) {
    return null 
  }

  if (!isSignedIn && !isPublicPath) {
    return null
  }

  return <>{children}</>
}