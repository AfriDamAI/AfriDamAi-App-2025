"use client"

import { useState } from "react"
import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function Home() {
  const { isSignedIn } = useAuth()
  const router = useRouter()
  const [showSignUpModal, setShowSignUpModal] = useState(false)

  const handleScanClick = () => {
    if (isSignedIn) {
      router.push("/scan")
    } else {
      setShowSignUpModal(true)
    }
  }

  const handleIngredientsClick = () => {
    if (isSignedIn) {
      router.push("/ingredients")
    } else {
      setShowSignUpModal(true)
    }
  }

  return (
    <>
      <HeroSection onScanClick={handleScanClick} onIngredientsClick={handleIngredientsClick} />
      <FeaturesSection />
    </>
  )
}
