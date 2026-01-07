"use client";

import { Check, Send } from "lucide-react";
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
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
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
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {isSubmitted ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-[#4DB6AC]/10 border border-[#4DB6AC]/30 rounded-[2.5rem] p-12 text-center py-24"
                    >
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4DB6AC] text-black mb-6 shadow-xl">
                            <Check className="w-10 h-10" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#4DB6AC] mb-2">Transmission Received</h3>
                        <p className="text-foreground/70 font-bold uppercase text-[10px] tracking-widest">
                            Our clinical team will reach out within 24 hours.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* FULL NAME */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-foreground font-black uppercase text-[10px] tracking-[0.3em] ml-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="Adebayo Ojo"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-foreground font-black uppercase text-[10px] tracking-[0.3em] ml-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="bayoj@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* PHONE - NIGERIA FORMAT */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-foreground font-black uppercase text-[10px] tracking-[0.3em] ml-1">
                                    Phone Number (NG)
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all placeholder:text-muted-foreground/30"
                                    placeholder="+234 000 000 0000"
                                />
                            </div>

                            {/* INTEREST DROPDOWN */}
                            <div className="space-y-2">
                                <label htmlFor="interest" className="block text-foreground font-black uppercase text-[10px] tracking-[0.3em] ml-1">
                                    Inquiry Category *
                                </label>
                                <select
                                    id="interest"
                                    name="interest"
                                    value={formData.interest}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all appearance-none cursor-pointer"
                                >
                                    <option value="general">General Inquiry</option>
                                    <option value="ai-consultation">Instant AI Analysis Help</option>
                                    <option value="product">Marketplace Vetting</option>
                                    <option value="partnership">Partnership Opportunities</option>
                                    <option value="support">Technical Support</option>
                                </select>
                            </div>
                        </div>

                        {/* SUBJECT */}
                        <div className="space-y-2">
                            <label htmlFor="subject" className="block text-foreground font-black uppercase text-[10px] tracking-[0.3em] ml-1">
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border-2 border-border rounded-2xl px-6 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all placeholder:text-muted-foreground/30"
                                placeholder="How can our clinical team assist?"
                            />
                        </div>

                        {/* MESSAGE */}
                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-foreground font-black uppercase text-[10px] tracking-[0.3em] ml-1">
                                Detailed Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={5}
                                className="w-full bg-background border-2 border-border rounded-[2rem] px-6 py-5 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all resize-none placeholder:text-muted-foreground/30"
                                placeholder="Describe your inquiry in detail..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#E1784F] hover:bg-[#C55A32] text-white py-6 rounded-2xl transition-all flex items-center justify-center gap-4 font-black uppercase text-xs tracking-[0.4em] shadow-2xl shadow-[#E1784F]/20 active:scale-[0.98]"
                        >
                            <Send className="w-5 h-5" />
                            Send Transmission
                        </button>
                    </form>
                )}
            </AnimatePresence>
        </div>
    );
}