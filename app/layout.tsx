/**
 * 🛡️ AFRIDAM ROOT SYSTEM
 * Version: 2026.1.0
 * Focus: High-End Foundation for African Skin Wellness
 */

"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { AuthGuard } from "@/components/auth-guard" 
import { AppWrapper } from "@/components/app-wrapper"

/**
 * 🚀 OGA FIX: Care Chat Handshake
 * Simple pathing for the Smart Assistant.
 */
import { AIChatBot } from "@/components/ai/ai-chatbot" 

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* 📱 MOBILE FIRST: Optimized for modern phone screens */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" /> 
        
        {/* 🛡️ RELATABLE BRANDING: Modest and Professional */}
        <title>AfriDam AI | Skin Wellness for the Family</title>
        <meta name="description" content="Safe skincare support for mothers and children." />
        <meta name="theme-color" content="#1C1A19" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground selection:bg-[#E1784F]/30 min-h-[100svh] relative overflow-x-hidden`}>
        
        {/* 🛡️ BACKGROUND TEXTURE */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.02] dark:opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AuthProvider>
            <AuthGuard>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  className="min-h-[100svh] w-full relative z-10 flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLandingPage ? (
                    <main className="w-full flex-1">
                      {children}
                    </main>
                  ) : (
                    <AppWrapper> 
                      {children}
                    </AppWrapper>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* 💬 RELATABLE CHAT: Swapped jargon for Care Assistant */}
              <AIChatBot />
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}