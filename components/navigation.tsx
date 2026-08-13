/**
 * 🛡️ AFRIDAM NAVIGATION
 * Focus: High-Speed Clinical Navigation, Smooth Anchor Scrolling & Mobile Path Sync.
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
  onSignInClick?: () => void;
  onSignUpClick?: () => void;
  onViewProfileClick?: () => void;
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

  // 🌐 Fetch cart data when user is authenticated
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user, fetchCart]);

  // 🔒 Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // ⚡ Auto-close mobile drawer when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSignIn = () => {
    setMobileMenuOpen(false);
    if (onSignInClick) {
      onSignInClick();
    } else {
      router.push("/login");
    }
  };

  const handleSignUp = () => {
    setMobileMenuOpen(false);
    if (onSignUpClick) {
      onSignUpClick();
    } else {
      router.push("/register");
    }
  };

  // 🧭 Public & Authenticated Nav Links
  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/public-scan", label: "AI Scan" },
        { href: "/marketplace", label: "Care Hub" },
        { href: "/contact", label: "Support" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/mission", label: "Our Story" },
        { href: "/#partners", label: "Partners" },
        { href: "/#care-hub", label: "Care Hub" },
        { href: "/#faq", label: "FAQ" },
        { href: "/contact", label: "Support" },
      ];

  const cartItemCount = cart?.items?.length || 0;

  return (
    <>
      <nav className="sticky top-0 z-[100] bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* BRAND LOGO */}
            <Link
              href={user ? "/dashboard" : "/"}
              className="flex items-center gap-3 active:scale-95 transition-transform"
            >
              <img
                src="/logo.png"
                alt="AfriDam AI"
                className="h-9 md:h-11 w-auto object-contain"
              />
              <div className="hidden sm:flex flex-col border-l border-border/50 pl-3">
                <span className="text-xs font-bold uppercase tracking-widest text-[#E1784F]">
                  Clinical
                </span>
              </div>
            </Link>

            {/* DESKTOP NAV LINKS */}
            <div className="hidden lg:flex items-center gap-8 xl:gap-10">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs xl:text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                      isActive
                        ? "text-[#E1784F] font-bold"
                        : "text-muted-foreground hover:text-[#E1784F]"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex items-center gap-3 md:gap-4">
              
              {/* Theme Toggle (Desktop) */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="hidden lg:flex items-center justify-center p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all active:scale-95"
              >
                {isDark ? (
                  <Sun size={16} className="text-[#E1784F]" />
                ) : (
                  <Moon size={16} className="text-foreground" />
                )}
              </button>

              {/* AUTH USER ACTIONS */}
              {user && (
                <>
                  <NotificationDropdown />
                  <Link
                    href="/cart"
                    className="relative p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all active:scale-95"
                    aria-label="View Shopping Cart"
                  >
                    <ShoppingCart size={16} />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#E1784F] text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background animate-in zoom-in-50">
                        {cartItemCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              {/* USER PROFILE / AUTH BUTTONS */}
              <div className="hidden md:block">
                <UserProfile
                  onSignInClick={handleSignIn}
                  onSignUpClick={handleSignUp}
                  onViewProfileClick={onViewProfileClick}
                />
              </div>

              {/* MOBILE HAMBURGER TOGGLE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all active:scale-95"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X size={18} className="text-[#E1784F]" />
                ) : (
                  <Menu size={18} />
                )}
              </button>

            </div>
          </div>
        </div>
      </nav>

      {/* 📱 MOBILE NAVIGATION DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-[200] bg-background flex flex-col lg:hidden overflow-y-auto no-scrollbar"
          >
            {/* Mobile Header */}
            <div className="flex justify-between items-center h-16 md:h-20 px-6 border-b border-border shrink-0">
              <Link
                href={user ? "/dashboard" : "/"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3"
              >
                <img
                  src="/logo.png"
                  alt="AfriDam AI"
                  className="h-9 w-auto object-contain"
                />
                <span className="text-xs font-bold uppercase tracking-widest text-[#E1784F]">
                  Clinical
                </span>
              </Link>

              <div className="flex items-center gap-3">
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all"
                >
                  {isDark ? (
                    <Sun size={16} className="text-[#E1784F]" />
                  ) : (
                    <Moon size={16} />
                  )}
                </button>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-3 rounded-2xl bg-muted/50 hover:bg-muted border border-border transition-all"
                  aria-label="Close menu"
                >
                  <X size={18} className="text-[#E1784F]" />
                </button>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="flex-grow p-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between w-full p-5 rounded-[1.5rem] bg-card border border-border hover:border-[#E1784F]/40 active:scale-[0.99] transition-all"
                >
                  <span className="text-base sm:text-lg font-black italic uppercase tracking-tight">
                    {link.label}
                  </span>
                  <ArrowRight size={18} className="text-[#E1784F]" />
                </Link>
              ))}
            </div>

            {/* Mobile Auth Actions */}
            <div className="p-6 border-t border-border space-y-3 pb-10 shrink-0 bg-muted/20">
              {!user ? (
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={handleSignUp}
                    className="w-full py-4 sm:py-5 bg-[#E1784F] text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest active:scale-[0.97] shadow-lg shadow-[#E1784F]/20 transition-all"
                  >
                    Start Journey
                  </button>
                  <button
                    onClick={handleSignIn}
                    className="w-full py-4 sm:py-5 bg-muted text-foreground border border-border rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest active:scale-[0.97] transition-all"
                  >
                    Login
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onViewProfileClick) onViewProfileClick();
                      else router.push("/profile");
                    }}
                    className="w-full py-4 bg-muted text-foreground border border-border rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
                  >
                    View Account Profile
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      signOut();
                    }}
                    className="w-full py-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 active:scale-[0.97] transition-all"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}