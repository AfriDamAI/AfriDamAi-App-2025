/**
 * 🛡️ AFRIDAM WELLNESS HUB: LANDING PAGE
 * Version: 2026.1.0 (Skincare & Beauty Focused)
 * Target: African Women, Children & Families
 * Focus: Safe, Relatable, and World-Class
 */

"use client"

import React, { useState, useEffect } from "react"
import { 
  Sparkles, Camera, ArrowRight, Stethoscope, ChevronRight, Sun, Moon,
  Search, MapPin, Mail, Heart, Menu, X, Zap, ShieldCheck, ShoppingBag
} from "lucide-react"
import { AuthModals } from "@/components/auth-modals"
// OnboardingSurvey import removed from here to prevent flicker
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

  // 🛡️ RECTIFIED: Onboarding trigger removed from Landing Page. 
  // User now flows directly to Dashboard for a seamless experience.

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
    <div className="min-h-screen bg-background text-foreground selection:bg-[#E1784F]/30 overflow-x-hidden transition-colors duration-500">
      
      {/* 🌍 1. FIXED TOP BANNER */}
      <div className="bg-[#1C1A19] py-3 text-center border-b border-white/5 fixed top-0 left-0 right-0 z-[110]">
        <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-white px-4">
          🌍 BUILT BY AFRICANS, FOR AFRICANS • RESTORING DIGNITY
        </p>
      </div>

      {/* 🧭 2. RECTIFIED NAVIGATION */}
      <nav className={`fixed top-11 left-0 right-0 z-[100] transition-all duration-500 px-6 ${
        scrolled ? 'bg-background/90 backdrop-blur-2xl border-b border-border py-4 shadow-xl' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-4 active:scale-95 transition-transform">
            <img src="/logo.png" alt="AfriDam AI" className="h-10 md:h-14 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
               <Link href="/mission" className="hover:text-[#E1784F]">Our Story</Link>
               <a href="#features" className="hover:text-[#E1784F]">How it Works</a>
               <Link href="/marketplace" className="hover:text-[#E1784F]">Marketplace</Link>
            </div>
            
            <div className="flex items-center gap-4">
               <button onClick={toggleTheme} className="p-3 rounded-2xl bg-muted/50 border border-border">
                 {isDark ? <Sun size={16} className="text-yellow-500" /> : <Moon size={16} />}
               </button>
               {user ? (
                 <Link href="/dashboard" className="px-8 py-4 bg-[#E1784F] text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl">Dashboard</Link>
               ) : (
                 <div className="flex items-center gap-2">
                    <button onClick={() => openAuth("signin")} className="px-6 py-4 text-[9px] font-black uppercase tracking-widest hover:text-[#E1784F]">Login</button>
                    <button onClick={() => openAuth("signup")} className="px-8 py-4 bg-[#E1784F] text-white rounded-2xl font-black text-[9px] uppercase tracking-[0.3em] shadow-xl">Get Started</button>
                 </div>
               )}
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-3 bg-[#E1784F]/10 text-[#E1784F] rounded-2xl">
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-[200] bg-background p-8 flex flex-col lg:hidden">
             <div className="flex justify-between items-center mb-12">
                <img src="/logo.png" className="h-10 w-auto" alt="Logo" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-3 bg-muted rounded-2xl"><X size={20}/></button>
             </div>
             <div className="flex-grow space-y-4">
                {[{ label: "Our Story", href: "/mission" }, { label: "Care Hub", href: "/marketplace" }, { label: "Wellness Dashboard", href: "/dashboard" }].map((link) => (
                  <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block p-6 bg-muted/30 rounded-[2rem] text-xl font-black italic uppercase tracking-tighter">{link.label}</Link>
                ))}
             </div>
             <div className="pt-8 border-t border-border flex flex-col gap-4">
                <button onClick={() => openAuth("signup")} className="w-full py-6 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Start Journey</button>
                <button onClick={() => openAuth("signin")} className="w-full py-6 bg-muted text-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest">Login</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO SECTION */}
      <section className="relative min-h-[95svh] flex items-center justify-center pt-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 items-center gap-12 relative z-10 text-left">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-10">
            <div className="inline-flex items-center gap-3 bg-[#E1784F]/10 border border-[#E1784F]/20 px-4 py-2 rounded-full">
              <Heart className="w-4 h-4 fill-[#E1784F] text-[#E1784F] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Skin Wellness for Families</span>
            </div>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase italic text-foreground">
              Protect Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1784F] via-[#F0A287] to-[#4DB6AC]">Natural Glow.</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground font-medium max-w-xl leading-snug uppercase tracking-tight">AfriDam AI uses simple technology built with pride to support the skin health of mothers and children across Africa.</p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="group w-full md:w-auto px-12 py-7 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">
              Analyze Glow <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>

          <div className="lg:col-span-5 relative">
             <div className="aspect-[4/5] rounded-[4rem] overflow-hidden border-8 border-muted shadow-2xl relative bg-[#3D261C]">
                <img src="/model-hero.JPG" alt="AfriDam Excellence" className="w-full h-full object-cover opacity-80" />
                
                {/* THE SCANNING LINE ANIMATION */}
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-1 bg-[#4DB6AC] shadow-[0_0_20px_#4DB6AC] z-20"
                />

                <div className="absolute inset-x-6 bottom-6 p-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl text-left">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#4DB6AC] rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Camera size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-widest">Wellness Check Active</p>
                        <div className="h-1 w-full bg-white/10 rounded-full mt-2 overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-[#4DB6AC]" />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="py-12 md:py-24 border-y border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[{ label: "Professional Care", val: "24/7" }, { label: "Skin Matching", val: "100%" }, { label: "Nurse-Led Support", val: "Expert" }, { label: "Family Focused", val: "Safe" }].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-4xl md:text-6xl font-black italic tracking-tighter text-[#E1784F] uppercase">{stat.val}</p>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MISSION */}
      <section className="py-24 md:py-48 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-left">
            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Smart Care <br/><span className="text-[#4DB6AC]">For Your Home.</span></h2>
            <p className="text-lg md:text-xl font-bold uppercase tracking-tight text-muted-foreground">AfriDam helps you protect your family's skin wellness through simple tools built for African homes.</p>
            <Link href="/mission" className="inline-flex h-16 px-12 items-center bg-[#E1784F] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">Learn More <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </div>
          <div className="rounded-[4rem] overflow-hidden grayscale opacity-40 border border-border">
            <img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000" alt="African Heritage" />
          </div>
        </div>
      </section>

      {/* 6. FEATURES GRID */}
      <section id="features" className="py-24 md:py-48 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-left space-y-4">
             <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.5em]">The Tools</span>
             <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">Simple <br/>Wellness.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { title: "Skin Check", icon: Camera, color: "#4DB6AC", text: "Understand your skin glow and texture with simple AI checks.", path: "/ai-scanner" },
              { title: "Safety Scan", icon: Search, color: "#E1784F", text: "Identify child-safe and family-friendly skincare ingredients.", path: "/ai-checker" },
              { title: "The Care Shop", icon: ShoppingBag, color: "#4DB6AC", text: "Shop safe products curated specifically for your skin's restoration.", path: "/marketplace" }
            ].map((f, i) => (
              <div key={i} onClick={() => handleFeatureAccess(f.path)} className="group p-10 md:p-12 bg-card border border-border rounded-[3.5rem] hover:border-[#E1784F]/30 transition-all cursor-pointer text-left shadow-sm hover:shadow-2xl">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 bg-muted border border-border group-hover:bg-[#E1784F]/10"><f.icon className="w-8 h-8 text-foreground group-hover:text-[#E1784F]" /></div>
                <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter mb-4">{f.title}</h3>
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-relaxed mb-10">{f.text}</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E1784F]">Try Now <ArrowRight size={14} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section className="py-24 md:py-48 px-6 bg-card">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="space-y-8 text-left">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Safe Care <br/><span className="text-[#4DB6AC]">For Everyone.</span></h2>
            <p className="text-md md:text-lg leading-relaxed font-medium text-muted-foreground">Professional support for your household. From safety scans to wellness advice.</p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="px-10 py-5 bg-[#4DB6AC] text-black font-black uppercase text-[10px] tracking-widest rounded-xl shadow-xl">Start Check Now</button>
          </div>
          <div className="space-y-12 text-left">
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none text-[#E1784F]">Connect.</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <MapPin className="text-[#E1784F] shrink-0" size={28} />
                <div><p className="font-black uppercase text-[11px] tracking-[0.2em]">Nigeria HQ</p><p className="text-lg font-bold opacity-60 italic">Lagos, Nigeria</p></div>
              </div>
              <div className="flex gap-6 items-start">
                <Mail className="text-[#E1784F] shrink-0" size={28} />
                <div><p className="font-black uppercase text-[11px] tracking-[0.2em]">Support Team</p><p className="text-lg font-bold opacity-60 italic">hello@afridamai.com</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER WITH RECTIFIED DISCLAIMER */}
      <footer className="pt-24 pb-12 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-5 space-y-8 text-left">
            <img src="/logo.png" className="h-14 w-auto" alt="Logo" />
            <p className="text-[11px] font-bold uppercase tracking-widest leading-loose opacity-40 max-w-sm">Built for our families, by our people. AfriDam is a skin wellness support tool and is not a medical diagnosis.</p>
          </div>
          <div className="md:col-span-7 flex flex-wrap gap-20 text-left">
             <div className="space-y-6"><p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#E1784F]">Explore</p><ul className="space-y-4 text-[10px] font-black uppercase tracking-widest"><li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Skin Check</li><li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-checker')}>Safety Scan</li><li className="hover:text-[#E1784F] cursor-pointer" onClick={() => router.push('/marketplace')}>Care Shop</li></ul></div>
             <div className="space-y-6"><p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Connect</p><ul className="space-y-4 text-[10px] font-black uppercase tracking-widest"><li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/contact')}>Support</li><li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/mission')}>Mission</li><li className="hover:text-[#4DB6AC] cursor-pointer opacity-30 italic">Privacy Protocol</li></ul></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-border/50 text-center">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mb-4 px-4 leading-relaxed">AfriDam AI is for skincare wellness and safety purposes only. Always consult a medical professional for clinical skin conditions.</p>
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.5em] opacity-40">© 2026 AFRIDAM AI SYSTEMS. GLOBAL INTELLIGENCE, LOCAL HEART.</p>
        </div>
      </footer>

      <AuthModals isOpen={isAuthModalOpen} type={authType} onClose={() => setIsAuthModalOpen(false)} />
      {/* 🛡️ RECTIFIED: Survey component removed to prevent pop-up on login. */}
    </div>
  )
}