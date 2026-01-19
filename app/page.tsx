/**
 * 🛡️ AFRIDAM WELLNESS HUB: LANDING PAGE
 * Version: 2026.1.2 (World-Class Entry Refactor)
 * Focus: High-End Ambiance, Persistent Auth, Heritage Sync.
 */

"use client"

import React, { useState, useEffect } from "react"
import { 
  Camera, ArrowRight, Sun, Moon, Search, MapPin, Mail, Heart, Menu, X, ShoppingBag, ShieldCheck, Lock
} from "lucide-react"
import { AuthModals } from "@/components/auth-modals"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup">("signup");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openAuth = (type: "signin" | "signup") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleFeatureAccess = (path: string) => {
    if (user) router.push(path);
    else openAuth("signup");
  };

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 selection:bg-[#E1784F]/30 relative overflow-x-hidden">
      
      {/* 🌍 1. CLINICAL BANNER */}
      <div className="bg-black dark:bg-white py-3 text-center border-b border-white/10 fixed top-0 left-0 right-0 z-[110]">
        <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.5em] text-white dark:text-black px-4">
          PREMIUM CLINICAL INTELLIGENCE • MELANIN-FIRST PROTOCOLS
        </p>
      </div>

      {/* 🧭 2. NAVIGATION (WORLD-CLASS SYNC) */}
      <nav className={`fixed top-12 left-0 right-0 z-[100] transition-all duration-500 px-6 ${
        scrolled ? 'bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl py-4 shadow-2xl' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 active:scale-95 transition-transform">
            <img src="/logo.png" alt="AfriDam AI" className={`h-8 md:h-12 w-auto object-contain ${isDark ? '' : 'invert'}`} />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-12">
            <div className="flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] opacity-40">
               <Link href="/mission" className="hover:text-[#E1784F] hover:opacity-100 transition-all">Manifesto</Link>
               <Link href="/marketplace" className="hover:text-[#E1784F] hover:opacity-100 transition-all">Shop</Link>
               <Link href="/pricing" className="hover:text-[#E1784F] hover:opacity-100 transition-all">Pricing</Link>
            </div>
            
            <div className="flex items-center gap-4">
               <button onClick={toggleTheme} className="p-3 text-black dark:text-white opacity-40 hover:opacity-100 transition-all">
                 {isDark ? <Sun size={18} /> : <Moon size={18} />}
               </button>

               {user ? (
                 <Link href="/dashboard" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">Dashboard</Link>
               ) : (
                 <div className="flex items-center gap-4">
                    <button onClick={() => openAuth("signin")} className="px-6 py-4 text-black dark:text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-2">
                       <Lock size={14} /> Login
                    </button>
                    <button onClick={() => openAuth("signup")} className="px-8 py-4 bg-[#E1784F] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl">Sign Up</button>
                 </div>
               )}
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 bg-gray-100 dark:bg-white/5 rounded-2xl">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative pt-48 md:pt-64 pb-24 px-6 overflow-hidden">
        {/* Cinematic Background Orbs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E1784F]/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#4DB6AC]/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-12 items-center gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-12">
            <div className="inline-flex items-center gap-3 bg-gray-100 dark:bg-white/5 px-4 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#E1784F] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Clinical Wellness System</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl lg:text-[11rem] font-black leading-[0.8] tracking-[-0.05em] uppercase italic">
              Protect Your <br /> <span className="text-[#E1784F]">Natural</span> <br /> <span className="text-[#4DB6AC]">Glow.</span>
            </h1>
            
            <p className="text-xl md:text-2xl font-medium max-w-xl opacity-40 uppercase tracking-tighter leading-tight">
              A high-precision skin intelligence platform engineered to support the health of African mothers and children.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
                <button onClick={() => handleFeatureAccess("/ai-scanner")} className="group px-12 py-7 bg-black dark:bg-white text-white dark:text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-4 hover:bg-[#E1784F] hover:text-white">
                    Start AI Scan <ArrowRight className="group-hover:translate-x-3 transition-transform" />
                </button>
                {!user && (
                    <button onClick={() => openAuth("signin")} className="px-10 py-7 bg-gray-100 dark:bg-white/5 rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] flex items-center justify-center gap-3 border border-gray-200 dark:border-white/10">
                        Login to Portal
                    </button>
                )}
            </div>
          </motion.div>

          <div className="lg:col-span-5 relative">
             <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-[10px] border-white dark:border-[#1A1A1A] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] bg-gray-100">
                <img src="/model-hero.JPG" alt="AfriDam Excellence" className="w-full h-full object-cover" />
                <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-[2px] bg-[#E1784F] shadow-[0_0_20px_#E1784F] z-20" />
                
                <div className="absolute inset-x-8 bottom-8 p-8 bg-black/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-[#4DB6AC] rounded-3xl flex items-center justify-center text-white shadow-2xl">
                        <Camera size={28} />
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Neural Analysis Active</p>
                        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 5, repeat: Infinity }} className="h-full bg-[#4DB6AC]" />
                        </div>
                    </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. STATS BAR */}
      <section className="py-24 border-y border-gray-100 dark:border-white/5">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { label: "Availability", val: "24/7" }, 
            { label: "Melanin Accuracy", val: "100%" }, 
            { label: "Clinical Level", val: "NURSE-LED" }, 
            { label: "Family Focused", val: "SECURE" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2 text-center">
              <p className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#E1784F] uppercase leading-none">{stat.val}</p>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. HERITAGE MANIFESTO (RELOCATED) */}
      <section className="py-32 md:py-56 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center space-y-16">
          <div className="w-[1px] h-32 bg-gradient-to-b from-[#E1784F] to-transparent opacity-30" />
          <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] max-w-5xl">
            "AfriDam is a tribute to <span className="text-[#4DB6AC]">African Heritage</span>—built by our people, to protect the skin wellness of <span className="text-[#E1784F]">our families</span>."
          </h2>
          <div className="flex items-center gap-4 opacity-40">
             <Heart size={20} className="text-[#E1784F]" />
             <p className="text-[12px] font-black uppercase tracking-[0.6em]">A Founder's Promise</p>
          </div>
        </div>
      </section>

      {/* 6. FEATURES */}
      <section id="features" className="py-32 md:py-48 px-6 bg-gray-50 dark:bg-white/5 border-y border-gray-100 dark:border-white/10">
        <div className="max-w-screen-xl mx-auto space-y-24">
          <div className="space-y-6">
             <span className="text-[#E1784F] text-[11px] font-black uppercase tracking-[0.6em]">Core Protocols</span>
             <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Diagnostic <br/>Solutions.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: "Dermal Scan", icon: Camera, color: "#4DB6AC", text: "Melanin-first AI texture analysis in seconds.", path: "/ai-scanner" },
              { title: "Safety Audit", icon: Search, color: "#E1784F", text: "Vetting family ingredients for clinical safety.", path: "/ai-checker" },
              { title: "Curated Shop", icon: ShoppingBag, color: "#4DB6AC", text: "Vetted products from African-owned brands.", path: "/marketplace" }
            ].map((f, i) => (
              <div key={i} onClick={() => handleFeatureAccess(f.path)} className="group p-12 bg-white dark:bg-black border border-gray-100 dark:border-white/10 rounded-[3.5rem] hover:border-[#E1784F] transition-all cursor-pointer shadow-sm hover:shadow-2xl">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 group-hover:bg-[#E1784F]/10">
                    <f.icon className="w-7 h-7 group-hover:text-[#E1784F] transition-colors" />
                </div>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{f.title}</h3>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] opacity-40 leading-relaxed mb-10">{f.text}</p>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] text-[#E1784F]">Initiate <ArrowRight size={14} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONNECT */}
      <section className="py-32 md:py-56 px-6">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-32">
          <div className="space-y-12">
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">Join the <br/><span className="text-[#4DB6AC]">Circle.</span></h2>
            <p className="text-lg md:text-xl font-medium opacity-40 leading-relaxed">Secure your family's health future with localized clinical intelligence. Start your first scan today.</p>
            <button onClick={() => openAuth("signup")} className="px-12 py-8 bg-[#4DB6AC] text-black font-black uppercase text-[12px] tracking-[0.4em] rounded-[2rem] shadow-2xl hover:scale-105 transition-all">Create Profile</button>
          </div>
          <div className="space-y-16">
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter text-[#E1784F]">Sync.</h2>
            <div className="space-y-12">
              <div className="flex gap-6 items-center">
                <MapPin className="text-[#E1784F]" size={32} />
                <div><p className="font-black uppercase text-[10px] tracking-[0.5em] opacity-30">Headquarters</p><p className="text-2xl font-black italic uppercase tracking-tighter">Lagos, Nigeria</p></div>
              </div>
              <div className="flex gap-6 items-center">
                <Mail className="text-[#E1784F]" size={32} />
                <div><p className="font-black uppercase text-[10px] tracking-[0.5em] opacity-30">Inquiries</p><p className="text-2xl font-black italic uppercase tracking-tighter">hello@afridamai.com</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="pt-32 pb-16 px-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#050505]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
          <div className="md:col-span-6 space-y-10">
            <img src="/logo.png" className={`h-12 w-auto ${isDark ? '' : 'invert'}`} alt="Logo" />
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] leading-loose opacity-30 max-w-sm italic">
                The most sophisticated clinical vision engine built to protect and celebrate melanin-rich skin health across the continent.
            </p>
          </div>
          <div className="md:col-span-6 flex gap-20">
             <div className="space-y-8"><p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#E1784F]">Protocols</p><ul className="space-y-4 text-[11px] font-black uppercase tracking-[0.3em] opacity-40"><li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Skin Check</li><li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-checker')}>Safety Scan</li></ul></div>
             <div className="space-y-8"><p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#4DB6AC]">Foundation</p><ul className="space-y-4 text-[11px] font-black uppercase tracking-[0.3em] opacity-40"><li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/mission')}>Manifesto</li><li className="hover:text-[#4DB6AC] cursor-pointer italic">Privacy</li></ul></div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto mt-24 pt-12 border-t border-gray-100 dark:border-white/10 text-center space-y-8">
          <div className="flex items-center justify-center gap-6 opacity-30">
             <ShieldCheck size={20} />
             <p className="text-[9px] font-black uppercase tracking-[0.6em]">Safe Care Architecture</p>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-20">© 2026 AFRIDAM AI CLINICAL SYSTEMS. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* Auth Modal Support */}
      <AuthModals isOpen={isAuthModalOpen} type={authType} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}