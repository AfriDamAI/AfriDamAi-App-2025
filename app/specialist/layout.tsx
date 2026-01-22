/**
 * 🛡️ AFRIDAM SPECIALIST: LIVE LAYOUT
 * Version: 2026.1.3 (Path & Jargon Sync)
 * Focus: Corrected nested imports for Vercel stability.
 */

"use client"

import React, { useState } from "react"
// 🚀 FIXED: Paths now match the /components/specialist/live/ folder structure
import { VideoRoom } from "@/components/specialist/live/video-room"
import { ChatWindow } from "@/components/specialist/live/chat-window" 
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  MessageSquare, 
  Settings,
  Activity
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [chatOpen, setChatOpen] = useState(true)

  return (
    <div className="h-[100svh] bg-white dark:bg-[#050505] flex flex-col overflow-hidden text-black dark:text-white transition-colors duration-500">
      
      {/* 🏛️ 1. HEADER */}
      <header className="h-20 border-b border-black/5 dark:border-white/5 px-6 md:px-10 flex items-center justify-between bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-3xl z-[120]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-3 bg-gray-100 dark:bg-white/5 rounded-2xl hover:bg-[#E1784F] hover:text-white transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="hidden md:block h-8 w-[1px] bg-black/10 dark:bg-white/10" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#4DB6AC] flex items-center justify-center text-white shadow-sm">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Consultation</h2>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Secure Connection</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-4 rounded-2xl transition-all ${chatOpen ? 'bg-[#E1784F] text-white' : 'bg-gray-100 dark:bg-white/5 opacity-50'}`}
          >
            <MessageSquare size={20} />
          </button>
          <button className="p-4 bg-gray-100 dark:bg-white/5 opacity-50 rounded-2xl hover:opacity-100 transition-all">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* 🚀 2. WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        <main className={`flex-1 relative transition-all duration-700 ease-[0.22, 1, 0.36, 1] ${
          chatOpen ? 'md:mr-[400px]' : 'mr-0'
        }`}>
          <div className="w-full h-full p-4 md:p-8">
            <VideoRoom />
          </div>
        </main>

        <AnimatePresence>
          {chatOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-20 bottom-0 w-full md:w-[400px] z-[110] border-l border-black/5 dark:border-white/5 bg-white dark:bg-[#050505]"
            >
              <ChatWindow />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* 🧬 3. STATUS BAR */}
      <div className="fixed bottom-8 left-10 z-[120] hidden lg:flex items-center gap-6 p-4 bg-white/80 dark:bg-black/40 backdrop-blur-2xl border border-black/5 dark:border-white/10 rounded-3xl pointer-events-none shadow-xl">
         <div className="flex flex-col gap-1">
            <span className="text-[7px] font-black uppercase tracking-widest opacity-40">Connection</span>
            <span className="text-[10px] font-black text-[#4DB6AC]">Stable</span>
         </div>
         <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10" />
         <div className="flex flex-col gap-1">
            <span className="text-[7px] font-black uppercase tracking-widest opacity-40">Privacy</span>
            <span className="text-[10px] font-black text-[#4DB6AC]">Verified</span>
         </div>
      </div>

      {children}
    </div>
  )
}