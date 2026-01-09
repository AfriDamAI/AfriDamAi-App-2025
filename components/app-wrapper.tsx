"use client"

import { useState, useCallback } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { AuthModals } from "@/components/auth-modals"
import { ProfileSidebar } from "@/components/profile-sidebar"
import type React from "react"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "signin" | "signup" }>({
    isOpen: false,
    type: "signin",
  })
  
  const pathname = usePathname()
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)

  // 🛡️ WORLD-CLASS LOGIC: Identify the Dashboard/Portal environment
  // We only want the big footer on the Landing Page.
  const isLandingPage = pathname === "/";

  const handleSignIn = () => {
    setAuthModal({ isOpen: true, type: "signin" })
  }

  const handleSignUp = () => {
    setAuthModal({ isOpen: true, type: "signup" })
  }

  const handleCloseModal = useCallback(() => {
    setAuthModal((prev) => {
      if (!prev.isOpen) return prev;
      return { ...prev, isOpen: false };
    });
  }, []);

  const handleViewProfile = () => {
    setProfileSidebarOpen(true)
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 🛠️ Glassmorphism Navigation Layer */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-50"
      >
        <Navigation 
          onSignInClick={handleSignIn} 
          onSignUpClick={handleSignUp} 
          onViewProfileClick={handleViewProfile} 
        />
      </motion.header>
      
      {/* 🚀 Dynamic Content Entry */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-grow relative"
      >
        {children}
      </motion.main>
      
      {/* 🎯 THE FIX: Only show the big Footer on the public landing page */}
      {isLandingPage && <Footer onSignUpClick={handleSignUp} />}
      
      {/* 🛡️ World-Class Modals with AnimatePresence */}
      <AnimatePresence mode="wait">
        {authModal.isOpen && (
          <AuthModals 
            isOpen={authModal.isOpen} 
            onClose={handleCloseModal} 
            type={authModal.type} 
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence mode="wait">
        {profileSidebarOpen && (
          <ProfileSidebar 
            isOpen={profileSidebarOpen} 
            onClose={() => setProfileSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}