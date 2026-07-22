"use client"

import React from "react"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Pinned directly to the viewport (not relying on ancestors resolving h-full/flex-stretch
  // correctly) so its size is unambiguous: top clears the global sticky nav (h-16/md:h-20),
  // left clears the desktop app Sidebar (hidden below lg, w-72 at lg+). Any overflow from
  // content inside is hard-clipped here instead of leaking into page-level scroll.
  return (
    <div className="fixed top-16 md:top-20 left-0 lg:left-72 right-0 bottom-0 z-10 bg-white dark:bg-[#050505] flex flex-col overflow-hidden text-black dark:text-white transition-colors duration-500">
      {children}
    </div>
  )
}