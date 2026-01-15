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
    const protectedRoutes = ["/scan", "/ingredients"]
    const isProtected = protectedRoutes.some((route) => href.startsWith(route))

    if (isProtected && !user) {
      e.preventDefault()
      if (onAuthRequired) {
        onAuthRequired()
      }
    }
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  )
}
