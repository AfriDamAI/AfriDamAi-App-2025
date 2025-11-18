import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AppWrapper } from "@/components/app-wrapper"
import { ThemeProvider } from "@/providers/theme-provider"
import { AuthProvider } from "@/providers/auth-provider"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (

        <main>

            <AppWrapper>
                <div className="min-h-screen bg-background flex flex-col">
                    <div className="flex-1">{children}</div>
                </div>
            </AppWrapper>
            <Analytics />
        </main>

    )
}
