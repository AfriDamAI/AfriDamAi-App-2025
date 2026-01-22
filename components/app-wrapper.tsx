/**
 * 🛡️ AFRIDAM APP WRAPPER (Rule 6 Synergy)
 * Version: 2026.1.10 (Handshake Pruning)
 * Focus: High-Precision Navigation & Removal of Legacy Auth Gate.
 */

"use client"

import { useState, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
// 🚀 RULE 6: Retired AuthModals to favor high-speed page-based auth
import { ProfileSidebar } from "@/components/profile-sidebar"
import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)

  /**
   * 🛡️ VIEWPORT SYNC (Rule 6)
   * We hide the footer on active tool pages to maintain a clean focus.
   */
  const hideFooterRoutes = [
    "/dashboard", 
    "/profile", 
    "/scanner",    
    "/analyzer",   
    "/marketplace",
    "/specialist", 
    "/history"
  ];
  
  const showFooter = !hideFooterRoutes.some(route => pathname.startsWith(route));

  /**
   * 🚀 RULE 6 EXPRESS BYPASS:
   * Navigation triggers now point directly to dedicated pages.
   */
  const handleSignIn = () => router.push("/auth/login");
  const handleSignUp = () => router.push("/auth/register");
  const handleViewProfile = () => setProfileSidebarOpen(true);

  /**
   * 🛡️ ROUTE PROTECTION & CLEANUP
   */
  useEffect(() => {
    setProfileSidebarOpen(false);
    document.body.style.overflow = 'unset';
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background selection:bg-[#E1784F]/20">
      
      {/* 🏛️ 1. NAVIGATION LAYER */}
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
          <Footer onSignUpClick={handleSignUp} />
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