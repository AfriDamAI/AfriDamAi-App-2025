"use client";

import type React from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";
import { Moon, Sun, Menu, X, Bell, LogOut } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { UserProfile } from "../components/user-profile";
import { useAuth } from "@/providers/auth-provider";
import NotificationDropdown from "./notification-dropdown";

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
  const notificationRef = useRef<HTMLDivElement>(null);

  // UPDATED: Removed "About" (404) and added "Mission"
  // Also, we can filter these so "Home" and "Mission" only show when logged out
  const navLinks = user 
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/history", label: "History" },
      ]
    : [
        { href: "/", label: "Home" },
        { href: "/mission", label: "Our Mission" }, // New Page Link
        { href: "/contact", label: "Support" },
      ];

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    const protectedRoutes = ["/dashboard", "/history"];
    if (protectedRoutes.includes(href) && !user) {
      e.preventDefault();
      onSignUpClick();
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> {/* Increased height for logo */}
          
          {/* LOGO: REPLACED "A" BOX WITH REAL LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src="/logo.png" 
              alt="AfriDam AI" 
              className="h-12 w-auto object-contain drop-shadow-[0_0_10px_rgba(225,120,79,0.2)]" 
            />
            <div className="hidden sm:flex flex-col border-l border-border pl-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]">
                Clinical
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-[#E1784F] transition-colors"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-4 relative" ref={notificationRef}>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-all"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-foreground" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500" />
              )}
            </button>

            {/* reminder/Notifications */}
            <NotificationDropdown />

            <div className="h-8 w-[1px] bg-border mx-2 hidden sm:block" />

            <UserProfile
              onSignInClick={onSignInClick}
              onSignUpClick={onSignUpClick}
              onViewProfileClick={onViewProfileClick}
            />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background py-6 px-4 space-y-4 shadow-2xl animate-in slide-in-from-top-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-6 py-4 rounded-2xl bg-muted/30 text-[10px] font-black uppercase tracking-widest text-foreground hover:bg-[#E1784F] hover:text-white transition-all"
                  onClick={() => {
                    setMobileMenuOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-6 py-4 rounded-2xl bg-red-500/10 text-red-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-3"
                >
                  <LogOut size={16} />
                  <span>Terminate Session</span>
                </button>
              )}
          </div>
        )}
      </div>
    </nav>
  );
}