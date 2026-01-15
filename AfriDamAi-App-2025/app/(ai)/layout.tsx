import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { AppWrapper } from "@/components/app-wrapper"

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
