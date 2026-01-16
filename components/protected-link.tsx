"use client"

import type React from "react"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"
import type { ReactNode } from "react"

interface ProtectedLinkProps {
  href: string
  children: ReactNode
  className?: string
  onAuthRequired?: () => void
}

export function ProtectedLink({ href, children, className, onAuthRequired }: ProtectedLinkProps) {
  const { user } = useAuth()

  const handleClick = (e: React.MouseEvent) => {
    // 🛡️ RE-ENFORCED: Comprehensive list of clinical & private routes
    const protectedRoutes = [
      "/ai-scanner", 
      "/ai-checker", 
      "/dashboard", 
      "/marketplace/cart", 
      "/profile",
      "/appointments",
      "/history"
    ]

    const isProtected = protectedRoutes.some((route) => href.startsWith(route))

    if (isProtected && !user) {
      // Stop the navigation
      e.preventDefault()
      
      // 🛡️ RE-ENFORCED: Trigger the Auth Modal so the user isn't confused
      if (onAuthRequired) {
        onAuthRequired()
      } else {
        // Fallback: If no specific handler is passed, we alert the system
        console.warn(`Access Denied to ${href}: Authentication Required.`)
        // In the layout, this should trigger the global Sign-In modal
        const event = new CustomEvent('trigger-auth-modal', { detail: { type: 'signup' } });
        window.dispatchEvent(event);
      }
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}