/**
 * 🛡️ AFRIDAM SECURITY GATE: AUTH GUARD (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: High-speed proxy with onboarding bypass.
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

  /** * 🚀 ROUTE GROUP SYNC: 
   * (auth) is invisible in the URL. These match your actual browser paths.
   */
  const publicPaths = ["/", "/pricing", "/contact", "/mission", "/login", "/register", "/forgot-password"]
  const isPublicPath = publicPaths.includes(pathname)
  const isAuthPath = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    // 🔍 OGA DEBUG: Helps Tobi see exactly what's happening in the console
    console.log("GUARD STATUS:", { pathname, isSignedIn, isPublicPath });

    if (isLoading) return

    // 1. GUEST PROTECT: Kick guests out of private zones (Scanner, Shop, etc.)
    if (!isSignedIn && !isPublicPath) {
      router.replace("/")
      return
    }

    // 2. AUTH BYPASS: Send logged-in users away from Login/Landing to the Dashboard
    if (isSignedIn && (pathname === "/" || isAuthPath)) {
      router.replace("/dashboard")
      return
    }
    
    // 🛡️ OGA NOTE: Onboarding check removed to prevent user frustration loops.
    
  }, [isSignedIn, isLoading, pathname, router, isPublicPath, isAuthPath])

  /**
   * 🛡️ THE FLICKER PREVENTER:
   * Returns nothing while the Guard is deciding where to send the user.
   */
  if (isLoading) return null;

  // Prevent seeing the Landing or Login page for a split second if already signed in
  if (isSignedIn && (pathname === "/" || isAuthPath)) {
    return null 
  }

  // Prevent seeing private content for a split second if not signed in
  if (!isSignedIn && !isPublicPath) {
    return null
  }

  return <>{children}</>
}