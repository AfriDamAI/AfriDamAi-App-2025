"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AppWrapper } from "@/components/app-wrapper"
import { AIChatBot } from "@/components/ai/ai-chatbot"

interface LayoutContentProps {
  children: React.ReactNode
}

export default function LayoutContent({ children }: LayoutContentProps) {
  const pathname = usePathname()
  const hideChatBotRoutes = ["/", "/ingredient-analyzer", "/specialist"]
  const shouldShowChatBot = !hideChatBotRoutes.includes(pathname)

  return (
    <>
      <AuthGuard>
        <AppWrapper>{children}</AppWrapper>
      </AuthGuard>

      {shouldShowChatBot && (
        <div className="fixed bottom-8 right-8 z-100">
          <AIChatBot />
        </div>
      )}
      <div className="fixed bottom-8 left-8 z-100" />
    </>
  )
}
