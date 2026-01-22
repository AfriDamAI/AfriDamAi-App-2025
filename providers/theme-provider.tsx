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
  }

  // 🛡️ NUCLEAR STABILIZER: Prevent Hydration Flicker
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={!mounted ? "opacity-0" : "opacity-100 contents transition-opacity duration-300"}>
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