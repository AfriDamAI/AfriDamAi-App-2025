"use client"

import type React from "react"
import Link from "next/link"
import { Heart } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/providers/auth-provider"

interface FooterProps {
  onSignUpClick?: () => void
}

export default function Footer({ onSignUpClick }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const { user } = useAuth()

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    const protectedRoutes = ["/scan", "/ingredients", "/dashboard", "/history"]
    if (protectedRoutes.includes(href) && !user) {
      e.preventDefault()
      if (onSignUpClick) {
        onSignUpClick()
      }
    }
  }

  return (
    <footer className="bg-muted/50 border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-lg text-foreground">AfriDamAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your AI dermatologist for healthy skin. Scan, analyze, and improve.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                       <Link
                  href="/scan"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => handleProtectedClick(e, "/scan")}
                >
                  Skin Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/ingredients"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => handleProtectedClick(e, "/ingredients")}
                >
                  Ingredient Analyzer
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    onClick={(e) => handleProtectedClick(e, "/dashboard")}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                    <Link
                  href="/history"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={(e) => handleProtectedClick(e, "/history")}
                >
                  History
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">© {currentYear} AfriDamAI. All rights reserved.</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              Made with <Heart className="w-4 h-4 text-red-500" /> for healthy skin
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
