"use client"

import { Mail, MapPin, Phone, ChevronLeft, HeartPulse, Microscope } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { useRouter } from "next/navigation";

export default function ContactPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-[#E1784F]/30 overflow-x-hidden">
            
            {/* 1. HERO SECTION - CLEAN & STYLISH (No Broken Images) */}
            <div className="relative py-20 lg:py-32 overflow-hidden bg-[#1C1A19]">
                {/* 🛡️ BACKGROUND GLOW: Replaces the broken /Save.jpg */}
                <div className="absolute inset-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#E1784F]/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-[#4DB6AC]/10 blur-[120px] rounded-full" />
                </div>

                <div className="relative max-w-7xl mx-auto px-6">
                    <button 
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.3em] mb-10 hover:brightness-110 transition-all bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                    >
                        <ChevronLeft size={14} /> Back to Home
                    </button>
                    
                    <div className="space-y-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#E1784F] text-white shadow-xl mb-2">
                            <HeartPulse className="w-8 h-8" />
                        </div>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
                            AfriDam <span className="text-[#E1784F]">Care Hub</span>
                        </h1>
                        <p className={`text-lg md:text-xl max-w-2xl font-bold uppercase tracking-tight text-gray-400`}>
                            Need help with a scan or have questions? We’re here to support you and your family.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. STATS BANNER */}
            <div className="bg-muted border-y border-border py-10">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: "Available", val: "24/7" },
                        { label: "African Data", val: "100%" },
                        { label: "Response", val: "FAST" },
                        { label: "Care Status", val: "Vetted" }
                    ].map((stat, i) => (
                        <div key={i} className="text-center md:text-left">
                            <p className="text-2xl md:text-3xl font-black italic text-[#E1784F] uppercase">{stat.val}</p>
                            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16 md:gap-24 items-start">
                    
                    {/* Message Card */}
                    <div className="bg-card p-6 md:p-12 rounded-[2.5rem] md:rounded-[4rem] border border-border shadow-2xl relative">
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-2">Send a Message</h2>
                            <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.2em]">Our team will get back to you shortly</p>
                        </div>
                        <ContactForm />
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="grid gap-10">
                            {/* LOCATION */}
                            <div className="flex items-start gap-6 group">
                                <div className="flex-shrink-0 w-14 h-14 bg-[#4DB6AC]/10 rounded-xl border border-[#4DB6AC]/20 flex items-center justify-center text-[#4DB6AC]">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest mb-2 text-[#4DB6AC]">Headquarters</h3>
                                    <p className="text-foreground text-lg font-black italic uppercase leading-tight">
                                        Lagos, Nigeria
                                    </p>
                                </div>
                            </div>

                            {/* PHONE */}
                            <div className="flex items-start gap-6 group">
                                <div className="flex-shrink-0 w-14 h-14 bg-[#E1784F]/10 rounded-xl border border-[#E1784F]/20 flex items-center justify-center text-[#E1784F]">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest mb-2 text-[#E1784F]">Call or WhatsApp</h3>
                                    <a href="tel:+2349025643150" className="text-foreground text-xl font-black italic uppercase hover:text-[#E1784F] transition-colors">
                                        +234 902 564 3150
                                    </a>
                                </div>
                            </div>

                            {/* EMAIL */}
                            <div className="flex items-start gap-6 group">
                                <div className="flex-shrink-0 w-14 h-14 bg-muted rounded-xl border border-border flex items-center justify-center">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest mb-2 text-muted-foreground">Email</h3>
                                    <a href="mailto:hello@afridamai.com" className="text-foreground text-xl font-black italic uppercase hover:underline">
                                        hello@afridamai.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* WHY AFRIDAM CARD */}
                        <div className="bg-gradient-to-br from-[#4DB6AC]/10 to-transparent rounded-[2.5rem] p-10 border border-[#4DB6AC]/20 relative overflow-hidden shadow-lg">
                            <Microscope className="absolute bottom-[-10px] right-[-10px] w-32 h-32 text-[#4DB6AC]/5 -rotate-12" />
                            <div className="relative z-10 space-y-4">
                                <h3 className="text-[#4DB6AC] text-xl font-black italic uppercase">Why AfriDam?</h3>
                                <p className="text-muted-foreground text-xs leading-relaxed font-bold uppercase tracking-tight">
                                    Global tools are often biased against melanin. We are building the first AI trained purely on African skin to give you answers you can trust.
                                </p>
                                <button 
                                    onClick={() => router.push('/ai-scanner')}
                                    className="bg-foreground text-background px-8 py-4 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-[#4DB6AC] hover:text-white transition-all"
                                >
                                    Launch Scanner
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}