/**
 * 🛡️ AFRIDAM FOOTER (Rule 6 Synergy)
 * Version: 2026.1.22 (Bypass Integration)
 * Focus: High-Precision Navigation & Path Alignment.
 */

"use client"

import type React from "react"
import Link from "next/link"
import { ShieldCheck, Instagram, Twitter, Linkedin, Globe, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { user } = useAuth()
  const router = useRouter()

  /**
   * 🚀 RULE 6 EXPRESS BYPASS:
   * Instead of opening a modal, we push the user to the /register page
   * if they try to access a tool while logged out.
   */
  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    // 🛡️ OGA FIX: Updated paths to match /ai-scanner and /analyzer folders
    const protectedRoutes = ["/ai-scanner", "/ingredient-analyzer", "/dashboard", "/profile"]

    if (protectedRoutes.some(route => href.startsWith(route)) && !user) {
      e.preventDefault()
      router.push("/register") // 🚀 Direct Bypass
    }
  }

  return (
    <footer className="bg-background border-t border-border mt-24 transition-colors duration-500 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#E1784F]/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 mb-16">

          {/* 🌍 1. BRAND COLUMN */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-8 md:space-y-10">
            <Link href="/" className="inline-block active:scale-95 transition-transform">
              <img src="/logo.png" alt="AfriDam AI" className="h-14 w-auto object-contain" />
            </Link>
            <div className="space-y-6 max-w-sm">
              <p className="text-[11px] font-black tracking-[0.2em] leading-loose text-muted-foreground/80 italic">
                Restoring dignity in dermatology through ethical AI research. Optimized for the vibrant diversity of African skin phenotypes.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-2xl border border-border">
                  <MapPin size={10} className="text-[#E1784F]" />
                  <span className="text-[8px] font-black tracking-[0.3em]">Lagos, Nigeria</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#4DB6AC]/5 rounded-2xl border border-[#4DB6AC]/20">
                  <Globe size={10} className="text-[#4DB6AC]" />
                  <span className="text-[8px] font-black tracking-[0.3em] text-[#4DB6AC]">African Node</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🧬 2. CLINICAL NODE */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="text-[11px] font-black tracking-[0.5em] text-[#E1784F] mb-6">Clinical</h3>
            <ul className="space-y-5">
              {[
                // 🛡️ OGA FIX: Updated to match your actual folder structure
                { label: "Skin Scanner", href: "/ai-scanner" },
                { label: "Safety Checker", href: "/ingredient-analyzer" },
                { label: "The Care Hub", href: "/contact" }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[10px] font-black tracking-widest text-foreground hover:text-[#E1784F] transition-all"
                    onClick={(e) => handleProtectedClick(e, link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 🏥 3. RESOURCES */}
          <div className="sm:col-span-1 lg:col-span-2">
            <h3 className="text-[11px] font-black tracking-[0.5em] text-[#4DB6AC] mb-6">Resources</h3>
            <ul className="space-y-5">
              {[
                { label: "Our Mission", href: "/mission" },
                { label: "Care Support", href: "/contact" }
                // 🗑️ REMOVED: "Expert Hub" (was linked to /pricing) — removed per task request
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[10px] font-black tracking-widest text-foreground hover:text-[#4DB6AC] transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ⚖️ 4. LEGAL PROTOCOL */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="text-[11px] font-black tracking-[0.5em] mb-6">Protocol</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/privacy-policy" className="text-[10px] font-black tracking-widest hover:text-[#E1784F] transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[10px] font-black tracking-widest hover:text-[#E1784F] transition-all">
                  Terms & Conditions
                </Link>
              </li>
              <li className="pt-4 flex gap-5">
                <Instagram size={18} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer transition-colors" />
                <Twitter size={18} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer transition-colors" />
                <Linkedin size={18} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer transition-colors" />
              </li>
            </ul>
          </div>
        </div>

        {/* 🛡️ BOTTOM BAR */}
        <div className="border-t border-border pt-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:justify-between lg:items-center text-center lg:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 lg:gap-6">
              <p className="text-[9px] font-black tracking-[0.4em] text-muted-foreground opacity-70">
                © {currentYear} AfriDam AI • Clinical Systems
              </p>
              <div className="hidden sm:block w-1.5 h-1.5 bg-muted rounded-full" />
              <p className="text-[9px] font-black tracking-[0.4em] text-muted-foreground opacity-70">
                AES-256 Cloud Encryption
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 px-5 py-3 bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[1.5rem] shadow-sm">
              <ShieldCheck size={14} className="text-[#4DB6AC]" />
              <span className="text-[9px] font-black tracking-[0.3em] text-[#4DB6AC]">
                Built for Africa
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}