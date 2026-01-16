"use client"

import { useState } from "react"
import { X, Calendar, MessageCircle, Heart, AlertCircle, User, Users, LogOut, Activity, Zap } from 'lucide-react'
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
  const [activeTab, setActiveTab] = useState<"overview" | "routine" | "appointment">("overview")
  const [comment, setComment] = useState("")

  if (!user) return null

  const userInitial = (user.firstName || user.email || "U").charAt(0).toUpperCase();

  return (
    <>
      {/* 🛡️ RE-ENFORCED: BLURRED OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* 🛡️ RE-ENFORCED: PREMIUM SIDEBAR */}
      <div
        className={`fixed right-0 top-0 h-screen w-full sm:w-[450px] bg-background border-l border-border z-[110] transform transition-transform duration-500 ease-in-out overflow-y-auto no-scrollbar ${
          isOpen ? "translate-x-0 shadow-[-20px_0_50px_rgba(0,0,0,0.2)]" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-border px-8 py-6 flex items-center justify-between z-20">
          <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground italic">Clinical Profile</h2>
          <button onClick={onClose} className="p-3 bg-muted/50 hover:bg-[#E1784F]/10 hover:text-[#E1784F] rounded-2xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-10">
          {/* USER IDENTITY CARD */}
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-[#E1784F] rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-[#E1784F]/20 border-4 border-background relative">
              <span className="text-white text-4xl font-black italic">{userInitial}</span>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#4DB6AC] rounded-2xl flex items-center justify-center border-4 border-background text-white">
                <Zap size={16} />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Valued Member"}
              </h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mt-1">{user.email}</p>
            </div>
          </div>

          {/* QUICK METRICS */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 bg-muted/30 rounded-3xl border border-border">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Biological Sex</p>
                <p className="text-sm font-black italic uppercase text-foreground">{user.sex || "Not Set"}</p>
             </div>
             <div className="p-5 bg-muted/30 rounded-3xl border border-border">
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Member Since</p>
                <p className="text-sm font-black italic uppercase text-foreground">
                  {user.createdAt ? new Date(user.createdAt).getFullYear() : "2026"}
                </p>
             </div>
          </div>

          {/* TABS SELECTOR */}
          <div className="flex bg-muted/50 p-1.5 rounded-[1.5rem] border border-border">
            {["overview", "routine", "appointment"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                  activeTab === tab ? "bg-[#E1784F] text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}
          <div className="space-y-8 min-h-[300px]">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                {/* Allergies node */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F] flex items-center gap-2">
                    <AlertCircle size={14} /> Critical Warnings
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {user.profile?.allergies ? (
                       <span className="px-4 py-2 bg-[#E1784F]/10 text-[#E1784F] text-[9px] font-black uppercase tracking-widest rounded-xl border border-[#E1784F]/20">
                          {user.profile.allergies}
                       </span>
                    ) : (
                       <p className="text-[10px] font-medium text-muted-foreground italic">No clinical warnings found.</p>
                    )}
                  </div>
                </div>

                {/* Personal Notes */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground flex items-center gap-2">
                    <MessageCircle size={14} /> Dermal Observations
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Log personal observations..."
                    className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl text-sm font-medium italic focus:ring-2 focus:ring-[#E1784F]/20 outline-none resize-none"
                    rows={4}
                  />
                  <Button className="w-full h-14 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">
                    Submit Logs
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === "routine" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <TreatmentRoutine />
              </motion.div>
            )}

            {activeTab === "appointment" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <AppointmentBooking />
              </motion.div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          <div className="pt-10 border-t border-border flex flex-col gap-4 pb-12">
            <Button
              onClick={() => { signOut(); onClose(); }}
              variant="outline"
              className="w-full h-16 border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3"
            >
              <LogOut size={18} /> Sign Out
            </Button>
            <p className="text-[7px] font-black text-center text-muted-foreground uppercase tracking-[0.5em] opacity-40">
              AfriDam AI Clinical Systems • 2026
            </p>
          </div>
        </div>
      </div>
    </>
  )
}