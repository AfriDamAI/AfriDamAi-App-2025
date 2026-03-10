/**
 * 🛡️ AFRIDAM SECURITY GATE: AUTH GUARD (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: High-speed proxy with loop-prevention and onboarding bypass.
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

  // 🚀 PATH SYNC: These are the exact paths allowed without a token.
  const publicPaths = ["/", "/pricing", "/contact", "/mission", "/login", "/register", "/forgot-password", "/reset-password", "/privacy-policy"]
  const isPublicPath = publicPaths.includes(pathname)
  
  // 🔐 AUTH PATHS: Pages that should be hidden from logged-in users.
  const isAuthPage = pathname === "/login" || pathname === "/register"

  useEffect(() => {
    // 🔍 OGA DIAGNOSTIC
    // console.log("🛡️ GUARD_CHECK:", { pathname, isSignedIn, isLoading });

    if (isLoading) return

    // 🚩 THE FIX: Only redirect if we are CERTAIN.
    
    // 1. GUEST GATE: If NOT signed in and trying to hit a PRIVATE page (like /dashboard)
    if (!isSignedIn && !isPublicPath) {
      console.log("🚫 Access Blocked: Redirecting to Landing");
      router.replace("/login") // Move to login instead of root to avoid home loops
      return
    }

    // 2. AUTH BYPASS: If IS signed in and trying to hit /login or /register
    if (isSignedIn && isAuthPage) {
      console.log("✅ Already In: Redirecting to Dashboard");
      router.replace("/dashboard")
      return
    }
    
  }, [isSignedIn, isLoading, pathname, router, isPublicPath, isAuthPage])

  /**
   * 🛡️ THE GHOST PREVENTER
   * If it's a private page and we aren't signed in, show nothing while we redirect.
   * If it's an auth page and we ARE signed in, show nothing while we redirect.
   */
  if (isLoading) return null

  if (!isSignedIn && !isPublicPath) return null
  if (isSignedIn && isAuthPage) return null

  return <>{children}</>
}