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

  // Keep the shared public navigation available on the primary auth entry pages.
  const showNav =
    !isFullscreenRoute &&
    (!isAuthRoute || pathname === "/login" || pathname === "/register");
  const showFooter = !hideFooterRoutes.some(route => pathname.startsWith(route)) && !isFullscreenRoute;

  // 🧭 SIDEBAR SYNC: Show on all internal protected pages
  const showSidebar = user && !isAuthRoute && !isFullscreenRoute;

  // 🛡️ OGA FIX: Show mobile nav only on internal dashboard-like pages, NOT on public auth pages
  const showMobileNav = user && !isAuthRoute && !isFullscreenRoute;
  const showFloatingScrollNav = !isAuthRoute && !pathname.startsWith("/specialist");

  // 🩹 /specialist sizes itself to the exact remaining viewport (h-[calc(100vh-Npx)])
  // and already reserves its own clearance for the fixed MobileNav internally.
  // Adding main's usual pb-16 on top pushes total page height past 100vh, making the
  // whole page scroll and exposing a blank gap above the nav bar.
  const isFullHeightRoute = pathname.startsWith("/specialist");

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

  // 🩹 min-h-screen (100vh) is the mobile browser's LARGE viewport (chrome hidden) —
  // taller than what's visible when the address bar is showing, which creates phantom
  // scroll room even when content fits. Fine for normal scrolling pages, but /specialist
  // wants zero page-level scroll, so it additionally needs the dynamic viewport unit.
  // Keep min-h-screen too (not a replacement) — if a WebView doesn't understand the
  // dvh unit it drops that whole declaration, and without this fallback the page would
  // collapse to content height instead of filling the screen.
  const screenHeightClass = isFullHeightRoute ? 'min-h-screen min-h-dvh' : 'min-h-screen';

  return (
    <div className={`relative ${screenHeightClass} flex flex-col bg-background selection:bg-[#E1784F]/20`}>
      <div className={`flex flex-col lg:flex-row ${screenHeightClass}`}>
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
          <main className={`flex-grow relative z-10 ${isFullHeightRoute ? 'min-h-0 overflow-hidden' : ''} ${showMobileNav && !isFullHeightRoute ? 'pb-16 lg:pb-0' : ''} ${
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
