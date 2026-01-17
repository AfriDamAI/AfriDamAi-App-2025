"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
// 🛡️ FIXED: Lowercase pathing for Linux build stability
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { AuthGuard } from "@/components/auth-guard" 
import { AppWrapper } from "@/components/app-wrapper"

/**
 * 🚀 OGA FINAL FIX: Path alignment for Vercel
 * Pointing to the physical file found in components/ai/
 */
import { AIChatBot } from "@/components/ai/ai-chat-bot" 

import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" /> 
        <title>AfriDam AI | Your Skin, Decoded</title>
        <meta name="description" content="AI dermatology for melanin-rich skin." />
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
              <AIChatBot />
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}