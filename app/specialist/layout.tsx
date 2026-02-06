"use client"

import React from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <div className="h-[100svh] bg-white dark:bg-[#050505] flex flex-col overflow-hidden text-black dark:text-white transition-colors duration-500">
      {children}
    </div>
  )
}