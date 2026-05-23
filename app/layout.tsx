/**
 * 🛡️ AFRIDAM ROOT SYSTEM: THE FOUNDATION (Rule 6 Synergy)
 * Version: 2026.1.12 (Route Group Sync & Build Stability)
 * Focus: High-End Ambiance, Zero-Flicker Redirection, Build Stability.
 */

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
import { AuthGuard } from "@/components/auth-guard"
import { AppWrapper } from "@/components/app-wrapper"
// import { IngredientAnalyzer } from "@/components/ai/ingredient-analyzer"
import { CallProvider } from "@/providers/call-provider"
import { ChatBotWrapper } from "@/components/chat-bot-wrapper"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

// ✅ T1-02 FIX: Replaced inline <title>/<meta> with Next.js metadata export
export const metadata: Metadata = {
  title: "AFRIDAM AI | Premium Melanin-Rich Skin Intelligence",
  description: "Clinical-grade AI diagnostics and verified skincare regimens for the African family.",
  icons: {
    icon: "/logo.png",
  },
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  maximumScale: 1,
  themeColor: "#050505",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* 🛡️ ANTI-FLICKER: Set theme class BEFORE first paint to prevent white/dark flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  document.documentElement.style.colorScheme = theme;
                } catch(e) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                }
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-[#050505] text-black dark:text-white selection:bg-[#E1784F]/30 min-h-[100svh] relative overflow-x-hidden scroll-smooth`}>

        {/* 🛡️ GLOBAL EDITORIAL TEXTURE */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* --- LIGHTING ORBS --- */}
        <div className="fixed top-[-10%] right-[-10%] w-125 h-125 bg-[#E1784F]/5 blur-[120px] rounded-full pointer-events-none z-[1]" />
        <div className="fixed bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#4DB6AC]/5 blur-[100px] rounded-full pointer-events-none z-[1]" />

        {/* 🚀 THE FIX: ThemeProvider props removed to resolve ts(2322) */}
        <ThemeProvider>
          <AuthProvider>
            <AuthGuard>
              <AppWrapper>
                {children}
              </AppWrapper>

              {/* 💬 PERSISTENT SUPPORT — moved to client wrapper to allow server root layout */}
              <ChatBotWrapper />

              <div className="fixed bottom-8 left-8 z-100">
                {/* <IngredientAnalyzer /> */}
              </div>
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}