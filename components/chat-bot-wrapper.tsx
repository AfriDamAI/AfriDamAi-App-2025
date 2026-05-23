"use client"

import { usePathname } from "next/navigation"
import { AIChatBot } from "@/components/ai/ai-chatbot"

export function ChatBotWrapper() {
  const pathname = usePathname()
  const hideChatBotRoutes = ["/", "/ingredient-analyzer", "/specialist"]
  const shouldShowChatBot = !hideChatBotRoutes.includes(pathname)

  if (!shouldShowChatBot) return null

  return (
    <div className="fixed bottom-8 right-8 z-100">
      <AIChatBot />
    </div>
  )
}