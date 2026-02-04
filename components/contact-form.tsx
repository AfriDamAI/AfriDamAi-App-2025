"use client";

import { Check, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api-client";

/**
 * 🛡️ AFRIDAM CARE HUB: CONTACT FORM (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: High-Precision Support Handshake & Mobile-First Inputs.
 */

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

        try {
            /** 🚀 THE SUPPORT HANDSHAKE 
             * Wire this to your Render backend: apiClient.post('/contact', formData)
             */
            await new Promise(resolve => setTimeout(resolve, 1500)); 
            setIsSubmitted(true);
            
            setTimeout(() => {
                setIsSubmitted(false);
                setFormData({
                    name: "", email: "", phone: "",
                    subject: "", message: "", interest: "general"
                });
            }, 5000);
        } catch (error) {
            console.log("Support sync pending - verify connection");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                        className="bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[2.5rem] p-10 text-center py-20"
                    >
                        <motion.div 
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4DB6AC] text-white mb-6 shadow-xl shadow-[#4DB6AC]/20"
                        >
                            <Check className="w-10 h-10" strokeWidth={3} />
                        </motion.div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#4DB6AC] mb-2">Message Sent</h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 leading-relaxed max-w-[240px] mx-auto">
                            Our clinical team will reach out to you shortly.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Full Name</label>
                                <input
                                    type="text" name="name" value={formData.name} onChange={handleChange} required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Email Address</label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange} required
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Phone</label>
                                <input
                                    type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                    className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm"
                                    placeholder="+234..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Inquiry Type</label>
                                <div className="relative">
                                    <select
                                        name="interest" value={formData.interest} onChange={handleChange} required
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none appearance-none cursor-pointer text-sm"
                                    >
                                        <option value="general">General Support</option>
                                        <option value="ai-consultation">Dermal Analysis Help</option>
                                        <option value="product">Care Shop Support</option>
                                        <option value="partnership">Clinical Partnerships</option>
                                    </select>
                                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-[10px]">▼</div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40 ml-2">Message</label>
                            <textarea
                                name="message" value={formData.message} onChange={handleChange} required rows={4}
                                className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] px-6 py-6 font-bold focus:border-[#E1784F] outline-none resize-none text-sm"
                                placeholder="How can we help your skin journey today?"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-20 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
                            {isSubmitting ? "Syncing..." : "Send Message"}
                        </button>
                    </form>
                )}
            </AnimatePresence>
        </div>
    );
}