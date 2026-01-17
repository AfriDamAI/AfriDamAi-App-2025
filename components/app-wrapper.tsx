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
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "signin" | "signup" }>({
    isOpen: false,
    type: "signin",
  })
  
  const pathname = usePathname()
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false)

  // 🛡️ RE-ENFORCED: Strategic Footer Logic
  // Hide footer only inside the "App/Portal" environment to keep it clean
  const hideFooterRoutes = ["/dashboard", "/profile", "/ai-scanner", "/ai-checker"];
  const showFooter = !hideFooterRoutes.some(route => pathname.startsWith(route));

  const handleSignIn = () => {
    setAuthModal({ isOpen: true, type: "signin" })
  }

  const handleSignUp = () => {
    setAuthModal({ isOpen: true, type: "signup" })
  }

  const handleCloseModal = useCallback(() => {
    setAuthModal({ isOpen: false, type: "signin" });
  }, []);

  const handleViewProfile = () => {
    setProfileSidebarOpen(true)
  }

  // 🛡️ RE-ENFORCED: Reset scroll lock if path changes while menu is open
  useEffect(() => {
    setProfileSidebarOpen(false);
    setAuthModal(prev => ({ ...prev, isOpen: false }));
    document.body.style.overflow = 'unset';
  }, [pathname]);

  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      
      {/* 🏛️ 1. HEADER LAYER: Clinical Navigation */}
      <motion.header 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="sticky top-0 z-[100]"
      >
        <Navigation 
          onSignInClick={handleSignIn} 
          onSignUpClick={handleSignUp} 
          onViewProfileClick={handleViewProfile} 
        />
      </motion.header>
      
      {/* 🚀 2. MAIN CONTENT AREA */}
      <main className="flex-grow relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* 🎯 3. FOOTER: Public Only */}
      {showFooter && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Footer onSignUpClick={handleSignUp} />
        </motion.div>
      )}
      
      {/* 🛡️ 4. GLOBAL AUTH MODALS */}
      <AnimatePresence>
        {authModal.isOpen && (
          <AuthModals 
            onClose={handleCloseModal} 
            type={authModal.type} 
          />
        )}
      </AnimatePresence>
      
      {/* 👤 5. PROFILE SIDEBAR */}
      <AnimatePresence>
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