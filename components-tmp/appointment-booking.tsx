"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react'

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
      
      // 🛡️ CEO LOGIC: Simulating the secure handshake with your NestJS backend
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        setSubmitted(true)
        
        setTimeout(() => {
          setFormData({ date: "", time: "", reason: "" })
          setSubmitted(false)
        }, 5000)
      } finally {
        setIsSyncing(false)
      }
    }
  }

  return (
    <div className="space-y-8 text-left">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-16 flex flex-col items-center text-center space-y-8"
          >
            <div className="w-24 h-24 bg-[#4DB6AC]/10 rounded-full flex items-center justify-center border border-[#4DB6AC]/30 shadow-[0_0_50px_rgba(77,182,172,0.1)]">
              <CheckCircle2 className="w-12 h-12 text-[#4DB6AC]" strokeWidth={2.5} />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">Request Sent</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 max-w-[260px] mx-auto leading-relaxed">
                Specialist Node Synchronized. <br/> Check your Care ID email for confirmation.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
            <div className="flex items-center gap-4 text-[#4DB6AC]">
              <div className="w-10 h-10 rounded-xl bg-[#4DB6AC]/10 flex items-center justify-center border border-[#4DB6AC]/20">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Specialist Node</p>
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest">Reserve Your Clinical Slot</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DATE SELECTOR */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ml-4 italic">
                  <Calendar className="w-3 h-3" />
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full h-18 px-8 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase text-xs focus:border-[#4DB6AC] outline-none transition-all appearance-none"
                  required
                />
              </div>

              {/* TIME SELECTOR */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ml-4 italic">
                  <Clock className="w-3 h-3" />
                  Clinical Slot
                </label>
                <div className="relative">
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full h-18 px-8 bg-white/5 border border-white/10 rounded-2xl text-white font-black uppercase text-xs focus:border-[#4DB6AC] outline-none transition-all appearance-none cursor-pointer"
                    required
                  >
                    <option value="" className="bg-[#1C1A19]">Select Time</option>
                    <option value="09:00" className="bg-[#1C1A19]">09:00 AM — Early Glow</option>
                    <option value="11:00" className="bg-[#1C1A19]">11:00 AM — Mid-Morning</option>
                    <option value="14:00" className="bg-[#1C1A19]">02:00 PM — Afternoon</option>
                    <option value="16:00" className="bg-[#1C1A19]">04:00 PM — Late Session</option>
                  </select>
                  <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-[10px]">▼</div>
                </div>
              </div>

              {/* REASON AREA */}
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 ml-4 italic">
                  <User className="w-3 h-3" />
                  Consultation Notes
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Describe your current skin symptoms..."
                  className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-8 text-white font-bold placeholder:text-white/10 focus:border-[#4DB6AC] outline-none transition-all text-sm resize-none min-h-[140px]"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSyncing}
                className="w-full h-20 bg-[#4DB6AC] hover:bg-[#3d9189] text-white font-black uppercase text-[11px] tracking-[0.4em] rounded-[1.5rem] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSyncing ? <Loader2 className="animate-spin" size={20} /> : "Request Appointment"}
              </Button>
            </form>

            <div className="p-8 bg-[#4DB6AC]/5 border border-[#4DB6AC]/10 rounded-[2rem] flex items-start gap-5">
              <ShieldCheck className="text-[#4DB6AC] shrink-0 mt-1" size={20} />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-[#4DB6AC] tracking-widest">Safety Protocol</p>
                <p className="text-[9px] font-bold text-white/30 uppercase tracking-tight leading-relaxed">
                  A licensed specialist will verify your request against your care history. Confirmation typically arrives within 24 neural hours.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}