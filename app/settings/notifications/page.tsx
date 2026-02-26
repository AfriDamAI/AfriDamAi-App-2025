"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
// 🛡️ THE FIX: Explicit import to resolve ts(2304) and ts(2552)
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, MessageSquare, 
  Sparkles, ShoppingBag, Loader2, 
  CheckCircle2, Fingerprint
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { apiClient } from "@/lib/api-client"

/**
 * 🛡️ AFRIDAM NOTIFICATION SETTINGS (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: Framer Motion Error Resolution & Preference Sync.
 */

export default function NotificationSettingsPage() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [prefs, setPrefs] = useState({
    clinical: user?.profile?.prefs?.clinical ?? true,
    glowCheck: user?.profile?.prefs?.glowCheck ?? true,
    careShop: user?.profile?.prefs?.careShop ?? false,
    quietMode: user?.profile?.prefs?.quietMode ?? false
  })

  const handleToggle = async (key: keyof typeof prefs) => {
    const updatedPrefs = { ...prefs, [key]: !prefs[key] }
    setPrefs(updatedPrefs)
    setIsLoading(true)
    setIsSuccess(false)

    try {
      /**
       * 🚀 THE PREFERENCE HANDSHAKE
       * Updating the User Profile preferences in the Render backend.
       */
      await apiClient.patch(`/user/${user?.id}/preferences`, {
        notificationPrefs: updatedPrefs
      })
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 2000)
    } catch (err) {
      console.log("Preference sync pending...")
    } finally {
      setIsLoading(false)
    }
  }

  const ToggleRow = ({ icon: Icon, title, subtitle, active, onToggle, color = "text-[#E1784F]" }: any) => (
    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-[2.5rem] transition-all text-left">
      <div className="flex items-center gap-5">
        <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center shadow-sm ${color}`}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <h3 className="text-[11px] font-black uppercase tracking-widest leading-none text-black dark:text-white">{title}</h3>
          <p className="text-[8px] font-bold uppercase opacity-30 tracking-tight mt-1">{subtitle}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`w-14 h-8 rounded-full relative transition-all duration-500 ease-in-out ${active ? 'bg-[#4DB6AC]' : 'bg-gray-200 dark:bg-white/10'}`}
      >
        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-500 ${active ? 'left-7' : 'left-1'}`} />
      </button>
    </div>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-6 lg:p-20 relative overflow-x-hidden text-left">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-[radial-gradient(circle_at_80%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-2xl mx-auto space-y-12 relative z-10">
        <header className="space-y-8">
          <button 
            onClick={() => router.push('/settings')}
            className="flex items-center gap-3 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ChevronLeft size={16} /> Back to Settings
          </button>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
              The <br /> <span className="text-[#E1784F]">Alerts</span>
            </h1>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Manage your glow notifications</p>
          </div>
        </header>

        <AnimatePresence>
          {(isLoading || isSuccess) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-3 px-6 py-4 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-2xl text-[#4DB6AC]"
            >
              {isLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              <span className="text-[8px] font-black uppercase tracking-widest">
                {isLoading ? "Syncing..." : "Saved"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <section className="space-y-4">
          <ToggleRow 
            icon={MessageSquare} 
            title="Specialist Nudges" 
            subtitle="Alerts for specialist chat replies" 
            active={prefs.clinical} 
            onToggle={() => handleToggle('clinical')}
          />
          <ToggleRow 
            icon={Sparkles} 
            title="Glow Check" 
            subtitle="Reminders to scan your skin" 
            active={prefs.glowCheck} 
            onToggle={() => handleToggle('glowCheck')}
            color="text-[#4DB6AC]"
          />
          <ToggleRow 
            icon={ShoppingBag} 
            title="Care Shop" 
            subtitle="Restock alerts for your plan" 
            active={prefs.careShop} 
            onToggle={() => handleToggle('careShop')}
          />
        </section>

        <footer className="pt-10 flex flex-col items-center gap-4 opacity-20">
           <div className="flex items-center gap-3">
              <Fingerprint size={16} className="text-[#4DB6AC]" />
              <span className="text-[7px] font-black uppercase tracking-[0.5em]">Identity Protection Enabled</span>
           </div>
        </footer>
      </div>
    </main>
  )
}