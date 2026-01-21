/**
 * 🛡️ AFRIDAM APP WRAPPER (Rule 7 Sync)
 * Version: 2026.1.2 (Viewport & Route Management)
 * Focus: High-Precision Navigation & Seamless Overlay Transitions.
 */

"use client"

import { useState, useCallback, useEffect } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { AuthModals } from "@/components/auth-modals"
import { ProfileSidebar } from "@/components/profile-sidebar"
import type React from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "signin" | "signup" }>({
    isOpen: false,
    type: "signin",
  })
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)

  /**
   * 🛡️ VIEWPORT SYNC (Rule 7)
   * We hide the footer on active tool pages to maintain a clean focus.
   * Synced with: Neural Lens (/scanner) and Ingredient Audit (/analyzer).
   */
  const hideFooterRoutes = [
    "/dashboard", 
    "/profile", 
    "/scanner",    // 🚀 Updated: Matches Neural Lens route
    "/analyzer",   // 🚀 Updated: Matches Molecular Audit route
    "/marketplace",
    "/specialist", // 🚀 Updated: Specialist Chat should be full-screen
    "/history"
  ];
  
  const showFooter = !hideFooterRoutes.some(route => pathname.startsWith(route));

  const handleSignIn = () => setAuthModal({ isOpen: true, type: "signin" });
  const handleSignUp = () => setAuthModal({ isOpen: true, type: "signup" });
  const handleViewProfile = () => setProfileSidebarOpen(true);

  const handleCloseModal = useCallback(() => {
    setAuthModal(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = 'unset'; 
  }, []);

  /**
   * 🛡️ ROUTE PROTECTION & CLEANUP
   * Resets scroll and closes overlays whenever the user navigates.
   */
  useEffect(() => {
    setProfileSidebarOpen(false);
    setAuthModal(prev => ({ ...prev, isOpen: false }));
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
      
      {/* 🛡️ 4. ACCESS MODALS */}
      <AnimatePresence>
        {authModal.isOpen && (
          <AuthModals 
            isOpen={authModal.isOpen}
            onClose={handleCloseModal} 
            type={authModal.type} 
          />
        )}
      </AnimatePresence>
      
      {/* 👤 5. WELLNESS SIDEBAR */}
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