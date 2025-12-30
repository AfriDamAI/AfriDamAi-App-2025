"use client"

import HeroSection from "@/components/hero-section"
import FeaturesSection from "@/components/features-section"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"

export default function Home() {
    const { isSignedIn } = useAuth()
    const router = useRouter()

    const handleScanClick = () => {
        if (isSignedIn) {
            router.push("/scan")
        } else {
            router.push("/signup") // Redirect to signup page
        }
    }

    const handleIngredientsClick = () => {
        if (isSignedIn) {
            router.push("/ingredients")
        } else {
            router.push("/register")
        }
    }

    return (
        <>
            <HeroSection onScanClick={handleScanClick} onIngredientsClick={handleIngredientsClick} />
            <FeaturesSection />
        </>
    )
}
