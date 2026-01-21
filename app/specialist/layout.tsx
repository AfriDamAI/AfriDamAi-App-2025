/**
 * 🛡️ AFRIDAM SPECIALIST: LIVE LAYOUT
 * Version: 2026.1.1 (Neural Link Orchestration)
 * Focus: High-Precision Layout Sync for Video & Data.
 */

"use client"

import React, { useState } from "react"
import { VideoRoom } from "@/components/specialist/live/video-room"
import { ChatWindow } from "@/components/specialist/chat-window"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, 
  MessageSquare, 
  Video, 
  Settings,
  Activity,
  Maximize2,
  Minimize2
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function SpecialistLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [activePane, setActivePane] = useState<"split" | "video" | "chat">("split")
  const [chatOpen, setChatOpen] = useState(true)

  return (
    <div className="h-[100svh] bg-[#050505] flex flex-col overflow-hidden text-white selection:bg-[#E1784F]/30">
      
      {/* 🏛️ 1. GLOBAL CLINICAL HEADER */}
      <header className="h-20 border-b border-white/5 px-6 md:px-10 flex items-center justify-between bg-[#0A0A0A]/80 backdrop-blur-3xl z-[120]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push('/dashboard')}
            className="p-3 bg-white/5 rounded-2xl hover:bg-[#E1784F] transition-all group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="hidden md:block h-8 w-[1px] bg-white/10" />
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#4DB6AC] flex items-center justify-center text-black">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-[11px] font-black uppercase tracking-[0.4em]">Live Consultation</h2>
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-[#4DB6AC] animate-pulse">Neural Link Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className={`p-4 rounded-2xl transition-all ${chatOpen ? 'bg-[#E1784F] text-white' : 'bg-white/5 text-white/40'}`}
          >
            <MessageSquare size={20} />
          </button>
          <button className="p-4 bg-white/5 text-white/40 rounded-2xl hover:text-white transition-all">
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* 🚀 2. THE WORKSPACE */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* VIDEO PANE */}
        <main className={`flex-1 relative transition-all duration-700 ease-[0.22, 1, 0.36, 1] ${
          chatOpen ? 'md:mr-[400px]' : 'mr-0'
        }`}>
          <div className="w-full h-full p-4 md:p-8">
            <VideoRoom />
          </div>
        </main>

        {/* CHAT PANE (Side Drawer) */}
        <AnimatePresence>
          {chatOpen && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-20 bottom-0 w-full md:w-[400px] z-[110] border-l border-white/5"
            >
              <ChatWindow />
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* 🧬 3. DATA OVERLAY: CLINICAL TELEMETRY */}
      <div className="fixed bottom-8 left-10 z-[120] hidden lg:flex items-center gap-6 p-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl pointer-events-none">
         <div className="flex flex-col gap-1">
            <span className="text-[7px] font-black uppercase tracking-widest opacity-40 text-white">Latency</span>
            <span className="text-[10px] font-black text-[#4DB6AC]">24ms</span>
         </div>
         <div className="w-[1px] h-6 bg-white/10" />
         <div className="flex flex-col gap-1">
            <span className="text-[7px] font-black uppercase tracking-widest opacity-40 text-white">Encryption</span>
            <span className="text-[10px] font-black text-[#4DB6AC]">AES-256</span>
         </div>
      </div>

      {/* RENDER CHILDREN (Used for modals or specific overlays) */}
      {children}
    </div>
  )
}