"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { ChevronDown, LogOut, User } from 'lucide-react'
import Link from "next/link"

interface UserProfileProps {
  onSignInClick: () => void
  onSignUpClick: () => void
  onViewProfileClick?: () => void
}

export function UserProfile({ onSignInClick, onSignUpClick, onViewProfileClick }: UserProfileProps) {
  const { user, isSignedIn, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  if (!isSignedIn) {
    return (
      <div className="flex items-center gap-2">
        <Button onClick={onSignInClick} variant="ghost" className="text-foreground hover:bg-black">
          Sign In
        </Button>
        <Button onClick={onSignUpClick} className="bg-primary dark:bg-[#e1784f] hover:bg-orange-700 text-white hover:text-white hidden sm:inline-flex">
          Sign Up
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-400 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">{user?.fullName.charAt(0).toUpperCase()}</span>
        </div>
        <span className="text-sm font-medium text-foreground hidden sm:inline">{user?.fullName}</span>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>

          <Link href="/profile"
            onClick={() => {
              setDropdownOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2"
          >
            <User className="w-4 h-4" />
            View Profile
          </Link>

          <button
            onClick={() => {
              signOut()
              setDropdownOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}

      {/* Close dropdown when clicking outside */}
      {dropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />}
    </div>
  )
}
