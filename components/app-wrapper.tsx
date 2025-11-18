"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { AuthModals } from "@/components/auth-modals"
import type React from "react"
import { useParams, usePathname, useRouter } from "next/navigation"
import EcommerceNavigationMenu from "./ecommerce-nav"

export function AppWrapper({ children }: { children: React.ReactNode }) {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; type: "signin" | "signup" }>({
    isOpen: false,
    type: "signin",
  })
  const pathname = usePathname()
    ;

  const handleSignIn = () => {
    setAuthModal({ isOpen: true, type: "signin" })
  }

  const handleSignUp = () => {
    setAuthModal({ isOpen: true, type: "signup" })
  }
  const handleCloseModal = () => {
    setAuthModal({ isOpen: false, type: "signin" })
  }

  return (
    <>
      {(pathname.startsWith("ecommerce") || pathname.includes("/ecommerce")) ? <EcommerceNavigationMenu onSignInClick={handleSignIn} onSignUpClick={handleSignUp} /> : <Navigation onSignInClick={handleSignIn} onSignUpClick={handleSignUp} />}
      {children}
      <Footer onSignUpClick={handleSignUp} />
      <AuthModals isOpen={authModal.isOpen} onClose={handleCloseModal} type={authModal.type} />
    </>
  )
}
