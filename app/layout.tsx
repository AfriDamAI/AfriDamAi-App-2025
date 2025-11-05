import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/providers/theme-provider"
import { AppWrapper } from "@/components/app-wrapper"
import { AuthProvider } from "@/providers/auth-provider"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DermAI - AI Dermatology Scanner",
  description: "Scan your skin instantly and analyze cosmetic ingredients with AI",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
         <AuthProvider>
          <ThemeProvider>
            <AppWrapper>
              <main className="min-h-screen bg-background flex flex-col">
                <div className="flex-1">{children}</div>
              </main>
            </AppWrapper>
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
