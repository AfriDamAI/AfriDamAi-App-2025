"use client";

import type React from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import { Moon, Sun, Menu, X, LogOut, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { UserProfile } from "../components/user-profile";
import { useAuth } from "@/providers/auth-provider";
import NotificationDropdown from "./notification-dropdown";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationProps {
  onSignInClick: () => void;
  onSignUpClick: () => void;
  onViewProfileClick: () => void;
}

export default function Navigation({
  onSignInClick,
  onSignUpClick,
  onViewProfileClick,
}: NavigationProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  // 🛡️ RE-ENFORCED: Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [mobileMenuOpen]);

  const navLinks = user 
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/history", label: "My Diary" },
        { href: "/profile", label: "Profile" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/mission", label: "Our Mission" },
        { href: "/marketplace", label: "Care Hub" },
        { href: "/contact", label: "Support" },
      ];

  return (
    <nav className="sticky top-0 z-[60] bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">
          
          {/* 🌍 BRAND LOGO */}
          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <img 
              src="/logo.png" 
              alt="AfriDam AI" 
              className="h-10 md:h-12 w-auto object-contain" 
            />
            <div className="hidden sm:flex flex-col border-l border-border/50 pl-3">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E1784F]">
                Clinical
              </span>
            </div>
          </Link>

          {/* 💻 DESKTOP LINKS */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-[#E1784F] transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* ⚡ ACTION ZONE */}
          <div className="flex items-center gap-3 md:gap-4">
            
            <button
              onClick={toggleTheme}
              className="p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} className="text-[#E1784F]" />}
            </button>

            <NotificationDropdown />

            <div className="hidden md:block">
              <UserProfile
                onSignInClick={onSignInClick}
                onSignUpClick={onSignUpClick}
                onViewProfileClick={onViewProfileClick}
              />
            </div>

            {/* 🍔 MOBILE BURGER: RE-ENFORCED */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 rounded-2xl bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20 active:scale-90 transition-all"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE FULL-SCREEN OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 top-20 z-[70] bg-background flex flex-col p-8 lg:hidden"
          >
            <div className="flex-grow space-y-4">
              <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.4em] mb-8">Menu Navigation</p>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full p-6 rounded-[2rem] bg-card border border-border group active:bg-[#E1784F] transition-all"
                >
                  <span className="text-xl font-black italic uppercase tracking-tighter group-active:text-white">{link.label}</span>
                  <ArrowRight size={20} className="text-[#E1784F] group-active:text-white" />
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-border space-y-4">
              {!user ? (
                <button 
                  onClick={() => { setMobileMenuOpen(false); onSignUpClick(); }}
                  className="w-full py-6 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-xl"
                >
                  Start Journey
                </button>
              ) : (
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false); }}
                  className="w-full py-6 bg-red-500/10 text-red-500 rounded-[2rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3"
                >
                  <LogOut size={16} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}