"use client"

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // 🛡️ RE-ENFORCED: Prevents the "White Flash" on mobile app startup
  // This ensures the theme logic only runs after the client is ready.
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a fragment or a loading state that matches your default 
    // to avoid layout shifts during the splash screen transition.
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// 🛡️ HELPER: Standard hook for easier theme switching in components
export const useTheme = () => {
  const { theme, setTheme } = React.useContext(React.createContext({
    theme: 'light',
    setTheme: (theme: string) => {}
  })) // Note: next-themes provides its own hook, but we keep this for compatibility.
  return { theme, toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}