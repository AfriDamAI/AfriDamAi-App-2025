"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { 
  ChevronLeft, User, ShieldCheck, 
  Bell, Globe, LogOut, Moon, 
  CreditCard, Sparkles, Fingerprint 
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { motion } from "framer-motion"

/**
 * 🛡️ AFRIDAM SETTINGS HUB (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Icon Export Fix & Mobile-First Tile Navigation.
 */

export default function SettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()

  const handleSignOut = () => {
    signOut()
    router.push("/login")
  }

  const SettingTile = ({ icon: Icon, title, subtitle, onClick, color = "text-[#E1784F]" }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl hover:border-[#E1784F]/20 transition-all group active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg bg-white dark:bg-white/5 flex items-center justify-center shadow-sm ${color}`}>
          <Icon size={16} />
        </div>
        <div className="text-left">
          <h3 className="text-sm md:text-[10px] font-black tracking-widest leading-none">{title}</h3>
          <p className="text-[12px] font-bold opacity-30 tracking-tight mt-0.5">{subtitle}</p>
        </div>
      </div>
      <ChevronLeft size={14} className="rotate-180 opacity-20 group-hover:opacity-100 transition-all" />
    </button>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white p-4 lg:p-10 relative overflow-x-hidden text-left">
      
      {/* 🏛️ CINEMATIC BACKGROUND */}
      <div className="absolute top-0 right-0 w-full h-[400px] bg-[radial-gradient(circle_at_80%_0%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />

      <div className="max-w-xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER */}
        <header className="space-y-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-[#4DB6AC] text-[9px] font-black tracking-[0.2em]"
          >
            <ChevronLeft size={14} /> Back to Hub
          </button>
          
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-none">
              The <br /> <span className="text-[#E1784F]">Settings</span>
            </h1>
            <p className="text-[8px] font-black tracking-[0.3em] opacity-30">Manage your skin journey</p>
          </div>
        </header>

        {/* PROFILE PREVIEW */}
        <section className="p-5 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-between shadow-lg transition-colors duration-500">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-[#E1784F] flex items-center justify-center text-white text-base font-black italic shadow-lg">
              {user?.firstName?.charAt(0) || "O"}
            </div>
            <div>
              <h2 className="text-base font-black italic tracking-tighter leading-none">{user?.firstName} {user?.lastName}</h2>
              <p className="text-[8px] font-black tracking-widest opacity-40 mt-1">{user?.email}</p>
            </div>
          </div>
          <button onClick={() => router.push('/profile')} className="p-3 bg-white/10 dark:bg-black/5 rounded-lg hover:bg-[#E1784F] transition-all">
             <Sparkles size={14} />
          </button>
        </section>

        {/* SETTINGS GRID */}
        <div className="grid gap-2">
          <SettingTile 
            icon={User} 
            title="Personal Details" 
            subtitle="Update your name and phone number" 
            onClick={() => router.push('/settings/personal-details')}
          />
          <SettingTile 
            icon={ShieldCheck} 
            title="Login & Security" 
            subtitle="Change password and secure account" 
            onClick={() => router.push('/settings/security')}
            color="text-[#4DB6AC]"
          />
          <SettingTile 
            icon={CreditCard} 
            title="Specialist Access" 
            subtitle="Manage consultations and payments" 
            onClick={() => router.push('/settings/billing')}
          />
          <SettingTile 
            icon={Bell} 
            title="Notifications" 
            subtitle="Daily glow reminders and chat alerts" 
            onClick={() => {}}
            color="text-[#4DB6AC]"
          />
          <SettingTile 
            icon={Globe} 
            title="Language & Region" 
            subtitle="English • Nigeria" 
            onClick={() => {}}
          />
        </div>

        {/* DANGER ZONE */}
        <div className="pt-5 border-t border-black/5 dark:border-white/5 space-y-3">
           <button 
            onClick={handleSignOut}
            className="w-full h-14 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/10 rounded-xl flex items-center justify-center gap-3 transition-all group active:scale-95"
          >
              <LogOut size={16} />
              <span className="text-[9px] font-black tracking-[0.3em]">Sign Out</span>
          </button>
           
           <div className="flex flex-col items-center gap-2 pt-6 opacity-20">
              <div className="flex items-center gap-2">
                 <Fingerprint size={12} className="text-[#4DB6AC]" />
                 <span className="text-[6px] font-black tracking-[0.4em]">Secure Connection Active</span>
              </div>
              <p className="text-[6px] font-black tracking-[0.2em]">Version 2026.1.25 (Production)</p>
           </div>
        </div>
      </div>
    </main>
  )
}
