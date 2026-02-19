/**
 * 🛡️ AFRIDAM WELLNESS HUB: ELEGANT UNIFIED EDITION (Rule 6 Synergy)
 * Version: 2026.6.2 (Route Group Sync & 404 Resolution)
 * Focus: Sophisticated Scaling, (auth) Group Alignment, Rule 6 Compliance.
 */

"use client"

import React, { useState, useEffect } from "react"
import {
  Camera, ArrowRight, Sun, Moon, MapPin, Mail, Heart, Menu, X, ShieldCheck, Activity, Sparkles, Aperture
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * 🛡️ RULE 6 SYNERGY: 
   * High-speed redirection to dedicated auth nodes.
   * 🚀 FIX: Pointing to /login instead of /auth/login to match (auth) group.
   */
  const navigateToAuth = (type: "login" | "register") => {
    setMobileMenuOpen(false);
    router.push(`/${type}`);
  };

  const handleFeatureAccess = (path: string) => {
    if (user) router.push(path);
    else navigateToAuth("register");
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} className="opacity-60 hover:opacity-100 hover:text-[#E1784F] transition-all font-bold tracking-widest uppercase text-[10px]">
      {label}
    </Link>
  );

  return (
    <div className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 selection:bg-[#E1784F]/30 relative no-scrollbar">

      {/* 🧭 1. NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-6 py-4 md:px-12 ${scrolled ? 'bg-white/95 dark:bg-[#050505]/95 backdrop-blur-3xl py-4 shadow-sm border-b border-black/5 dark:border-white/5' : 'bg-transparent py-8'
        }`}>
        <div className="max-w-screen-xl mx-auto flex justify-between items-center">
          <Link href="/" className="active:scale-95 transition-transform">
            <img src="/logo.png" alt="AfriDam" className={`h-7 md:h-9 w-auto object-contain ${isDark ? '' : 'invert'}`} />
          </Link>

          <div className=" lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            <NavLink href="/mission" label="Our Mission" />
            <NavLink href="/marketplace" label="Market Place" />
            <NavLink href="#contact" label="Contact" />

            <button onClick={toggleTheme} className="p-2 opacity-40 hover:opacity-100 transition-all ml-4">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <Link href="/dashboard" className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-lg uppercase tracking-widest font-black text-[9px]">
                Portal
              </Link>
            ) : (
              <div className="flex items-center gap-6">
                <button 
                onClick={() => navigateToAuth("login")} 
                className="opacity-50 hover:opacity-100 transition-all cursor-pointer">
                  Login
                </button>
                <button 
                onClick={() => navigateToAuth("register")} 
                className="px-8 py-3 bg-[#E1784F] text-white rounded-lg uppercase tracking-widest font-black text-[9px] shadow-xl active:scale-95 transition-all cursor-pointer">
                  Get Started
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden hover:opacity-75 transition-opacity" aria-label="Open menu">
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* 🌪️ 2. HERO */}
      <section className="relative pt-32 md:pt-56 pb-20 px-6">
        <div className="max-w-screen-xl mx-auto grid lg:grid-cols-12 items-center gap-12 md:gap-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-7 space-y-8 md:space-y-12">
            <div className="inline-flex items-center gap-2.5 bg-[#E1784F]/5 dark:bg-white/5 px-4 py-2 rounded-full border border-[#E1784F]/10">
              <Sparkles className="text-[#E1784F]" size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]">Clinical Excellence</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-7xl font-black leading-[1.1] tracking-tight uppercase italic text-black dark:text-white">
              Your <br /> Skin's <br /> <span className="text-[#E1784F]">Best Friend.</span>
            </h1>
            <p className="text-lg md:text-2xl font-black max-w-lg opacity-25 uppercase tracking-tighter leading-tight italic">
              Localized protection. <br /> Safe care for the heritage.
            </p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="group h-20 px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-6 active:scale-95 transition-all">
              Start Now <ArrowRight size={18} />
            </button>
          </motion.div>

          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden border-[10px] border-white dark:border-[#121212] shadow-2xl bg-muted/20 relative group">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80" alt="AfriDam" className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0" />
              <div className="absolute inset-0 pointer-events-none">
                <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute left-0 right-0 h-[2px] bg-[#E1784F] shadow-[0_0_30px_5px_#E1784F] z-20" />
              </div>
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-black/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 flex items-center gap-5">
                <div className="w-12 h-12 bg-[#4DB6AC] rounded-2xl flex items-center justify-center text-white">
                  <Camera size={24} />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white italic">Analysis Active</p>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6, repeat: Infinity }} className="h-full bg-[#E1784F]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🎥 3. THE VISUAL FLOW */}
      <section className="py-20 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5 border-y border-black/5 dark:border-white/5">
        <div className="max-w-screen-xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-widest opacity-40">Simple English Approach</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">Simple Path. <br />Pure Results.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white dark:bg-black rounded-[3rem] border border-black/5 dark:border-white/5 space-y-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xl italic">01</div>
              <h3 className="text-2xl font-black uppercase italic leading-none">Snap a <br />Photo</h3>
              <p className="text-[11px] font-bold uppercase opacity-30 leading-relaxed tracking-tight">Capture your skin concern clearly under soft, natural light.</p>
              <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-[2.5rem] relative border border-black/5 dark:border-white/5 flex items-center justify-center">
                <div className="p-8 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 shadow-xl">
                  <Aperture size={40} className="text-[#E1784F]" />
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#E1784F] text-white rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-white text-[#E1784F] flex items-center justify-center font-black text-xl italic">02</div>
              <h3 className="text-2xl font-black uppercase italic leading-none text-white">Instant <br />Check</h3>
              <p className="text-[11px] font-bold uppercase opacity-80 leading-relaxed tracking-tight">We check your scan against clinical health standards for melanin.</p>
              <div className="aspect-square bg-black/10 rounded-[2.5rem] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-2 border-dashed border-white/30 rounded-full flex items-center justify-center">
                  <Activity size={32} />
                </motion.div>
              </div>
            </div>

            <div className="p-10 bg-white dark:bg-black rounded-[3rem] border border-black/5 dark:border-white/5 space-y-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center font-black text-xl italic">03</div>
              <h3 className="text-2xl font-black uppercase italic leading-none">Get the <br />Answer</h3>
              <p className="text-[11px] font-bold uppercase opacity-30 leading-relaxed tracking-tight">Receive immediate results and guidance for your skin journey.</p>
              <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-10 flex flex-col justify-center space-y-4">
                <motion.div initial={{ width: 0 }} whileInView={{ width: "80%" }} className="h-2.5 bg-[#4DB6AC] rounded-full opacity-40" />
                <motion.div initial={{ width: 0 }} whileInView={{ width: "100%" }} transition={{ delay: 0.2 }} className="h-2.5 bg-[#4DB6AC] rounded-full opacity-20" />
                <motion.div initial={{ width: 0 }} whileInView={{ width: "60%" }} transition={{ delay: 0.4 }} className="h-2.5 bg-[#4DB6AC] rounded-full opacity-10" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📜 4. THE MANIFESTO */}
      <section className="py-24 md:py-40 px-6 text-center">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center">
          <Heart className="text-[#E1784F] mb-12" size={40} fill="currentColor" />
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9] max-w-5xl text-black dark:text-white">
            "Heritage is <br /> our <span className="text-[#4DB6AC]">Foundation</span>, <br /> Skin is our <span className="text-[#E1784F]">Legacy</span>."
          </h2>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 mt-16 italic">A Founder's Promise</p>
        </div>
      </section>

      {/* 🧪 5. CARE SOLUTIONS */}
      <section id="features" className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5">
        <div className="max-w-screen-xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Check Skin", icon: Camera, text: "A precision scan to verify your skin health.", path: "/ai-scanner", color: "#E1784F" },
              { title: "Safe Choice", icon: ShieldCheck, text: "Verify if your products are safe for melanin.", path: "/ingredient-analyzer", color: "#4DB6AC" }
            ].map((f, i) => (
              <div key={i} onClick={() => handleFeatureAccess(f.path)} className="group p-12 md:p-16 bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[4rem] hover:border-[#E1784F] transition-all cursor-pointer shadow-sm">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 text-white shadow-lg" style={{ backgroundColor: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-4xl font-black italic uppercase tracking-tighter mb-4 leading-none">{f.title}</h3>
                <p className="text-[12px] font-bold uppercase tracking-widest opacity-30 leading-relaxed mb-10 max-w-xs">{f.text}</p>
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest" style={{ color: f.color }}>Start Now <ArrowRight size={16} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏛️ 6. CONTACT & ACTION */}
      <section id="contact" className="py-16 md:py-24 px-8 md:px-20">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-24 md:gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-6xl md:text-7xl font-black uppercase italic tracking-tighter leading-[0.85] text-black dark:text-white">Get <br /><span className="text-[#4DB6AC]">Started.</span></h2>
            <p className="text-xl md:text-2xl font-black opacity-20 uppercase tracking-tighter italic">Join the movement for <br />Melanin-Rich Health.</p>
            <button onClick={() => navigateToAuth("register")} className="w-full md:w-auto h-20 px-16 bg-[#4DB6AC] text-black font-black uppercase text-[11px] tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">Create Profile</button>
          </div>
          <div className="space-y-16">
            <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-[#E1784F]">Contact.</h2>
            <div className="space-y-12">
              <div className="flex gap-8 items-center">
                <MapPin className="text-[#E1784F]" size={32} />
                <div>
                  <p className="font-black uppercase text-[9px] tracking-[0.5em] opacity-20">Lagos HQ</p>
                  <p className="text-2xl font-black italic uppercase tracking-tighter text-black dark:text-white">Nigeria</p>
                </div>
              </div>
              <div className="flex gap-8 items-center">
                <Mail className="text-[#E1784F]" size={32} />
                <div>
                  <p className="font-black uppercase text-[9px] tracking-[0.5em] opacity-20">Direct</p>
                  <p className="text-2xl font-black italic uppercase tracking-tighter text-black dark:text-white">hello@afridamai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏷️ 7. FOOTER */}
      <footer className="pt-32 pb-16 px-10 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-[#050505]">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 text-center md:text-left">
          <div className="md:col-span-6 space-y-10">
            <img src="/logo.png" className={`h-10 w-auto mx-auto md:mx-0 ${isDark ? '' : 'invert'}`} alt="Logo" />
            <p className="text-[11px] font-bold uppercase tracking-widest leading-loose opacity-20 max-w-sm mx-auto md:mx-0 italic">
              Caring for melanin-rich skin through high-precision technology and love.
            </p>
          </div>
          <div className="md:col-span-6 flex gap-16 justify-center md:justify-end">
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E1784F]">Navigation</p>
              <ul className="space-y-5 text-[10px] font-black uppercase tracking-widest opacity-30">
                <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => router.push('/mission')}>Mission</li>
                <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/marketplace')}>Care Hub</li>
              </ul>
            </div>
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC]">Legal</p>
              <ul className="space-y-5 text-[10px] font-black uppercase tracking-widest opacity-30">
                <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => navigateToAuth('login')}>Login</li>
                <li className="hover:text-[#4DB6AC] cursor-pointer">Security</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-screen-xl mx-auto mt-24 pt-10 border-t border-black/5 dark:border-white/5 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.6em] opacity-10 italic">© 2026 AFRIDAM AI CLINICAL VISION ARCHITECTURE.</p>
        </div>
      </footer>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm p-6 flex flex-col">
            {/* Close Button */}
            <div className="flex justify-end mb-12">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-8 h-8" />
              </button>
            </div>

            {/* Logo */}
            <div className="px-6 mb-12">
              <img src="/logo.png" className={`h-8 w-auto ${isDark ? '' : 'invert'}`} alt="Logo" />
            </div>

            {/* Navigation Items */}
            <div className="flex-1 px-6 flex flex-col gap-5">
              {['Mission', 'Care Hub', 'Contact', 'Login'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (item === 'Login') navigateToAuth('login');
                    else if (item === 'Contact') document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    else handleFeatureAccess(item === 'Mission' ? '/mission' : '/marketplace');
                  }}
                  className="text-5xl font-bold italic text-white hover:text-[#E1784F] transition-colors text-left"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Get Started Button */}
            <div className="px-6 pb-12">
              <button
                onClick={() => navigateToAuth("register")}
                className="w-full py-4 px-6 bg-[#E1784F] hover:bg-orange-500 text-white font-bold rounded-full transition-colors"
              >
                GET STARTED
              </button>
            </div>

            {/* Bottom Chat Icon */}
            <div className="absolute bottom-12 right-6 w-12 h-12 bg-teal-400 rounded-2xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 2z"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}