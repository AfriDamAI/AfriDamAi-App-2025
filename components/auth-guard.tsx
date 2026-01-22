/**
 * 🛡️ AFRIDAM SECURITY GATE: AUTH GUARD (Rule 6 Synergy)
 * Version: 2026.1.13 (Route Group Alignment)
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
   * Removing '/auth' because (auth) is a Route Group and invisible in the URL.
   */
  const publicPaths = ["/", "/pricing", "/contact", "/mission", "/login", "/register", "/forgot-password"]
  const isPublicPath = publicPaths.includes(pathname)

  useEffect(() => {
    // 🔍 OGA CHECK: This will confirm the path in your browser console
    console.log("GUARD CHECK:", { pathname, isPublicPath, isSignedIn });

    if (isLoading) return

    // 1. GUEST ACCESS: Kick out unauthenticated users from private routes
    if (!isSignedIn && !isPublicPath) {
      router.replace("/")
      return
    }

    /**
     * 🛡️ SYNERGY UPGRADE:
     * Forward logged-in users away from auth pages to the Hub.
     */
    const authPaths = ["/login", "/register"]
    if (isSignedIn && (pathname === "/" || authPaths.includes(pathname))) {
      router.replace("/dashboard")
      return
    }
  }, [isSignedIn, isLoading, pathname, router, isPublicPath])

  /**
   * 🛡️ THE SYNERGY GATE:
   * Prevents flickering during the Express Bypass redirect.
   */
  const isAuthPath = pathname === "/login" || pathname === "/register";
  if (isLoading || (isSignedIn && (pathname === "/" || isAuthPath))) {
    return null 
  }

  if (!isSignedIn && !isPublicPath) {
    return null
  }

  return <>{children}</>
}