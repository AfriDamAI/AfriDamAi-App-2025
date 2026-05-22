/**
 * 🛡️ AFRIDAM THEME PROVIDER (Rule 6 Synergy)
 * Version: 2026.1.11 (Dark-Default Sync)
 * Focus: Eliminating Hydration Flicker & Syncing with Tailwind 4.0.
 */

"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 🚀 RULE 6 FIX: Initial state set to "dark" to match Dashboard & Auth aesthetics
  const [theme, setTheme] = useState<Theme>("dark")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null
    
    // 🛡️ SYNERGY: Default to dark for the 2026 Clinical Intelligence Hub
    const initialTheme = savedTheme || "dark"

    setTheme(initialTheme)
    
    // 2. Immediate DOM Sync
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.style.colorScheme = "dark"
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.colorScheme = "light"
    }
    
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // ⚡ Create a style block to temporarily disable all animations during the repaint
    const css = document.createElement('style')
    css.type = 'text/css'
    css.appendChild(
      document.createTextNode(
        `* {
           -webkit-transition: none !important;
           -moz-transition: none !important;
           -o-transition: none !important;
           -ms-transition: none !important;
           transition: none !important;
         }`
      )
    )
    document.head.appendChild(css)

    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", newTheme)
      
   if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.style.colorScheme = "dark"
    } else {
      document.documentElement.classList.remove("dark")
      document.documentElement.style.colorScheme = "light"
    }
    
    return newTheme
  })

  // ⚡ Force a browser layout reflow computation
  window.getComputedStyle(css).opacity

  // ⚡ Clear out the style block on the next execution frame
  setTimeout(() => {
    document.head.removeChild(css)
  }, 0)
}

  // 🛡️ NUCLEAR STABILIZER: Prevent Hydration Flicker
  // Using visibility instead of opacity to avoid any painted frame of wrong-theme content.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ visibility: mounted ? "visible" : "hidden" }} className="contents">
        {children}
      </div>
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}