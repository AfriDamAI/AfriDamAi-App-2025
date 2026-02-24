/**
 * 🛡️ AFRIDAM NAVIGATION (Rule 6 Synergy)
 * Version: 2026.1.22 (Route Alignment)
 * Focus: High-Speed Clinical Navigation & Mobile Path Sync.
 */

"use client";

import type React from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import { Moon, Sun, Menu, X, LogOut, ArrowRight, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";
import { UserProfile } from "./user-profile";
import { useAuth } from "@/providers/auth-provider";
import { useCart } from "@/hooks/use-cart";
import NotificationDropdown from "./notification-dropdown";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation"; // 🚀 Added for Rule 6

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
  const { cart, fetchCart } = useCart();
  const router = useRouter(); // 🚀 Added
  const isDark = theme === "dark";



  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user, fetchCart]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  /**
   * 🚀 RULE 6 REDIRECTORS
   * These bypass the props and go straight to the clinical auth nodes.
   */
  const handleSignIn = () => {
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const handleSignUp = () => {
    setMobileMenuOpen(false);
    router.push("/register");
  };

  const navLinks = user
    ? [
      // { href: "/dashboard", label: "Dashboard" },
      // { href: "/marketplace", label: "Care Hub" },
      // { href: "/profile", label: "Profile" },
      // { href: "/cart", label: "Cart" },
    ]
    : [
      { href: "/", label: "Home" },
      { href: "/mission", label: "Our Story" },
      { href: "/marketplace", label: "Care Hub" },
      { href: "/contact", label: "Support" },
    ];

  const cartItemCount = cart?.items.length || 0;

  return (
    <nav className="sticky top-0 z-[100] bg-background/80 backdrop-blur-xl border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="flex justify-between items-center h-20 md:h-24">

          <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <img src="/logo.png" alt="AfriDam AI" className="h-10 md:h-12 w-auto object-contain" />
            <div className="hidden sm:flex flex-col border-l border-border/50 pl-3">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Clinical</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-[#E1784F] transition-all">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={toggleTheme} className="p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all">
              {isDark ? <Sun size={16} className="text-[#E1784F]" /> : <Moon size={16} />}
            </button>

            {user && (
              <>
                <NotificationDropdown />
                <Link href="/cart" className="relative p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all">
                  <ShoppingCart size={16} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </>
            )}


            <div className="hidden md:block">
              <UserProfile
                onSignInClick={handleSignIn} // 🚀 Rule 6 Updated
                onSignUpClick={handleSignUp} // 🚀 Rule 6 Updated
                onViewProfileClick={onViewProfileClick}
              />
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 top-20 z-[90] bg-background flex flex-col p-8 lg:hidden overflow-y-auto no-scrollbar"
          >
            <div className="flex-grow space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between w-full p-6 rounded-[2rem] bg-card border border-border hover:border-[#E1784F]/30 transition-all">
                  <span className="text-xl font-black italic uppercase tracking-tighter">{link.label}</span>
                  <ArrowRight size={20} className="text-[#E1784F]" />
                </Link>
              ))}
            </div>

            <div className="pt-8 border-t border-border space-y-4 pb-10">
              {!user ? (
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={handleSignUp} className="w-full py-6 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest">
                    Start Journey
                  </button>
                  <button onClick={handleSignIn} className="w-full py-6 bg-muted text-foreground rounded-[2rem] font-black uppercase text-[11px] tracking-widest">
                    Login
                  </button>
                </div>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); signOut(); }} className="w-full py-6 bg-red-500/10 text-red-500 rounded-[2rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3">
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