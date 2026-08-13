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

  // 🚀 PATH SYNC: These are the base paths allowed without a token.
  // Use startsWith for non-root paths to tolerate trailing slashes and nested routes.
  const publicPaths = ["/", "/pricing", "/contact", "/mission", "/login", "/register", "/forgot-password", "/reset-password", "/privacy-policy", "/terms", "/verify-email", "/public-scan"]
  const isPublicPath = publicPaths.some((p) => {
    if (p === "/") return pathname === "/"
    return pathname.startsWith(p)
  })

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
   * 🛡️ RENDER GATE — ZERO FLASH STRATEGY
   *
   * Public paths (/, /mission, /contact, etc.) render IMMEDIATELY — no waiting.
   * Auth pages (/login, /register) block ONLY when signed-in (we're about to redirect).
   * Private pages block ONLY when definitely not signed in (we're about to redirect).
   * 
   * We NEVER return null while isLoading on public paths — that causes blank flash.
   */

  // 1. Public page (not an auth page) → render immediately, no gate needed
  if (isPublicPath && !isAuthPage) return <>{children}</>

  // 2. Still checking auth for auth/private pages → pass through (redirect fires in useEffect)
  if (isLoading) return <>{children}</>

  // 3. Private page, definitely not signed in → blank while redirect fires
  if (!isSignedIn && !isPublicPath) return null

  // 4. Auth page (/login, /register), definitely signed in → blank while redirect fires
  if (isSignedIn && isAuthPage) return null

  return <>{children}</>
}