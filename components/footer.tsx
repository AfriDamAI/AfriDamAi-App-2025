"use client"

import type React from "react"
import Link from "next/link"
import { Heart, ShieldCheck, Instagram, Twitter, Linkedin, Globe, MapPin } from "lucide-react"
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
    const protectedRoutes = ["/ai-scanner", "/ai-checker", "/dashboard", "/history"]
    if (protectedRoutes.includes(href) && !user) {
      e.preventDefault()
      if (onSignUpClick) {
        onSignUpClick()
      }
    }
  }

  return (
    <footer className="bg-background border-t border-border mt-24 transition-colors duration-500 relative overflow-hidden">
      {/* Subtle Background Glow for that Premium Feel */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#E1784F]/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
          
          {/* 1. BRAND COLUMN - 4 Columns Wide */}
          <div className="md:col-span-5 space-y-10">
            <Link href="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="AfriDam AI" 
                className="h-14 w-auto object-contain drop-shadow-sm" 
              />
            </Link>
            <div className="space-y-6 max-w-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] leading-loose text-muted-foreground/80 italic">
                Restoring dignity in dermatology through ethical AI research. Designed for the vibrant diversity of Pan-African skin.
              </p>
              <div className="flex items-center gap-4 text-muted-foreground">
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border">
                    <MapPin size={10} className="text-[#E1784F]" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Lagos, Nigeria</span>
                 </div>
                 <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full border border-border">
                    <Globe size={10} className="text-[#4DB6AC]" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Global Node</span>
                 </div>
              </div>
            </div>
          </div>

          {/* 2. CLINICAL NODE - 2 Columns */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#E1784F] mb-8">Clinical</h3>
            <ul className="space-y-5">
              {[
                { label: "Skin Scanner", href: "/ai-scanner" },
                { label: "Safety Checker", href: "/ai-checker" },
                { label: "The Care Shop", href: "/marketplace" }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#E1784F] transition-all"
                    onClick={(e) => handleProtectedClick(e, link.href)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. SUPPORT HUB - 2 Columns */}
          <div className="md:col-span-2">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-[#4DB6AC] mb-8">Resources</h3>
            <ul className="space-y-5">
              {[
                { label: "Our Mission", href: "/mission" },
                { label: "Care Support", href: "/contact" },
                { label: "Professional", href: "/pricing" }
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#4DB6AC] transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. LEGAL PROTOCOL - 3 Columns */}
          <div className="md:col-span-3">
            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground mb-8">Legal Protocol</h3>
            <ul className="space-y-5">
              <li>
                <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                  Privacy Promise
                </button>
              </li>
              <li>
                <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">
                  Clinical Terms
                </button>
              </li>
              <li className="pt-4 flex gap-4">
                <Instagram size={16} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer" />
                <Twitter size={16} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer" />
                <Linkedin size={16} className="text-muted-foreground hover:text-[#E1784F] cursor-pointer" />
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR - EXTREMELY CLEAN */}
        <div className="border-t border-border pt-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-60">
                © {currentYear} AfriDam AI Clinical Systems
              </p>
              <div className="hidden md:block w-1 h-1 bg-border rounded-full" />
              <p className="text-[8px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-60">
                Secure 256-bit Encryption
              </p>
            </div>
            
            <div className="flex items-center gap-3 px-6 py-2.5 bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-full">
              <ShieldCheck size={12} className="text-[#4DB6AC]" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">
                Restoring Dignity in Care
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}