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
  // 🛡️ RE-ENFORCED: Default to "light" explicitly for first-time users
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 1. Check if user has a saved preference from a previous visit
    const savedTheme = localStorage.getItem("theme") as Theme | null
    
    // 🛡️ OGA FIX: We ignore "prefers-color-scheme" for the initial landing experience
    // to ensure the app stays "Light" by default as requested.
    const initialTheme = savedTheme || "light"

    setTheme(initialTheme)
    
    // 2. Apply the class to the HTML tag immediately
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light"
      localStorage.setItem("theme", newTheme)
      
      // Sync the HTML class for Tailwind dark: mode
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
      
      return newTheme
    })
  }

  // 🛡️ Prevent Hydration Mismatch: Render children only after mounting
  // but provide the context so the app doesn't crash.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={!mounted ? "invisible" : "visible"}>
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