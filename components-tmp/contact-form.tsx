"use client";

import { Check, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        interest: "general"
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // 🛡️ RE-ENFORCED: Standard Clinical Handshake Simulation
        // In production, wire this to your /api/contact endpoint
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsSubmitted(true);
            
            // Auto-reset form after success message duration
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                    interest: "general"
                });
            }, 4000);
        } catch (error) {
            console.error("Clinical Support Sync Failed:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="relative text-left">
            <AnimatePresence mode="wait">
                {isSubmitted ? (
                    <motion.div 
                        key="success"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-[#4DB6AC]/10 border border-[#4DB6AC]/30 rounded-[2.5rem] p-8 md:p-12 text-center py-16 md:py-24"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#4DB6AC] text-black mb-6 shadow-xl shadow-[#4DB6AC]/20">
                            <Check className="w-8 h-8 md:w-10 md:h-10" strokeWidth={3} />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#4DB6AC] mb-2">Message Sent!</h3>
                        <p className="text-foreground/70 font-bold uppercase text-[9px] tracking-[0.4em] leading-loose max-w-[280px] mx-auto">
                            Thank you for reaching out. <br /> Our clinical team will respond shortly.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            {/* FULL NAME */}
                            <div className="space-y-3">
                                <label htmlFor="name" className="block text-foreground font-black uppercase text-[9px] tracking-[0.3em] ml-2">
                                    Your Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base placeholder:text-muted-foreground/30"
                                    placeholder="Adebayo Ojo"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-foreground font-black uppercase text-[9px] tracking-[0.3em] ml-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base placeholder:text-muted-foreground/30"
                                    placeholder="bayoj@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            {/* PHONE */}
                            <div className="space-y-3">
                                <label htmlFor="phone" className="block text-foreground font-black uppercase text-[9px] tracking-[0.3em] ml-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base placeholder:text-muted-foreground/30"
                                    placeholder="+234..."
                                />
                            </div>

                            {/* CATEGORY */}
                            <div className="space-y-3">
                                <label htmlFor="interest" className="block text-foreground font-black uppercase text-[9px] tracking-[0.3em] ml-2">
                                    Inquiry Category *
                                </label>
                                <div className="relative">
                                    <select
                                        id="interest"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all appearance-none cursor-pointer text-base"
                                    >
                                        <option value="general">General Question</option>
                                        <option value="ai-consultation">Help with Skin Scan</option>
                                        <option value="product">Product & Shop Help</option>
                                        <option value="partnership">Business & Partnerships</option>
                                        <option value="support">Report a Problem</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-30 text-[10px]">▼</div>
                                </div>
                            </div>
                        </div>

                        {/* SUBJECT */}
                        <div className="space-y-3">
                            <label htmlFor="subject" className="block text-foreground font-black uppercase text-[9px] tracking-[0.3em] ml-2">
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border-2 border-border rounded-2xl px-6 py-5 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base placeholder:text-muted-foreground/30"
                                placeholder="Topic of discussion"
                            />
                        </div>

                        {/* MESSAGE */}
                        <div className="space-y-3">
                            <label htmlFor="message" className="block text-foreground font-black uppercase text-[9px] tracking-[0.3em] ml-2">
                                Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-background border-2 border-border rounded-[2rem] px-6 py-6 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all resize-none text-base placeholder:text-muted-foreground/30"
                                placeholder="Write your clinical or support query here..."
                            />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={isSubmitting || isSubmitted}
                            className="w-full h-20 bg-[#E1784F] hover:bg-[#C55A32] text-white rounded-2xl transition-all flex items-center justify-center gap-4 font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-[#E1784F]/20 active:scale-[0.97] disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                            {isSubmitting ? "Syncing..." : "Send Message"}
                        </button>
                    </form>
                )}
            </AnimatePresence>
        </div>
    );
}