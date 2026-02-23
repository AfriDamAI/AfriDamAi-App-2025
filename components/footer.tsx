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

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">

          {/* 🌍 1. BRAND COLUMN */}
          <div className="md:col-span-5 space-y-10">
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
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-black tracking-[0.5em] text-[#E1784F] mb-8">Clinical</h3>
            <ul className="space-y-5">
              {[
                // 🛡️ OGA FIX: Updated to match your actual folder structure
                { label: "Skin Scanner", href: "/ai-scanner" },
                { label: "Safety Checker", href: "/ingredient-analyzer" },
                { label: "The Care Hub", href: "/marketplace" }
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
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-black tracking-[0.5em] text-[#4DB6AC] mb-8">Resources</h3>
            <ul className="space-y-5">
              {[
                { label: "Our Mission", href: "/mission" },
                { label: "Care Support", href: "/contact" },
                { label: "Expert Hub", href: "/pricing" }
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
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-black tracking-[0.5em] text-muted-foreground mb-8">Protocol</h3>
            <ul className="space-y-5">
              <li>
                <Link href="/privacy" className="text-[10px] font-black tracking-widest text-muted-foreground hover:text-[#E1784F] transition-all">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-[10px] font-black tracking-widest text-muted-foreground hover:text-[#E1784F] transition-all">
                  Clinical Terms
                </Link>
              </li>
              <li className="pt-6 flex gap-6">
                <Instagram size={18} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer transition-colors" />
                <Twitter size={18} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer transition-colors" />
                <Linkedin size={18} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer transition-colors" />
              </li>
            </ul>
          </div>
        </div>

        {/* 🛡️ BOTTOM BAR */}
        <div className="border-t border-border pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <p className="text-[8px] font-black tracking-[0.5em] text-muted-foreground opacity-60">
                © {currentYear} AfriDam AI • Clinical Systems
              </p>
              <div className="hidden md:block w-1.5 h-1.5 bg-muted rounded-full" />
              <p className="text-[8px] font-black tracking-[0.5em] text-muted-foreground opacity-60">
                AES-256 Cloud Encryption
              </p>
            </div>

            <div className="flex items-center gap-3 px-8 py-3 bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[1.5rem] shadow-sm">
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