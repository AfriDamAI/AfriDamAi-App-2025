"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/providers/auth-provider"
import { ChevronDown, LogOut, User, LayoutDashboard, Settings } from 'lucide-react'
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

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
        <button
          onClick={onSignInClick}
          className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-foreground hover:text-[#E1784F] transition-all"
        >
          Login
        </button>
        <button
          onClick={onSignUpClick}
          className="px-8 py-3 bg-[#E1784F] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#E1784F]/20 active:scale-95 transition-all hidden sm:inline-flex"
        >
          Get Started
        </button>
      </div>
    )
  }

  const userInitial = (user?.firstName || "U").charAt(0).toUpperCase();
  const fullName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.firstName || "Valued Member";

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-3 px-2 py-1.5 rounded-2xl hover:bg-muted/50 transition-all border border-transparent hover:border-border"
      >
        {/* 🛡️ RE-ENFORCED: AFRIDAM BRANDED AVATAR */}
        <div className="w-10 h-10 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white shadow-lg border border-white/10">
          <span className="text-sm font-black italic">{userInitial}</span>
        </div>

        <div className="hidden sm:flex flex-col text-left leading-none gap-1">
          <span className="text-[10px] font-black uppercase tracking-tighter italic text-foreground">
            {fullName}
          </span>
          <span className="text-[8px] font-bold text-[#4DB6AC] uppercase tracking-widest">
            {(user as any)?.plan?.name || "Clinical Account"}
          </span>
        </div>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* 🛡️ RE-ENFORCED: PREMIUM DROPDOWN */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-64 bg-background border border-border rounded-[2rem] shadow-2xl py-4 z-[200] overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-border mb-2 bg-muted/20">
              <p className="text-[10px] font-black uppercase tracking-tighter italic text-foreground truncate">{fullName}</p>
              <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest truncate">{user?.email}</p>
            </div>

            <div className="px-2 space-y-1">
              <Link href="/dashboard"
                onClick={() => setDropdownOpen(false)}
                className="w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-foreground hover:bg-[#E1784F] hover:text-white rounded-xl transition-all flex items-center gap-3"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              <Link href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-foreground hover:bg-muted rounded-xl transition-all flex items-center gap-3"
              >
                <User size={14} />
                Edit Profile
              </Link>

              <button
                onClick={() => {
                  signOut()
                  setDropdownOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-3 mt-4"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Close overlay */}
      {dropdownOpen && <div className="fixed inset-0 z-[190]" onClick={() => setDropdownOpen(false)} />}
    </div>
  )
}