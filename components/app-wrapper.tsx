/**
 * 🛡️ AFRIDAM APP WRAPPER (Rule 6 Synergy)
 * Version: 2026.1.13 (Prop Cleanup & Build Fix)
 * Focus: High-Precision Navigation & Removal of Deprecated Prop Chains.
 */

"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { ProfileSidebar } from "@/components/profile-sidebar"
import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)

  // 🛡️ OGA FIX: Define routes that need a completely clean UI
  const authRoutes = ["/login", "/register", "/forgot-password"];
  
  const hideFooterRoutes = [
    "/dashboard", "/profile", "/scanner", "/analyzer", 
    "/marketplace", "/specialist", "/history", ...authRoutes
  ];
  
  // 🚀 RULE 6: Toggle Nav/Footer visibility based on current clinical node
  const showNav = !authRoutes.includes(pathname);
  const showFooter = !hideFooterRoutes.some(route => pathname.startsWith(route));

  const handleSignIn = () => router.push("/login");
  const handleSignUp = () => router.push("/register");
  const handleViewProfile = () => setProfileSidebarOpen(true);

  useEffect(() => {
    setProfileSidebarOpen(false);
    document.body.style.overflow = 'unset';
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background selection:bg-[#E1784F]/20">
      
      {/* 🏛️ 1. NAVIGATION LAYER */}
      {showNav && (
        <motion.header 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-[100]"
        >
          <Navigation 
            onSignInClick={handleSignIn} 
            onSignUpClick={handleSignUp} 
            onViewProfileClick={handleViewProfile} 
          />
        </motion.header>
      )}
      
      {/* 🚀 2. DYNAMIC CONTENT AREA */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* 🎯 3. PUBLIC FOOTER */}
      {showFooter && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-20">
          {/* 🚀 RULE 6 FIX: Removed onSignUpClick to resolve ts(2322) */}
          <Footer /> 
        </motion.div>
      )}
      
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
    </div>
  )
}