"use client"

import type React from "react"
import { useEffect } from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider, useAuth } from "@/providers/auth-provider"
import { AppWrapper } from "@/components/app-wrapper"
import { AIChatBot } from "@/components/ai-chat-bot"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
})

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isSignedIn && pathname === "/") {
      router.replace("/dashboard");
    }
  }, [isSignedIn, isLoading, pathname, router]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" /> 
        <title>AfriDam AI | Your Skin, Decoded</title>
        <meta name="description" content="AI dermatology for melanin-rich skin." />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground selection:bg-[#E1784F]/30 overflow-x-hidden min-h-screen relative`}>
        
        {/* 🛡️ FIXED TEXTURE: Moved to z-[-1] so it stays BEHIND your buttons */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.02] dark:opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <AuthProvider>
          <AuthGuard>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  className="min-h-screen w-full relative z-10" // Force content to the front
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLandingPage ? (
                    <main className="w-full relative overflow-x-hidden">
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
            </ThemeProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}