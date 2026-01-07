"use client"

import type React from "react"
import Link from "next/link"
import { Heart, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

interface FooterProps {
  onSignUpClick?: () => void
}

export default function Footer({ onSignUpClick }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const { user } = useAuth()
  const router = useRouter()

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    // UPDATED: Standardized route paths
    const protectedRoutes = ["/ai-scanner", "/ai-checker", "/dashboard", "/history"]
    if (protectedRoutes.includes(href) && !user) {
      e.preventDefault()
      if (onSignUpClick) {
        onSignUpClick()
      }
    }
  }

  return (
    <footer className="bg-card border-t border-border mt-12 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* 1. BRAND COLUMN - LOGO INTEGRATION */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/logo.png" 
                alt="AfriDam AI" 
                className="h-12 w-auto object-contain" 
              />
            </Link>
            <p className="text-[10px] font-black uppercase tracking-widest leading-loose text-muted-foreground">
              Ethical AI research and development for Pan-African skin health. Based in Lagos, Nigeria.
            </p>
          </div>

          {/* 2. CLINICAL NODE */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E1784F] mb-6">Clinical Node</h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/ai-scanner"
                  className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#E1784F] transition-colors"
                  onClick={(e) => handleProtectedClick(e, "/ai-scanner")}
                >
                  Skin Scanner
                </Link>
              </li>
              <li>
                <Link
                  href="/ai-checker"
                  className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#E1784F] transition-colors"
                  onClick={(e) => handleProtectedClick(e, "/ai-checker")}
                >
                  Ingredient Checker
                </Link>
              </li>
              <li>
                <Link
                  href="/marketplace"
                  className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#E1784F] transition-colors"
                >
                  Marketplace
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. SUPPORT HUB */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] mb-6">Support Hub</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/mission" className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#4DB6AC] transition-colors">
                  Our Mission
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#4DB6AC] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#4DB6AC] transition-colors">
                  User Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. LEGAL PROTOCOL */}
          <div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6">Legal Protocol</h3>
            <ul className="space-y-4">
              <li>
                <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Protocol
                </button>
              </li>
              <li>
                <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                  Clinical Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="border-t border-border pt-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground">
              © {currentYear} AfriDam AI Clinical Systems. All Rights Reserved.
            </p>
            <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">
              <ShieldCheck size={12} /> RESTORING DIGNITY IN CARE
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}