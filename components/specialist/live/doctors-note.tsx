"use client"

import React from "react"
import { motion } from "framer-motion"
import { ClipboardList, AlertCircle, BookmarkCheck } from "lucide-react"

/**
 * 🛡️ AFRIDAM SPECIALIST: CARE PLAN NOTE (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Mobile Readability & Specialist Guidance Handshake.
 */

interface DoctorsNoteProps {
  note: string;
  isPrescribing: boolean;
}

export function DoctorsNote({ note, isPrescribing }: DoctorsNoteProps) {
  // 🚀 HANDSHAKE: Only show if there is active typing or a saved note
  if (!note && !isPrescribing) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-50 dark:bg-[#4DB6AC]/10 text-black dark:text-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-black/5 dark:border-[#4DB6AC]/20 relative overflow-hidden text-left"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 pointer-events-none">
         <ClipboardList size={80} />
      </div>

      <div className="relative z-10 space-y-6">
        <header className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#4DB6AC] flex items-center justify-center text-white">
             <BookmarkCheck size={18} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">Your Care Plan</h3>
        </header>

        <div className="min-h-[60px]">
          {isPrescribing && !note ? (
            <div className="flex items-center gap-3 opacity-60 animate-pulse">
               <div className="w-2 h-2 bg-[#4DB6AC] rounded-full" />
               <p className="text-[10px] font-black uppercase tracking-widest italic">Specialist is drafting your guide...</p>
            </div>
          ) : (
            <p className="text-sm md:text-base font-bold leading-relaxed italic uppercase tracking-tight">
              {note || "Your specialist will add notes here during the session."}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-3">
           <AlertCircle size={14} className="opacity-40 text-[#4DB6AC]" />
           <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">
             Specialist Guidance • Saved to Skin Diary
           </p>
        </div>
      </div>
    </motion.div>
  )
}