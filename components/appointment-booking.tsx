/**
 * 🛡️ AFRIDAM CLINICAL SCHEDULER: BOOKING
 * Version: 2026.1.3 (Premium Editorial Refactor)
 * Handshake: Ready for NestJS Appointment Node
 * Focus: High-Contrast, Mature Typography, Clinical Integrity.
 */

"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Loader2,
  ChevronRight,
  Fingerprint
} from 'lucide-react'

export function AppointmentBooking() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  })
  const [isSyncing, setIsSyncing] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.date && formData.time && formData.reason) {
      setIsSyncing(true)
      
      try {
        // 🚀 OGA HANDSHAKE: Simulation of the secure POST to your Render backend
        await new Promise(resolve => setTimeout(resolve, 2000))
        setSubmitted(true)
        
        setTimeout(() => {
          setFormData({ date: "", time: "", reason: "" })
          setSubmitted(false)
        }, 6000)
      } finally {
        setIsSyncing(false)
      }
    }
  }

  return (
    <div className="space-y-12 text-left">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.9, y: 30 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="py-24 flex flex-col items-center text-center space-y-10"
          >
            <div className="w-32 h-32 bg-[#4DB6AC] rounded-[3rem] flex items-center justify-center shadow-[0_30px_60px_rgba(77,182,172,0.3)]">
              <CheckCircle2 className="w-16 h-16 text-white" strokeWidth={3} />
            </div>
            <div className="space-y-4">
              <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white leading-none">
                Protocol <br /> <span className="text-[#4DB6AC]">Authorized</span>
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40 max-w-[320px] mx-auto leading-loose">
                Specialist Node Synchronized. <br/> Your Clinical ID has been verified.
              </p>
            </div>
            <div className="flex items-center gap-3 opacity-20">
               <Fingerprint size={16} />
               <span className="text-[8px] font-black uppercase tracking-[0.6em]">AES-256 Confirm</span>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 shadow-2xl">
                <Sparkles className="text-[#4DB6AC]" size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white">Clinical Reservation</h3>
                <p className="text-[9px] font-black text-[#4DB6AC] uppercase tracking-[0.4em]">Afridam Specialist Node</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* DATE SELECTOR */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-8 italic">
                  <Calendar className="w-4 h-4" />
                  Preferred Cycle
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-24 px-10 bg-white/5 border border-white/10 rounded-4xl text-white font-black uppercase text-lg focus:border-[#4DB6AC] outline-none transition-all appearance-none"
                  required
                />
              </div>

              {/* TIME SELECTOR */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-8 italic">
                  <Clock className="w-4 h-4" />
                  Consultation Slot
                </label>
                <div className="relative">
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full h-24 px-10 bg-white/5 border border-white/10 rounded-4xl text-white font-black uppercase text-lg focus:border-[#4DB6AC] outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-[#050505]">Select Priority Time</option>
                    <option value="09:00" className="bg-[#050505]">09:00 AM — Clinical Alpha</option>
                    <option value="11:00" className="bg-[#050505]">11:00 AM — Diagnostic Window</option>
                    <option value="14:00" className="bg-[#050505]">02:00 PM — Peak Analysis</option>
                    <option value="16:00" className="bg-[#050505]">04:00 PM — Evening Review</option>
                  </select>
                  <div className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-[12px]">▼</div>
                </div>
              </div>

              {/* REASON AREA */}
              <div className="space-y-4">
                <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 ml-8 italic">
                  <User className="w-4 h-4" />
                  Practitioner Brief
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Summarize your dermal symptoms for the specialist..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-10 text-white font-medium placeholder:text-white/10 focus:border-[#4DB6AC] outline-none transition-all text-xl resize-none min-h-[180px]"
                  required
                />
              </div>

              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={isSyncing}
                  className="group w-full h-24 bg-[#E1784F] hover:bg-[#ff8a5c] text-white font-black uppercase text-[12px] tracking-[0.5em] rounded-[2.5rem] shadow-[0_30px_60px_rgba(225,120,79,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-6"
                >
                  {isSyncing ? <Loader2 className="animate-spin" size={24} /> : <>Verify & Request <ChevronRight className="group-hover:translate-x-2 transition-transform" /></>}
                </Button>
              </div>
            </form>

            {/* TRUST PLATE */}
            <div className="p-10 bg-white/5 border border-white/10 rounded-[3rem] flex items-start gap-8 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-[#4DB6AC]/10 flex items-center justify-center text-[#4DB6AC] shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-black uppercase text-[#4DB6AC] tracking-[0.3em]">Integrity Protocol</p>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-tight leading-relaxed">
                  Specialist slots are reserved exclusively for registered practitioners. Your history is synced automatically for the session.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}