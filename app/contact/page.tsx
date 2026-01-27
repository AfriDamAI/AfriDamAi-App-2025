"use client"

import { Mail, MapPin, Phone, ChevronLeft, HeartPulse, Microscope } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

/**
 * 🛡️ AFRIDAM CARE HUB: CONTACT (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: Mobile-First Outreach & Backend Handshake Readiness.
 */

export default function ContactPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 selection:bg-[#E1784F]/30 overflow-x-hidden text-left">

            {/* 1. HERO SECTION - CINEMATIC GLOW */}
            <section className="relative py-20 lg:py-32 overflow-hidden bg-[#1C1A19]">
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E1784F]/20 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#4DB6AC]/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.3em] mb-10 hover:brightness-110 transition-all bg-white/5 backdrop-blur-md px-5 py-3 rounded-full border border-white/10 active:scale-95"
                    >
                        <ChevronLeft size={14} /> Back to Home
                    </button>

                    <div className="space-y-6">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E1784F] text-white shadow-xl mb-2"
                        >
                            <HeartPulse className="w-8 h-8" />
                        </motion.div>
                        <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                            Care <br /> <span className="text-[#E1784F]">Hub</span>
                        </h1>
                        <p className="text-lg md:text-xl max-w-2xl font-bold uppercase tracking-tight text-gray-400">
                            Need help with a scan? We’re here to support you and your family.
                        </p>
                    </div>
                </div>
            </section>

            {/* 2. STATS BANNER - MOBILE GRID */}
            <section className="bg-gray-50 dark:bg-white/5 border-y border-black/5 dark:border-white/10 py-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Available", val: "24/7" },
                        { label: "African Data", val: "100%" },
                        { label: "Response", val: "FAST" },
                        { label: "Care Status", val: "Vetted" }
                    ].map((stat, i) => (
                        <div key={i} className="text-left">
                            <p className="text-2xl md:text-3xl font-black italic text-[#E1784F] uppercase leading-none">{stat.val}</p>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. MAIN CONTENT */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">

                    {/* MESSAGE CARD */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white dark:bg-white/5 p-8 md:p-12 rounded-[3rem] border border-black/5 dark:border-white/10 shadow-2xl relative"
                    >
                        <div className="mb-10">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Send Message</h2>
                            <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.2em]">Our team will get back to you shortly</p>
                        </div>
                        <ContactForm />
                    </motion.div>

                    {/* CONTACT INFO */}
                    <div className="space-y-12">
                        <div className="grid gap-10">
                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-[#4DB6AC]/10 rounded-xl border border-[#4DB6AC]/20 flex items-center justify-center text-[#4DB6AC]">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest mb-1 text-[#4DB6AC]">Headquarters</h3>
                                    <p className="text-xl font-black italic uppercase">Lagos, Nigeria</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-[#E1784F]/10 rounded-xl border border-[#E1784F]/20 flex items-center justify-center text-[#E1784F]">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest mb-1 text-[#E1784F]">Call or WhatsApp</h3>
                                    <a href="tel:+2349025643150" className="text-xl font-black italic uppercase hover:text-[#E1784F] transition-colors">
                                        +234 902 564 3150
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="w-14 h-14 bg-gray-100 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10 flex items-center justify-center">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest mb-1 opacity-40">Email</h3>
                                    <a href="mailto:hello@afridamai.com" className="text-xl font-black italic uppercase hover:text-[#4DB6AC] transition-all">
                                        hello@afridamai.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* WHY AFRIDAM CARD */}
                        <div className="bg-gradient-to-br from-[#4DB6AC]/10 to-transparent rounded-[2.5rem] p-10 border border-[#4DB6AC]/20 relative overflow-hidden shadow-lg group">
                            <Microscope className="absolute bottom-[-10px] right-[-10px] w-32 h-32 text-[#4DB6AC]/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-[#4DB6AC] text-xl font-black italic uppercase">The Mission</h3>
                                <p className="text-xs font-bold uppercase tracking-tight opacity-60 leading-relaxed">
                                    Global tools are often biased. We are building the first AI trained purely on African skin to give you answers you can trust.
                                </p>
                                <button
                                    onClick={() => router.push('/ai-scanner')}
                                    className="bg-black dark:bg-white text-white dark:text-black px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#4DB6AC] hover:text-white transition-all shadow-xl active:scale-95"
                                >
                                    Launch Scanner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}