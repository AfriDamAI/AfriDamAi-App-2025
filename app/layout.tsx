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
  subsets: ["latin"],
})

// 🛡️ SMART GUARD: Prevents logged-in users from seeing the landing page
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // If user is signed in and tries to access the landing page, push to dashboard
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>AfriDam AI | Your Skin, Decoded</title>
        <meta name="description" content="The first AI dermatology platform designed specifically for melanin-rich skin." />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground selection:bg-[#E1784F]/30 overflow-x-hidden min-h-screen relative`}>
        
        {/* WORLD-CLASS TEXTURE */}
        <div className="fixed inset-0 z-[9999] pointer-events-none opacity-[0.02] dark:opacity-[0.04] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <AuthProvider>
          <AuthGuard>
            <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isLandingPage ? (
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

              {/* GLOBAL COMPONENTS */}
              <AIChatBot />
            </ThemeProvider>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  )
}