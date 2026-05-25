/**
 * 🛡️ AFRIDAM APP WRAPPER (Rule 6 Synergy)
 * Version: 2026.1.13 (Prop Cleanup & Build Fix)
 * Focus: High-Precision Navigation & Removal of Deprecated Prop Chains.
 */

"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { useAuth } from "@/providers/auth-provider"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { FloatingScrollNav } from "@/components/floating-scroll-nav"
import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { AnimatePresence } from "framer-motion"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)

  // 🛡️ Auth routes: clean UI — no nav, no footer, no sidebar
  const authRoutes = ["/login", "/register", "/forgot-password", "/verify-email"];

  const hideFooterRoutes = [
    "/dashboard", "/profile", "/settings", "/ai-scanner", "/ingredient-analyzer", "/appointment",
    "/marketplace", "/specialist", "/history", ...authRoutes
  ];

  const isAuthRoute = authRoutes.includes(pathname);
  const fullscreenRoutes = ["/plans", "/transaction"];
  const isFullscreenRoute = fullscreenRoutes.some(route => pathname.startsWith(route));

  // 🚀 RULE 6: Toggle Nav/Footer visibility based on current clinical node
  const showNav = !isAuthRoute && !isFullscreenRoute;
  const showFooter = !hideFooterRoutes.some(route => pathname.startsWith(route)) && !isFullscreenRoute;

  // 🧭 SIDEBAR SYNC: Show on all internal protected pages
  const showSidebar = user && !isAuthRoute && !isFullscreenRoute;

  // 🛡️ OGA FIX: Show mobile nav only on internal dashboard-like pages, NOT on public auth pages
  const showMobileNav = user && !isAuthRoute && !isFullscreenRoute;
  const showFloatingScrollNav = !isAuthRoute && !pathname.startsWith("/specialist");

  const handleSignIn = () => router.push("/login");
  const handleSignUp = () => router.push("/register");
  const handleViewProfile = () => setProfileSidebarOpen(true);

  useEffect(() => {
    setProfileSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = profileSidebarOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [profileSidebarOpen]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background selection:bg-[#E1784F]/20">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* 🖥️ PC SIDEBAR LAYER */}
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col min-w-0">
          {/* 🏛️ 1. NAVIGATION LAYER */}
          {showNav && (
            <header className="sticky top-0 z-[100]">
              <Navigation
                onSignInClick={handleSignIn}
                onSignUpClick={handleSignUp}
                onViewProfileClick={handleViewProfile}
              />
            </header>
          )}

          {/* 🚀 2. DYNAMIC CONTENT AREA */}
          <main className={`flex-grow relative z-10 ${showMobileNav ? 'pb-24 lg:pb-0' : ''} ${
            isAuthRoute
              ? 'flex items-center justify-center min-h-svh'
              : ''
          }`}>
            {children}
          </main>

          {/* 🎯 3. PUBLIC FOOTER */}
          {showFooter && (
            <div className="relative z-20">
              <Footer />
            </div>
          )}
        </div>
      </div>

      {/* 👤 4. WELLNESS SIDEBAR */}
      <AnimatePresence>
        {profileSidebarOpen && (
          <ProfileSidebar
            isOpen={profileSidebarOpen}
            onClose={() => {
              setProfileSidebarOpen(false);
              document.body.style.overflow = 'unset';
            }}
          />
        )}
      </AnimatePresence>

      {/* 📱 5. BOTTOM MOBILE NAV */}
      {showMobileNav && <MobileNav />}
      {showFloatingScrollNav && <FloatingScrollNav hasMobileNav={Boolean(showMobileNav)} />}
    </div >
  )
}
