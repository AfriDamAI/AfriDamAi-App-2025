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
                        className="bg-[#4DB6AC]/10 border border-[#4DB6AC]/30 rounded-[2.5rem] p-8 md:p-12 text-center py-16 md:py-24"
                    >
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#4DB6AC] text-black mb-6 shadow-xl">
                            <Check className="w-8 h-8 md:w-10 md:h-10" />
                        </div>
                        {/* SIMPLE WORDING: Replaced Transmission Received */}
                        <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-[#4DB6AC] mb-2">Message Sent!</h3>
                        <p className="text-foreground/70 font-bold uppercase text-[9px] tracking-widest leading-loose">
                            Thank you for reaching out. <br /> Our team will get back to you shortly.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            {/* FULL NAME */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="block text-foreground font-black uppercase text-[9px] tracking-[0.2em] ml-1">
                                    Your Full Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-2 border-border rounded-xl md:rounded-2xl px-5 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base"
                                    placeholder="Adebayo Ojo"
                                />
                            </div>

                            {/* EMAIL */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-foreground font-black uppercase text-[9px] tracking-[0.2em] ml-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-background border-2 border-border rounded-xl md:rounded-2xl px-5 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base"
                                    placeholder="bayoj@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                            {/* PHONE */}
                            <div className="space-y-2">
                                <label htmlFor="phone" className="block text-foreground font-black uppercase text-[9px] tracking-[0.2em] ml-1">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-background border-2 border-border rounded-xl md:rounded-2xl px-5 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base"
                                    placeholder="+234 000 000 0000"
                                />
                            </div>

                            {/* CATEGORY - SIMPLIFIED */}
                            <div className="space-y-2">
                                <label htmlFor="interest" className="block text-foreground font-black uppercase text-[9px] tracking-[0.2em] ml-1">
                                    How can we help? *
                                </label>
                                <div className="relative">
                                    <select
                                        id="interest"
                                        name="interest"
                                        value={formData.interest}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-background border-2 border-border rounded-xl md:rounded-2xl px-5 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all appearance-none cursor-pointer text-base"
                                    >
                                        <option value="general">General Question</option>
                                        <option value="ai-consultation">Help with Skin Scan</option>
                                        <option value="product">Product & Shop Help</option>
                                        <option value="partnership">Business & Partnerships</option>
                                        <option value="support">Report a Problem</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-xs">▼</div>
                                </div>
                            </div>
                        </div>

                        {/* SUBJECT */}
                        <div className="space-y-2">
                            <label htmlFor="subject" className="block text-foreground font-black uppercase text-[9px] tracking-[0.2em] ml-1">
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full bg-background border-2 border-border rounded-xl md:rounded-2xl px-5 py-4 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all text-base"
                                placeholder="What is this about?"
                            />
                        </div>

                        {/* MESSAGE */}
                        <div className="space-y-2">
                            <label htmlFor="message" className="block text-foreground font-black uppercase text-[9px] tracking-[0.2em] ml-1">
                                Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full bg-background border-2 border-border rounded-2xl md:rounded-[2rem] px-5 py-5 text-foreground font-bold focus:border-[#E1784F] outline-none transition-all resize-none text-base"
                                placeholder="Write your message here..."
                            />
                        </div>

                        {/* 🚀 THE BUTTON: Replaced Send Transmission */}
                        <button
                            type="submit"
                            className="w-full bg-[#E1784F] hover:bg-[#C55A32] text-white py-5 md:py-6 rounded-xl md:rounded-2xl transition-all flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.3em] shadow-xl active:scale-[0.98]"
                        >
                            <Send className="w-4 h-4" />
                            Send Message
                        </button>
                    </form>
                )}
            </AnimatePresence>
        </div>
    );
}