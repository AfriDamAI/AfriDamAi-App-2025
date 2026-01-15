"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'

export function AppointmentBooking() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    reason: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.date && formData.time && formData.reason) {
      setSubmitted(true)
      // 🚀 CEO LOGIC: This would hit the NestJS /appointments endpoint
      setTimeout(() => {
        setFormData({ date: "", time: "", reason: "" })
        setSubmitted(false)
      }, 5000)
    }
  }

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="py-12 flex flex-col items-center text-center space-y-6"
      >
        <div className="w-20 h-20 bg-[#4DB6AC]/20 rounded-full flex items-center justify-center border border-[#4DB6AC]/30 shadow-[0_0_40px_rgba(77,182,172,0.2)]">
          <CheckCircle2 className="w-10 h-10 text-[#4DB6AC]" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter">Request Received</h3>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground max-w-[240px] mx-auto leading-relaxed">
            Our clinical team is reviewing your timeline. Expect a confirmation via email.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-[#4DB6AC]">
        <Sparkles size={16} />
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Reserve Your Session</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-left">
        {/* DATE SELECTOR */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
            <Calendar className="w-3 h-3" />
            Preferred Date
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-[#4DB6AC] outline-none transition-all text-sm appearance-none"
            required
          />
        </div>

        {/* TIME SELECTOR */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
            <Clock className="w-3 h-3" />
            Clinical Slot
          </label>
          <div className="relative">
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full h-16 px-6 bg-white/5 border border-white/10 rounded-2xl text-white font-bold focus:border-[#4DB6AC] outline-none transition-all text-sm appearance-none cursor-pointer"
              required
            >
              <option value="" className="bg-[#0A0A0A]">Select a time</option>
              <option value="09:00" className="bg-[#0A0A0A]">09:00 AM (Early Glow)</option>
              <option value="11:00" className="bg-[#0A0A0A]">11:00 AM (Mid-Morning)</option>
              <option value="14:00" className="bg-[#0A0A0A]">02:00 PM (Afternoon)</option>
              <option value="16:00" className="bg-[#0A0A0A]">04:00 PM (Late Session)</option>
            </select>
            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">▼</div>
          </div>
        </div>

        {/* REASON AREA */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40 ml-4">
            <User className="w-3 h-3" />
            Health Concern
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            placeholder="Describe your skin concern..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white font-bold placeholder:text-white/10 focus:border-[#4DB6AC] outline-none transition-all text-sm resize-none"
            rows={3}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-16 bg-[#4DB6AC] hover:bg-[#3d9189] text-white font-black uppercase text-[11px] tracking-[0.3em] rounded-2xl shadow-2xl active:scale-95 transition-all"
        >
          Request Appointment
        </Button>
      </form>

      <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-4">
        <ShieldCheck className="text-[#4DB6AC] shrink-0" size={16} />
        <div className="space-y-1 text-left">
           <p className="text-[8px] font-black uppercase tracking-widest text-white/40 leading-relaxed">
             A licensed specialist will confirm your request via the email linked to your Care ID within 24 hours.
           </p>
        </div>
      </div>
    </div>
  )
}