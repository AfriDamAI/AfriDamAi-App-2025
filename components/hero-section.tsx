"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"

// ----------------------------------------------------------------
// NOTE: I've renamed the default export to a more generic name (e.g., HomePageContent)
// to reflect that it now includes the Hero, Mission, and Platform sections.
// ----------------------------------------------------------------
interface HeroSectionProps {
  onScanClick: () => void
  onIngredientsClick: () => void
}

export default function HomePageContent({ onScanClick, onIngredientsClick }: HeroSectionProps) {
  return (
    <div className="bg-background">
      {/* 1. Hero Section (Your Original Content) */}
      <section className="relative overflow-hidden bg-background py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                AI That Understands African Skin
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed text-balance">
                Scan your skin instantly, detect potential issues, and analyze cosmetic ingredients powered by AfriDam AI —
                secure, accurate, and dermatologist-approved.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Button
                size="lg"
                onClick={onScanClick}
                className="bg-orange-600 hover:bg-orange-700 text-white w-full sm:w-auto"
              >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Start Skin Scan
                  </Button>
                      <Button
                size="lg"
                variant="outline"
                onClick={onIngredientsClick}
                className="w-full sm:w-auto bg-transparent"
              >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Analyze Ingredients
                  </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative h-96 md:h-full">
              {/* NOTE: You need to define the 'width' and 'height' props for the Next.js Image component */}
              <Image
                src="/hero-image.jpg"
                alt="Woman with healthy skin"
                layout="fill"
                objectFit="cover"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Mission Section - Added based on request */}
      <section id="mission" className="py-20 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="font-bold text-sm uppercase tracking-widest text-orange-600">Our Mission</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4">Addressing the Core Challenges in African Skincare</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Problem 1: Lack of Access */}
            <div className="bg-card p-8 rounded-2xl border border-border transition-shadow hover:shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-2">🏥 Lack of Access</h3>
              <p className="mt-2 text-muted-foreground"><span className="font-bold text-red-500">Challenge:</span> 1 dermatologist for every 1M+ people, leaving rural areas with no specialists.</p>
              <p className="mt-2 text-orange-600"><span className="font-bold">Solution:</span> Instant AI-powered skin analysis from any phone, closing the access gap.</p>
            </div>
            {/* Problem 2: Pervasive Misdiagnosis */}
            <div className="bg-card p-8 rounded-2xl border border-border transition-shadow hover:shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-2">🎯 Pervasive Misdiagnosis</h3>
              <p className="mt-2 text-muted-foreground"><span className="font-bold text-red-500">Challenge:</span> Global AI models fail on darker skin, leading to critical errors.</p>
              <p className="mt-2 text-orange-600"><span className="font-bold">Solution:</span> Our model is trained on African skin for accurate, bias-free results.</p>
            </div>
            {/* Problem 3: Harmful Products */}
            <div className="bg-card p-8 rounded-2xl border border-border transition-shadow hover:shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-2">⚠️ Harmful Products</h3>
              <p className="mt-2 text-muted-foreground"><span className="font-bold text-red-500">Challenge:</span> Fake creams and mercury-laced soaps flood the market, damaging skin.</p>
              <p className="mt-2 text-orange-600"><span className="font-bold">Solution:</span> Scan products for harmful ingredients and expiry dates before use.</p>
            </div>
            {/* Problem 4: No Health Monitoring */}
            <div className="bg-card p-8 rounded-2xl border border-border transition-shadow hover:shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-2">👩🏾‍⚕️ No Health Monitoring</h3>
              <p className="mt-2 text-muted-foreground"><span className="font-bold text-red-500">Challenge:</span> People treat symptoms randomly, with no data on what works.</p>
              <p className="mt-2 text-orange-600"><span className="font-bold">Solution:</span> Track your skincare journey with photo logs and smart comparisons.</p>
            </div>
            {/* Problem 5: Unverified Vendors */}
            <div className="bg-card p-8 rounded-2xl border border-border transition-shadow hover:shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-2">🧴 Unverified Vendors</h3>
              <p className="mt-2 text-muted-foreground"><span className="font-bold text-red-500">Challenge:</span> The market is flooded with counterfeits from unregulated sellers.</p>
              <p className="mt-2 text-orange-600"><span className="font-bold">Solution:</span> A curated marketplace of safe, vetted skincare products.</p>
            </div>
            {/* Problem 6: No Central Data */}
            <div className="bg-card p-8 rounded-2xl border border-border transition-shadow hover:shadow-lg">
              <h3 className="text-xl font-bold text-foreground mb-2">📉 No Central Data</h3>
              <p className="mt-2 text-muted-foreground"><span className="font-bold text-red-500">Challenge:</span> No large-scale dermatology database for African populations stunts research.</p>
              <p className="mt-2 text-orange-600"><span className="font-bold">Solution:</span> Building a pan-African dataset to power future innovation.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Platform Section - Added based on request */}
      <section id="features" className="py-20 md:py-32 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <span className="font-bold text-sm uppercase tracking-widest text-orange-600">Our Platform</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mt-4">An Ecosystem of Trust & Precision</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-16">
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">AI Skin Scanner</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">Ingredient Detector</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">Expiry Date Checker</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">Progress Tracker</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">Personalized AI Routines</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">Skincare Marketplace</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">Educational Hub</h3>
            </div>
            <div className="bg-card p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 transition-all duration-300 border border-transparent hover:border-orange-600/50 hover:shadow-md">
              <h3 className="text-md font-bold text-foreground">TeleDermal Consult</h3>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}