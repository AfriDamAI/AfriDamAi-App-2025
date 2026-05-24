"use client"

import { useEffect, useState } from "react"
import { ArrowDown, ArrowUp } from "lucide-react"

export function FloatingScrollNav({ hasMobileNav = false }: { hasMobileNav?: boolean }) {
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)

  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const viewportHeight = window.innerHeight
      const pageHeight = document.documentElement.scrollHeight
      const nearTop = scrollTop < 160
      const nearBottom = scrollTop + viewportHeight >= pageHeight - 160

      setCanScrollUp(!nearTop)
      setCanScrollDown(pageHeight > viewportHeight + 160 && !nearBottom)
    }

    updateScrollState()
    window.addEventListener("scroll", updateScrollState, { passive: true })
    window.addEventListener("resize", updateScrollState)

    return () => {
      window.removeEventListener("scroll", updateScrollState)
      window.removeEventListener("resize", updateScrollState)
    }
  }, [])

  if (!canScrollUp && !canScrollDown) return null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    })
  }

  return (
    <div
      className={`fixed right-4 md:right-6 ${hasMobileNav ? "bottom-20" : "bottom-6"} md:bottom-6 z-[120] flex flex-col gap-2`}
      aria-label="Page scroll navigation"
    >
      {canScrollUp && (
        <button
          type="button"
          onClick={scrollToTop}
          className="h-11 w-11 rounded-2xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/85 text-black dark:text-white shadow-xl backdrop-blur-2xl flex items-center justify-center transition-all hover:text-[#E1784F] active:scale-95"
          aria-label="Scroll to top"
          title="Scroll to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {canScrollDown && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="h-11 w-11 rounded-2xl border border-black/5 dark:border-white/10 bg-white/85 dark:bg-black/85 text-black dark:text-white shadow-xl backdrop-blur-2xl flex items-center justify-center transition-all hover:text-[#4DB6AC] active:scale-95"
          aria-label="Scroll to bottom"
          title="Scroll to bottom"
        >
          <ArrowDown size={18} />
        </button>
      )}
    </div>
  )
}
