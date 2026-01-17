"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isSignedIn, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 🛡️ OGA FIX: Prevent redirection logic while auth is still initializing
    if (isLoading) return

    const isPublicPath = pathname === "/" || pathname === "/pricing" || pathname === "/contact"

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

  // 🛡️ RE-ENFORCED: Simple loading state during transition
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1C1A19] flex flex-col items-center justify-center z-[100]">
        <Loader2 className="w-8 h-8 text-[#E1784F] animate-spin mb-4" />
        <p className="text-[#F7F3EE] text-[10px] font-black uppercase tracking-[0.2em] opacity-50">
          Loading AfriDam AI...
        </p>
      </div>
    )
  }

  return <>{children}</>
}