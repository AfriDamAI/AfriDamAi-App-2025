"use client"

import React, { useState } from "react"
import { Clock, AlertCircle, Sun, Moon, Droplets, MessageSquare, Calendar, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface TabSectionProps {
    tabs: string[]
    activeTab: string
    onTabChange: (tab: string) => void
    comment: string
    onCommentChange: (comment: string) => void
    onSubmitComment: () => void
}

export default function TabSection({
    tabs,
    activeTab,
    onTabChange,
    comment,
    onCommentChange,
    onSubmitComment,
}: TabSectionProps) {
    const [appointmentForm, setAppointmentForm] = useState({
        date: "",
        time: "",
        reason: "",
    })

    const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"]

    const handleAppointmentChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target
        setAppointmentForm((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm text-left">
            {/* 🧭 1. RE-ENFORCED TABS: BOLD & ITALIC */}
            <div className="flex border-b border-border bg-muted/20 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 px-8 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab
                            ? "bg-background text-[#E1784F] border-b-2 border-[#E1784F]"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 🧬 2. TAB CONTENT */}
            <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                    {activeTab === "Overview" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Clinical Path</h3>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed uppercase tracking-tight">
                                Tracking your melanin vitality journey. Your treatment history and AI scan logs are indexed below for specialist review.
                            </p>
                        </motion.div>
                    )}

                    {activeTab === "Routine" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                            {/* Morning Protocol */}
                            <div>
                                <div className="flex items-center gap-3 mb-6 border-b border-border pb-3">
                                    <Sun className="text-[#E1784F]" size={18} />
                                    <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground italic">Morning Protocol</h4>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: "Gentle Cleanser", duration: "2 min", desc: "Remove overnight oils" },
                                        { name: "Vitamin C Serum", duration: "1 min", desc: "Melanin protection" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4 p-5 bg-muted/30 rounded-2xl border border-border/50">
                                            <div className="w-10 h-10 rounded-xl bg-[#E1784F]/10 border border-[#E1784F]/20 flex items-center justify-center text-[#E1784F] font-black italic text-xs">{idx + 1}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-black uppercase italic tracking-tight">{item.name}</p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.desc}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-[10px] font-black text-[#4DB6AC] uppercase tracking-widest"><Clock size={12} /> {item.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recommended Items */}
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-6 flex items-center gap-3">
                                    <Droplets className="w-4 h-4 text-[#E1784F]" />
                                    Vetted Supplies
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {["Cleanser", "SPF 50"].map((name) => (
                                        <div key={name} className="p-5 bg-card border border-border rounded-2xl flex justify-between items-center group cursor-pointer hover:border-[#E1784F]/30 transition-all">
                                            <p className="text-[10px] font-black uppercase italic tracking-widest">{name}</p>
                                            <ArrowRight size={14} className="text-[#E1784F] group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "Appointment" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground mb-8">Specialist Session</h3>
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Preferred Date</label>
                                            <input type="date" name="date" value={appointmentForm.date} onChange={handleAppointmentChange} className="auth-input w-full" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Time Slot</label>
                                            <select name="time" value={appointmentForm.time} onChange={handleAppointmentChange} className="auth-input w-full">
                                                <option value="">Select Time</option>
                                                {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Session Reason</label>
                                        <textarea name="reason" value={appointmentForm.reason} onChange={handleAppointmentChange} rows={4} className="auth-input w-full resize-none" placeholder="Clinical notes..." />
                                    </div>
                                    <button type="button" className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl active:scale-95 transition-all">Request Appointment</button>
                                </form>

                                <div className="mt-8 p-6 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-2xl flex gap-4">
                                    <AlertCircle className="w-5 h-5 text-[#4DB6AC] shrink-0" />
                                    <p className="text-[10px] font-bold text-[#4DB6AC] uppercase tracking-widest leading-relaxed">
                                        Verified specialists will review your clinical history and confirm within 24 hours.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 📝 3. PERSONAL NOTES SECTION */}
            <div className="border-t border-border p-8 md:p-10 bg-muted/20">
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="text-[#E1784F]" size={18} />
                    <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground italic">Dermal Notes</h3>
                </div>
                <div className="space-y-4">
                    <textarea
                        value={comment}
                        onChange={(e) => onCommentChange(e.target.value)}
                        placeholder="Log personal observations..."
                        className="auth-input w-full h-32 resize-none py-4"
                    />
                    <button onClick={onSubmitComment} className="w-full md:w-auto px-12 h-14 bg-foreground text-background dark:bg-white dark:text-black rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all shadow-lg">
                        Submit Logs
                    </button>
                </div>
            </div>
        </div>
    )
}