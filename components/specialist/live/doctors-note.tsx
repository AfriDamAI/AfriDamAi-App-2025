/**
 * 🛡️ AFRIDAM NEURAL LINK: DOCTOR'S NOTE
 * Version: 2026.1.1 (Real-time Clinical Protocol)
 * Focus: High-Contrast Prescriptions & Care Instructions.
 */

"use client"

import React from "react"
import { motion } from "framer-motion"
import { ClipboardList, AlertCircle, BookmarkCheck } from "lucide-react"

interface DoctorsNoteProps {
  note: string;
  isPrescribing: boolean;
}

export function DoctorsNote({ note, isPrescribing }: DoctorsNoteProps) {
  if (!note && !isPrescribing) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#E1784F] text-black dark:text-white p-8 rounded-[2.5rem] shadow-2xl border border-white/10 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
         <ClipboardList size={80} />
      </div>

      <div className="relative z-10 space-y-6">
        <header className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black/10 flex items-center justify-center">
             <BookmarkCheck size={18} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Clinical Care Protocol</h3>
        </header>

        <div className="min-h-[60px]">
          {isPrescribing && !note ? (
            <div className="flex items-center gap-3 opacity-40">
               <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-bounce" />
               <p className="text-[10px] font-black uppercase tracking-widest italic">Specialist is drafting note...</p>
            </div>
          ) : (
            <p className="text-sm font-bold leading-relaxed italic uppercase tracking-tight">
              {note}
            </p>
          )}
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/10 flex items-center gap-3">
           <AlertCircle size={14} className="opacity-40" />
           <p className="text-[8px] font-black uppercase tracking-[0.3em] opacity-40">
             Official protocol • Synced to Medical History
           </p>
        </div>
      </div>
    </motion.div>
  )
}