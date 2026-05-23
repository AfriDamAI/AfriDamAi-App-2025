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
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const isDark = theme === "dark";

  // 🌐 Public pages: hamburger is only needed here (dashboard has sidebar instead)
  const publicPages = ["/", "/mission", "/contact", "/pricing", "/public-scan"];
  const isPublicPage = publicPages.includes(pathname);



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
      { href: "/dashboard", label: "Dashboard" },
      { href: "/marketplace", label: "Care Hub" },
      { href: "/ai-scanner", label: "AI Scanner" },
      { href: "/history", label: "Clinical Diary" },
      { href: "/profile", label: "Profile" },
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
    <>
      <nav className="sticky top-0 z-[100] bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">

            <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform">
            <img src="/logo.png" alt="AfriDam AI" className="h-9 md:h-11 w-auto object-contain" />
              <div className="hidden sm:flex flex-col border-l border-border/50 pl-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E1784F]">Clinical</span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-xs lg:text-sm font-semibold uppercase tracking-wider text-muted-foreground hover:text-[#E1784F] transition-colors duration-200">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3 md:gap-4">

              {/* ☀️ Theme Toggle */}
              <button onClick={toggleTheme} className="p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border">
                {isDark ? <Sun size={16} className="text-[#E1784F]" /> : <Moon size={16} />}
              </button>


              {/* 📱 MOBILE HAMBURGER TOGGLE — public pages only */}
              {isPublicPage && (
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all"
                  aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                >
                  {mobileMenuOpen ? <X size={16} className="text-[#E1784F]" /> : <Menu size={16} />}
                </button>
              )}



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
                  onSignInClick={handleSignIn}
                  onSignUpClick={handleSignUp}
                  onViewProfileClick={onViewProfileClick}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE MENU — rendered outside <nav> to avoid transform containment issues */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed inset-0 z-[200] bg-background flex flex-col lg:hidden overflow-y-auto no-scrollbar"
          >
          {/* Mobile Menu Header */}
            <div className="flex justify-between items-center h-16 px-6 border-b border-border shrink-0">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3">
                <img src="/logo.png" alt="AfriDam AI" className="h-9 w-auto object-contain" />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all"
                aria-label="Close menu"
              >
                <X size={16} className="text-[#E1784F]" />
              </button>
            </div>

            {/* Mobile Menu Links */}
            <div className="flex-grow p-6 space-y-3">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between w-full p-5 rounded-[1.5rem] bg-card border border-border hover:border-[#E1784F]/30 transition-all">
                  <span className="text-lg font-black italic uppercase tracking-tighter">{link.label}</span>
                  <ArrowRight size={18} className="text-[#E1784F]" />
                </Link>
              ))}
            </div>

            {/* Mobile Menu Auth Actions */}
            <div className="p-6 border-t border-border space-y-3 pb-10 shrink-0">
              {!user ? (
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={handleSignUp} className="w-full py-5 bg-[#E1784F] text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest active:scale-[0.97] transition-transform">
                    Start Journey
                  </button>
                  <button onClick={handleSignIn} className="w-full py-5 bg-muted text-foreground rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest active:scale-[0.97] transition-transform">
                    Login
                  </button>
                </div>
              ) : (
                <button onClick={() => { setMobileMenuOpen(false); signOut(); }} className="w-full py-5 bg-red-500/10 text-red-500 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 active:scale-[0.97] transition-transform">
                  <LogOut size={16} /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}