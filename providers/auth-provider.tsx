"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  isSignedIn: boolean
  signIn: (email: string, password: string) => void
  signUp: (email: string, password: string, name: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signIn = (email: string, password: string) => {
    // Demo sign-in - just sets a mock user
    setUser({
      id: "1",
      email,
      name: email.split("@")[0],
    })
  }

  const signUp = (email: string, password: string, name: string) => {
    // Demo sign-up - just sets a mock user
    setUser({
      id: "1",
      email,
      name,
    })
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
