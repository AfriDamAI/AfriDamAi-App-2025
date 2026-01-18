/**
 * 🛡️ AFRIDAM WELLNESS HUB: PROFILE SIDEBAR
 * Version: 2026.1.4 (Personal & Relatable)
 * Focus: Mobile-First accessibility and wellness-driven language.
 */

"use client"

import { useState } from "react"
import { X, MessageCircle, AlertCircle, LogOut, Activity, Zap } from 'lucide-react'
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"
import { TreatmentRoutine } from "./treatment-routine"
import { AppointmentBooking } from "./appointment-booking"
import { motion, AnimatePresence } from "framer-motion"

interface ProfileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProfileSidebar({ isOpen, onClose }: ProfileSidebarProps) {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "routine" | "care">("overview")
  const [comment, setComment] = useState("")

  if (!user) return null

  const userInitial = (user.firstName || user.email || "U").charAt(0).toUpperCase();

  return (
    <>
      {/* 🛡️ BLURRED OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* 🛡️ PREMIUM SIDEBAR */}
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-[420px] bg-background border-l border-border z-[110] transform transition-transform duration-500 ease-in-out overflow-y-auto no-scrollbar ${
          isOpen ? "translate-x-0 shadow-[-10px_0_40px_rgba(0,0,0,0.1)]" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-6 flex items-center justify-between z-20">
          <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground italic">Wellness Profile</h2>
          <button onClick={onClose} className="p-2.5 bg-muted/50 rounded-xl transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* USER IDENTITY */}
          <div className="text-center space-y-4 pt-4">
            <div className="w-20 h-20 bg-[#E1784F] rounded-[2rem] flex items-center justify-center mx-auto shadow-xl relative">
              <span className="text-white text-3xl font-black italic">{userInitial}</span>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#4DB6AC] rounded-xl flex items-center justify-center border-4 border-background text-white">
                <Activity size={14} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Valued Member"}
              </h3>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">{user.email}</p>
            </div>
          </div>

          {/* QUICK METRICS */}
          <div className="grid grid-cols-2 gap-3">
             <div className="p-4 bg-muted/20 rounded-2xl border border-border">
                <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mb-1">Gender</p>
                <p className="text-xs font-black italic uppercase text-foreground">{user.sex || "Not Set"}</p>
             </div>
             <div className="p-4 bg-muted/20 rounded-2xl border border-border">
                <p className="text-[7px] font-black text-muted-foreground uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-xs font-black italic uppercase text-foreground">
                  {user.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}
                </p>
             </div>
          </div>

          {/* TAB SELECTOR */}
          <div className="flex bg-muted/30 p-1 rounded-2xl border border-border">
            {["overview", "routine", "care"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-[8px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  activeTab === tab ? "bg-[#E1784F] text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === 'care' ? 'Expert' : tab}
              </button>
            ))}
          </div>

          {/* CONTENT AREA */}
          <div className="space-y-8 min-h-[300px]">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Sensitivity alerts */}
                <div className="space-y-3">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-[#E1784F] flex items-center gap-2">
                    <AlertCircle size={12} /> Sensitivity Alerts
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.profile?.allergies ? (
                       <span className="px-3 py-2 bg-[#E1784F]/5 text-[#E1784F] text-[8px] font-black uppercase tracking-widest rounded-lg border border-[#E1784F]/10">
                          {user.profile.allergies}
                       </span>
                    ) : (
                       <p className="text-[9px] font-bold text-muted-foreground italic uppercase">No alerts active.</p>
                    )}
                  </div>
                </div>

                {/* Personal Notes */}
                <div className="space-y-3">
                  <label className="text-[9px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                    <MessageCircle size={12} /> Care Notes
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How does your skin feel today?"
                    className="w-full px-4 py-4 bg-muted/20 border border-border rounded-xl text-xs font-medium italic focus:ring-1 focus:ring-[#E1784F] outline-none resize-none"
                    rows={4}
                  />
                  <Button className="w-full h-14 bg-black text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-lg">
                    Save Notes
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "routine" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <TreatmentRoutine />
              </motion.div>
            )}

            {activeTab === "care" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <AppointmentBooking />
              </motion.div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-8 border-t border-border flex flex-col gap-4 pb-12">
            <button
              onClick={() => { signOut(); onClose(); }}
              className="w-full h-14 border border-red-500/10 text-red-500 bg-red-500/[0.02] rounded-xl font-black uppercase text-[9px] tracking-widest flex items-center justify-center gap-2"
            >
              <LogOut size={14} /> Sign Out
            </button>
            <p className="text-[7px] font-black text-center text-muted-foreground uppercase tracking-[0.4em] opacity-40">
              AfriDam Wellness Intelligence • 2026
            </p>
          </div>
        </div>
      </div>
    </>
  )
}