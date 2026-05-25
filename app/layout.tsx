/**
 * 🛡️ AFRIDAM ROOT SYSTEM: THE FOUNDATION (Rule 6 Synergy)
 * Version: 2026.1.12 (Route Group Sync & Build Stability)
 * Focus: High-End Ambiance, Zero-Flicker Redirection, Build Stability.
 */

"use client"

import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"
// 🚀 RULE 6 FIX: Corrected import path for AuthGuard
import { AuthGuard } from "@/components/auth-guard"
import { AppWrapper } from "@/components/app-wrapper"
import { AIChatBot } from "@/components/ai/ai-chatbot"
import { usePathname } from "next/navigation"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
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

  // Routes where the AIChatBot should be hidden (they have their own interfaces)
  const hideChatBotRoutes = ["/", "/ingredient-analyzer", "/specialist"];
  const shouldShowChatBot = !hideChatBotRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        {/* 📱 VIEWPORT OPTIMIZATION - Mobile First (Rule 3) */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1" />

        {/* 🛡️ CLINICAL BRANDING */}
        <title>AFRIDAM AI | Premium Melanin-Rich Skin Intelligence</title>
        <meta name="description" content="Clinical-grade AI diagnostics and verified skincare regimens for the African family." />
        <meta name="theme-color" content="#050505" />

        <link rel="icon" href="/logo.png" />

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

              {/* 💬 PERSISTENT SUPPORT */}
              {shouldShowChatBot && (
                <div className="fixed bottom-8 right-8 z-100">
                  <AIChatBot />
                </div>
              )}
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
