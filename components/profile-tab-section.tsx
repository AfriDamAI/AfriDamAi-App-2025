/**
 * 🛡️ AFRIDAM WELLNESS HUB: TAB SECTION
 * Version: 2026.1.4 (Soft & Relatable)
 * Handshake: Ready for Dashboard Integration
 */

"use client"

import React, { useState } from "react"
import { Clock, AlertCircle, Sun, Droplets, MessageSquare, ArrowRight } from "lucide-react"
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
            
            {/* 🧭 1. NAVIGATION TABS */}
            <div className="flex border-b border-border bg-muted/10 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => onTabChange(tab)}
                        className={`flex-1 px-6 py-5 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab
                            ? "bg-background text-[#E1784F] border-b-2 border-[#E1784F]"
                            : "text-muted-foreground hover:text-foreground"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 🧬 2. CONTENT AREA */}
            <div className="p-6 md:p-10">
                <AnimatePresence mode="wait">
                    {activeTab === "Overview" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Wellness Journey</h3>
                            <p className="text-xs md:text-sm font-bold text-muted-foreground leading-relaxed uppercase tracking-tight">
                                Tracking your skin’s natural glow. Your history and AI scan results are saved here to help you find the best care for your family.
                            </p>
                        </motion.div>
                    )}

                    {activeTab === "Routine" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                            {/* Morning Care */}
                            <div>
                                <div className="flex items-center gap-3 mb-6 border-b border-border pb-3">
                                    <Sun className="text-[#E1784F]" size={16} />
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground italic">Morning Care</h4>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { name: "Gentle Cleanser", duration: "2 min", desc: "Refresh your skin" },
                                        { name: "Glow Serum", duration: "1 min", desc: "Daily protection" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex gap-4 p-4 bg-muted/30 rounded-2xl border border-border/50">
                                            <div className="w-8 h-8 rounded-lg bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F] font-black italic text-xs">{idx + 1}</div>
                                            <div className="flex-1">
                                                <p className="text-xs font-black uppercase italic tracking-tight">{item.name}</p>
                                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.desc}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-[8px] font-black text-[#4DB6AC] uppercase tracking-widest"><Clock size={10} /> {item.duration}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Vetted Care Items */}
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-4 flex items-center gap-2">
                                    <Droplets className="w-4 h-4 text-[#E1784F]" />
                                    Care Supplies
                                </h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {["Safe Cleanser", "Daily Sun Shield"].map((name) => (
                                        <div key={name} className="p-4 bg-card border border-border rounded-xl flex justify-between items-center group cursor-pointer hover:border-[#E1784F]/30 transition-all">
                                            <p className="text-[9px] font-black uppercase italic tracking-widest">{name}</p>
                                            <ArrowRight size={12} className="text-[#E1784F] group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "Appointment" && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground mb-6">Expert Care</h3>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                                            <input type="date" name="date" value={appointmentForm.date} onChange={handleAppointmentChange} className="auth-input w-full py-4" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Time</label>
                                            <select name="time" value={appointmentForm.time} onChange={handleAppointmentChange} className="auth-input w-full py-4">
                                                <option value="">Select Time</option>
                                                {timeSlots.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] font-black uppercase tracking-widest text-muted-foreground ml-1">Message</label>
                                        <textarea name="reason" value={appointmentForm.reason} onChange={handleAppointmentChange} rows={3} className="auth-input w-full resize-none py-4" placeholder="How can we help?" />
                                    </div>
                                    <button type="button" className="w-full py-5 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-lg">Book Session</button>
                                </form>

                                <div className="mt-6 p-5 bg-[#4DB6AC]/5 border border-[#4DB6AC]/10 rounded-xl flex gap-3">
                                    <AlertCircle className="w-4 h-4 text-[#4DB6AC] shrink-0" />
                                    <p className="text-[9px] font-bold text-[#4DB6AC] uppercase tracking-widest leading-relaxed">
                                        Our care team will review your wellness history and confirm within 24 hours.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 📝 3. PERSONAL NOTES */}
            <div className="border-t border-border p-6 md:p-10 bg-muted/10">
                <div className="flex items-center gap-3 mb-4">
                    <MessageSquare className="text-[#E1784F]" size={16} />
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground italic">Care Notes</h3>
                </div>
                <div className="space-y-4">
                    <textarea
                        value={comment}
                        onChange={(e) => onCommentChange(e.target.value)}
                        placeholder="How does your skin feel today?"
                        className="auth-input w-full h-28 resize-none py-4"
                    />
                    <button onClick={onSubmitComment} className="w-full md:w-auto px-10 py-4 bg-foreground text-background rounded-xl font-black uppercase text-[9px] tracking-widest shadow-md">
                        Save Notes
                    </button>
                </div>
            </div>
        </div>
    )
}