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
  // 🛡️ RE-ENFORCED: Initial state set to "light" for clinical consistency
  const [theme, setTheme] = useState<Theme>("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // 1. Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme") as Theme | null
    
    // 🛡️ OGA FIX: Intentional override of system settings for "Light-First" onboarding
    const initialTheme = savedTheme || "light"

    setTheme(initialTheme)
    
    // 2. Immediate DOM Sync for Tailwind 4.0 dark: classes
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
      
      // 🛡️ RE-ENFORCED: Sync both Class and colorScheme for mobile browser compatibility
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
  // The "invisible" class prevents the user from seeing the default 
  // theme before the JS decides which one to apply.
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={!mounted ? "invisible" : "visible contents"}>
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