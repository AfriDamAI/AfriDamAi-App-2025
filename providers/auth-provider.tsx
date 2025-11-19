"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  fullName: string
  sex: "male" | "female" | "other"
  skinType: "oily" | "combination" | "normal" | "dry" | "sensitive"
  knownAllergies: string[]
  previousTreatments: string[]
  createdDate: string
  skinHistory: Array<{
    condition: string
    date: string
    status: string
  }>
}

interface AuthContextType {
  user: User | null
  isSignedIn: boolean
  signIn: (email: string, password: string) => void
  signUp: (email: string, password: string, name: string) => void
  signOut: () => void
  updateUserProfile: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const signIn = (email: string, password: string) => {
     // Demo sign-in with extended user data
    setUser({
        id: "user_" + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
          fullName: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      sex: "female",
      skinType: "combination",
      knownAllergies: ["Fragrance", "Parabens"],
      previousTreatments: ["Retinol", "Chemical Peels", "Laser Therapy"],
      createdDate: new Date().toISOString().split('T')[0],
      skinHistory: [
        { condition: "Acne", date: "2024-11-01", status: "Treated" },
        { condition: "Hyperpigmentation", date: "2024-10-15", status: "Improving" },
      ],
    })
  }

  const signUp = (email: string, password: string, name: string) => {
   // Demo sign-up with extended user data
    setUser({
        id: "user_" + Math.random().toString(36).substr(2, 9),
      email,
         name: name.toLowerCase().replace(/\s+/g, "_"),
      fullName: name,
      sex: "female",
      skinType: "normal",
      knownAllergies: [],
      previousTreatments: [],
      createdDate: new Date().toISOString().split('T')[0],
      skinHistory: [],
    })
  }

  const signOut = () => {
    setUser(null)
  }

 const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  return (
     <AuthContext.Provider value={{ user, isSignedIn: !!user, signIn, signUp, signOut, updateUserProfile }}>
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
