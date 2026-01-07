"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { AppWrapper } from "@/components/app-wrapper"
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

  // Public pages vs Portal pages
  const isPublicPage = pathname === "/" || pathname === "/contact" || pathname === "/marketplace";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AfriDam AI | Your Skin, Decoded</title>
        <meta name="description" content="The first AI dermatology platform designed specifically for melanin-rich skin." />
      </head>
      {/* FIXED: Removed hardcoded colors. 
          The classes below use Tailwind variables that react to the Light/Dark toggle.
      */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground selection:bg-[#E1784F]/30 overflow-x-hidden min-h-screen`}>
        
        {/* WORLD-CLASS TEXTURE: Fixed opacity for better visibility across themes */}
        <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {isPublicPage ? (
                  <main className="w-full relative">
                    {children}
                  </main>
                ) : (
                  <AppWrapper> 
                    {children}
                  </AppWrapper>
                )}
              </motion.div>
            </AnimatePresence>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}