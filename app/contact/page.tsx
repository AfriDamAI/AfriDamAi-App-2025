"use client"

import { Mail, MapPin, Phone, Sparkles, ChevronLeft, Clock, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ContactPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-[#E1784F]/30">
            {/* 1. HERO SECTION WITH CLEAR CONTRAST */}
            <div className="relative py-24 lg:py-36 overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src="/Save.jpg"
                        alt="Skincare background"
                        fill
                        className="w-full h-full object-cover opacity-20 dark:opacity-40 grayscale"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <button 
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.4em] mb-12 hover:brightness-110 transition-all bg-background/50 backdrop-blur-md px-4 py-2 rounded-full border border-border"
                    >
                        <ChevronLeft size={14} /> Back to Home
                    </button>
                    
                    <div className="space-y-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-[#E1784F] text-white shadow-2xl shadow-[#E1784F]/20 mb-4">
                            <Mail className="w-10 h-10" />
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">
                            Get in <span className="text-[#E1784F]">Touch</span>
                        </h1>
                        <p className="text-muted-foreground max-w-2xl font-bold text-lg md:text-xl leading-relaxed uppercase tracking-tight">
                            Questions about our Instant AI Analysis? We're the clinical bridge for melanin-rich skin health.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. REALISTIC & EXCITING STATS BANNER */}
            <div className="bg-muted border-y border-border py-12">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Precision Rate", val: "98.4%" },
                        { label: "AI Availability", val: "24/7" },
                        { label: "Expert Network", val: "Verified" },
                        { label: "Ingredients Vetted", val: "100%" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <p className="text-3xl font-black italic text-[#E1784F] uppercase">{stat.val}</p>
                            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. MAIN CONTENT: FORM & NIGERIA INFO */}
            <div className="max-w-7xl mx-auto px-6 py-24">
                <div className="grid lg:grid-cols-2 gap-24 items-start">
                    
                    {/* Form Section - Clean & High Contrast */}
                    <div className="bg-card p-8 md:p-14 rounded-[4rem] border border-border shadow-2xl">
                        <div className="mb-10">
                            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Send a Message</h2>
                            <p className="text-muted-foreground text-sm font-bold uppercase tracking-widest">Typical response time: &lt; 24 Hours</p>
                        </div>
                        <ContactForm />
                    </div>

                    {/* Info Section - Lagos, Nigeria */}
                    <div className="space-y-16">
                        <div className="grid gap-12">
                            {/* ADDRESS - UPDATED TO LAGOS */}
                            <div className="flex items-start gap-8 group">
                                <div className="flex-shrink-0 w-16 h-16 bg-[#4DB6AC]/10 rounded-2xl border border-[#4DB6AC]/20 flex items-center justify-center group-hover:bg-[#4DB6AC] group-hover:text-white transition-all duration-500 text-[#4DB6AC]">
                                    <MapPin className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-xs tracking-[0.3em] mb-3 text-[#4DB6AC]">Headquarters</h3>
                                    <p className="text-foreground text-lg leading-tight font-black italic uppercase tracking-tighter">
                                        Afridamai Technologies<br />
                                        Innovation Hub, Tech District<br />
                                        Lagos, Nigeria
                                    </p>
                                </div>
                            </div>

                            {/* PHONE - UPDATED TO NIGERIA */}
                            <div className="flex items-start gap-8 group">
                                <div className="flex-shrink-0 w-16 h-16 bg-[#E1784F]/10 rounded-2xl border border-[#E1784F]/20 flex items-center justify-center group-hover:bg-[#E1784F] group-hover:text-white transition-all duration-500 text-[#E1784F]">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-xs tracking-[0.3em] mb-3 text-[#E1784F]">Direct Line</h3>
                                    <a href="tel:+2349025643150" className="text-foreground text-xl leading-none font-black italic uppercase tracking-tighter hover:text-[#E1784F] transition-colors">
                                        +234 90 256 43150
                                    </a>
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div className="flex items-start gap-8 group">
                                <div className="flex-shrink-0 w-16 h-16 bg-muted rounded-2xl border border-border flex items-center justify-center group-hover:border-foreground transition-all duration-500 text-foreground">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-xs tracking-[0.3em] mb-3 text-muted-foreground">Electronic Mail</h3>
                                    <a href="mailto:info@afridamai.com" className="text-foreground text-xl leading-none font-black italic uppercase tracking-tighter hover:underline">
                                        info@afridamai.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* AI PROMO CARD - READABLE FONTS */}
                        <div className="bg-gradient-to-br from-[#4DB6AC]/20 to-transparent rounded-[3.5rem] p-12 border border-[#4DB6AC]/20 relative overflow-hidden group shadow-xl">
                            <ShieldCheck className="absolute top-[-20px] right-[-20px] w-40 h-40 text-[#4DB6AC]/10 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="text-[#4DB6AC] text-2xl font-black italic uppercase tracking-tight">AI-Powered Skincare</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed font-bold uppercase tracking-tight">
                                    Experience personalized skincare recommendations. Our technology analyzes melanin-rich skin types to suggest the perfect Marketplace solutions.
                                </p>
                                <button 
                                    onClick={() => router.push('/ai-scanner')}
                                    className="bg-foreground text-background px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-[#4DB6AC] hover:text-white transition-all"
                                >
                                    Launch AI Scanner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}