/**
 * 🛡️ AFRIDAM FOOTER (Rule 6 Synergy)
 * Version: 2026.1.23 (Mobile Accordion UI + Bypass Integration)
 * Focus: High-Precision Navigation & Streamlined Mobile Path Alignment.
 */

"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ShieldCheck, Instagram, Twitter, Linkedin, Facebook, Globe, MapPin, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

// 🔗 SOCIAL LINKS
const socialLinks = [
  { label: "X (Twitter)", href: "https://x.com/Afridam_AI", icon: Twitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/afridamai/", icon: Linkedin },
  { label: "Instagram", href: "https://www.instagram.com/afridam_ai", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61577358013953", icon: Facebook },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { user } = useAuth()
  const router = useRouter()
  
  // 📱 MOBILE STATE: Controls which accordion column is open
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  /**
   * 🚀 RULE 6 EXPRESS BYPASS
   */
  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    const protectedRoutes = ["/ai-scanner", "/ingredient-analyzer", "/dashboard", "/profile"]

    if (protectedRoutes.some(route => href.startsWith(route)) && !user) {
      e.preventDefault()
      router.push("/register") 
    }
  }

  return (
    <footer className="bg-white dark:bg-[#1c1a19] border-t border-border mt-24 transition-colors duration-500 relative isolate overflow-hidden">
      
      {/* Theme-aware brand watermark */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src="/logo.png"
          alt=""
          className="absolute -right-20 top-1/2 h-[30rem] w-[30rem] -translate-y-1/2 object-contain opacity-[0.045] mix-blend-multiply dark:opacity-[0.14] dark:brightness-125 dark:mix-blend-screen md:right-8 md:h-[38rem] md:w-[38rem]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_50%,transparent_8%,rgba(255,255,255,0.6)_72%)] dark:bg-[radial-gradient(circle_at_80%_50%,transparent_8%,rgba(28,26,25,0.45)_72%)]" />
      </div>
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#E1784F]/5 to-transparent pointer-events-none" />

      {/* FOOTER CONTENT */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-20 relative z-10">
        
        {/* Adjusted gap for mobile (gap-6) vs desktop (gap-16) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-16 mb-12 md:mb-20">

          {/* 🌍 1. BRAND COLUMN */}
          <div className="md:col-span-5 space-y-8 mb-4 md:mb-0">
            <Link href="/" className="inline-block active:scale-95 transition-transform">
              <img src="/logo.png" alt="AfriDam AI" className="h-12 md:h-14 w-auto object-contain" />
            </Link>
            <div className="space-y-6 max-w-sm">
              <p className="text-[11px] font-black tracking-[0.2em] leading-loose text-muted-foreground/80 italic">
                Restoring dignity in dermatology through ethical AI research. Optimized for the vibrant diversity of African skin phenotypes.
              </p>
              {/* Tighter, refined location badges */}
              <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/30 rounded-xl border border-border">
                  <MapPin size={10} className="text-[#E1784F]" />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase">Lagos, NG</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4DB6AC]/5 rounded-xl border border-[#4DB6AC]/20">
                  <Globe size={10} className="text-[#4DB6AC]" />
                  <span className="text-[9px] font-black tracking-[0.2em] uppercase text-[#4DB6AC]">African Node</span>
                </div>
              </div>
            </div>
          </div>

          {/* 🧬 2. CLINICAL NODE (Accordion on Mobile) */}
          <div className="md:col-span-2 border-b border-border/40 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('clinical')}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none"
            >
              <h3 className="text-[11px] font-black tracking-[0.5em] text-[#E1784F] uppercase">Clinical</h3>
              <ChevronDown size={16} className={`md:hidden text-[#E1784F] transition-transform duration-300 ${openSection === 'clinical' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${openSection === 'clinical' ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0 md:mt-8'}`}>
              <ul className="space-y-5">
                {[
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
          </div>

          {/* 🏥 3. RESOURCES (Accordion on Mobile) */}
          <div className="md:col-span-2 border-b border-border/40 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('resources')}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none"
            >
              <h3 className="text-[11px] font-black tracking-[0.5em] text-[#4DB6AC] uppercase">Resources</h3>
              <ChevronDown size={16} className={`md:hidden text-[#4DB6AC] transition-transform duration-300 ${openSection === 'resources' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${openSection === 'resources' ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0 md:mt-8'}`}>
              <ul className="space-y-5">
                {[
                  { label: "Our Mission", href: "/mission" },
                  { label: "Care Support", href: "/contact" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-[10px] font-black tracking-widest text-foreground hover:text-[#4DB6AC] transition-all">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ⚖️ 4. LEGAL PROTOCOL (Accordion on Mobile) */}
          <div className="md:col-span-3 border-b border-border/40 md:border-none pb-4 md:pb-0">
            <button 
              onClick={() => toggleSection('protocol')}
              className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none"
            >
              <h3 className="text-[11px] font-black tracking-[0.5em] uppercase">Protocol</h3>
              <ChevronDown size={16} className={`md:hidden transition-transform duration-300 ${openSection === 'protocol' ? 'rotate-180' : ''}`} />
            </button>
            <div className={`overflow-hidden transition-all duration-300 md:max-h-none md:opacity-100 ${openSection === 'protocol' ? 'max-h-48 opacity-100 mt-6' : 'max-h-0 opacity-0 md:mt-8'}`}>
              <ul className="space-y-5">
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
              </ul>
            </div>
          </div>

        </div>

        {/* 🛡️ STREAMLINED BOTTOM BAR */}
        <div className="border-t border-border pt-8 md:pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            
            {/* Social Icons - Always visible at the bottom */}
            <div className="flex items-center gap-6 md:order-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-[#E1784F] cursor-pointer transition-colors"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>

            {/* Copyright & Security */}
            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 md:order-1">
              <p className="text-[8px] font-black tracking-[0.5em] text-muted-foreground opacity-60 uppercase">
                © {currentYear} AfriDam AI • Clinical Systems
              </p>
              <div className="hidden md:block w-1.5 h-1.5 bg-muted rounded-full" />
              <p className="text-[8px] font-black tracking-[0.5em] text-muted-foreground opacity-60 uppercase">
                AES-256 Cloud Encryption
              </p>
            </div>

            {/* Badge */}
            <div className="flex items-center gap-3 px-6 py-2.5 bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[1.5rem] shadow-sm md:order-3">
              <ShieldCheck size={14} className="text-[#4DB6AC]" />
              <span className="text-[9px] font-black tracking-[0.3em] text-[#4DB6AC] uppercase">
                Built for Africa
              </span>
            </div>

          </div>
        </div>
      </div>
    </footer>
  )
}