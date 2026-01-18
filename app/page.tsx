/**
 * 🛡️ AFRIDAM WELLNESS HUB: FULL LANDING PAGE
 * Version: 2026.1.2 (Full Restoration + Mobile-First Scaling)
 * Focus: World-Class Aesthetic, Family-Inclusive, No Onboarding.
 */

"use client"

import React, { useState, useEffect } from "react"
import { 
  Camera, ArrowRight, Sun, Moon, Search, MapPin, Mail, Heart, Menu, X, ShoppingBag
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

  // 🛡️ NO ONBOARDING LOGIC HERE - Purely for Dashboard

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
      
      {/* 🌍 1. FIXED TOP BANNER - Shrunk for Mobile */}
      <div className="bg-[#1C1A19] py-2 text-center border-b border-white/5 fixed top-0 left-0 right-0 z-[110]">
        <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white px-4">
          🌍 BUILT BY AFRICANS • RESTORING DIGNITY
        </p>
      </div>

      {/* 🧭 2. NAVIGATION */}
      <nav className={`fixed top-10 left-0 right-0 z-[100] transition-all duration-500 px-4 md:px-6 ${
        scrolled ? 'bg-background/90 backdrop-blur-2xl border-b border-border py-3 shadow-xl' : 'bg-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 active:scale-95 transition-transform">
            <img src="/logo.png" alt="AfriDam AI" className="h-8 md:h-12 w-auto object-contain" />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
               <Link href="/mission" className="hover:text-[#E1784F]">Our Story</Link>
               <a href="#features" className="hover:text-[#E1784F]">How it Works</a>
               <Link href="/marketplace" className="hover:text-[#E1784F]">Marketplace</Link>
            </div>
            <div className="flex items-center gap-4">
               <button onClick={toggleTheme} className="p-3 rounded-2xl bg-muted/50 border border-border">
                 {isDark ? <Sun size={14} className="text-yellow-500" /> : <Moon size={14} />}
               </button>
               {user ? (
                 <Link href="/dashboard" className="px-6 py-3 bg-[#E1784F] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">Dashboard</Link>
               ) : (
                 <button onClick={() => openAuth("signup")} className="px-6 py-3 bg-[#E1784F] text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl">Get Started</button>
               )}
            </div>
          </div>

          <button onClick={() => setMobileMenuOpen(true)} className="lg:hidden p-2 bg-[#E1784F]/10 text-[#E1784F] rounded-xl">
            <Menu size={18} />
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }} className="fixed inset-0 z-[200] bg-background p-6 flex flex-col lg:hidden">
             <div className="flex justify-between items-center mb-10">
                <img src="/logo.png" className="h-8 w-auto" alt="Logo" />
                <button onClick={() => setMobileMenuOpen(false)} className="p-2 bg-muted rounded-xl"><X size={20}/></button>
             </div>
             <div className="flex-grow space-y-3">
                {[{ label: "Our Story", href: "/mission" }, { label: "Care Hub", href: "/marketplace" }, { label: "Dashboard", href: "/dashboard" }].map((link) => (
                  <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block p-5 bg-muted/30 rounded-2xl text-lg font-black italic uppercase tracking-tighter">{link.label}</Link>
                ))}
             </div>
             <div className="pt-6 border-t border-border flex flex-col gap-3">
                <button onClick={() => openAuth("signup")} className="w-full py-5 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl">Start Journey</button>
                <button onClick={() => openAuth("signin")} className="w-full py-5 bg-muted text-foreground rounded-xl font-black uppercase text-[10px] tracking-widest">Login</button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO SECTION */}
      <section className="relative pt-32 md:pt-48 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 items-center gap-12 text-left">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 bg-[#E1784F]/10 border border-[#E1784F]/20 px-3 py-1.5 rounded-full">
              <Heart className="w-3 h-3 fill-[#E1784F] text-[#E1784F] animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#E1784F]">Skin Wellness for Families</span>
            </div>
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-black leading-[0.85] tracking-tighter uppercase italic text-foreground">
              Protect Your <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1784F] via-[#F0A287] to-[#4DB6AC]">Natural Glow.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground font-medium max-w-lg leading-relaxed uppercase tracking-tight">Simple technology built with pride to support the skin health of mothers and children.</p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="group w-full md:w-auto px-10 py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl transition-all flex items-center justify-center gap-3">
              Analyze Glow <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* 🧪 THE RESTORED MODEL & SCANNER */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
             <div className="aspect-[4/5] rounded-[3rem] md:rounded-[4rem] overflow-hidden border-4 md:border-8 border-muted shadow-2xl relative bg-[#3D261C]">
                <img src="/model-hero.JPG" alt="AfriDam Excellence" className="w-full h-full object-cover opacity-80" />
                
                {/* ANIMATED SCANNING LINE */}
                <motion.div 
                  initial={{ top: "0%" }}
                  animate={{ top: "100%" }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 md:h-1 bg-[#4DB6AC] shadow-[0_0_15px_#4DB6AC] z-20"
                />

                <div className="absolute inset-x-4 bottom-4 p-4 md:p-6 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl md:rounded-3xl">
                   <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-[#4DB6AC] rounded-xl flex items-center justify-center text-white shadow-lg">
                        <Camera size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[8px] md:text-[10px] font-black text-white uppercase tracking-widest">Wellness Check Active</p>
                        <div className="h-1 w-full bg-white/10 rounded-full mt-1.5 overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: "92%" }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-[#4DB6AC]" />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* 4. RESTORED STATS - Mobile Fit */}
      <section className="py-10 md:py-20 border-y border-border bg-card/20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[{ label: "Professional", val: "24/7" }, { label: "Matching", val: "100%" }, { label: "Nurse-Led", val: "Expert" }, { label: "Safe", val: "Family" }].map((stat, i) => (
            <div key={i} className="space-y-0">
              <p className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-[#E1784F] uppercase">{stat.val}</p>
              <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. RESTORED MISSION - Shrunk for Mobile */}
      <section className="py-20 md:py-40 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center text-left">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-tight">Smart Care <br/><span className="text-[#4DB6AC]">For Your Home.</span></h2>
            <p className="text-sm md:text-lg font-bold uppercase tracking-tight text-muted-foreground">Protect your family's skin wellness through simple tools built for African homes.</p>
            <Link href="/mission" className="inline-flex h-14 px-8 items-center bg-[#E1784F] text-white rounded-xl font-black uppercase text-[9px] tracking-widest shadow-xl">Learn More <ArrowRight className="ml-2 w-3 h-3" /></Link>
          </div>
          <div className="rounded-[2.5rem] md:rounded-[4rem] overflow-hidden grayscale opacity-30 border border-border aspect-square md:aspect-video">
            <img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000" alt="Heritage" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 6. FEATURES GRID */}
      <section id="features" className="py-20 md:py-40 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto space-y-12 md:space-y-20">
          <div className="text-left space-y-2">
             <span className="text-[#E1784F] text-[9px] font-black uppercase tracking-[0.4em]">The Tools</span>
             <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Simple <br/>Wellness.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {[
              { title: "Skin Check", icon: Camera, color: "#4DB6AC", text: "Understand your skin glow with simple checks.", path: "/ai-scanner" },
              { title: "Safety Scan", icon: Search, color: "#E1784F", text: "Check if ingredients are family-friendly.", path: "/ai-checker" },
              { title: "Care Shop", icon: ShoppingBag, color: "#4DB6AC", text: "Shop safe products curated for you.", path: "/marketplace" }
            ].map((f, i) => (
              <div key={i} onClick={() => handleFeatureAccess(f.path)} className="group p-8 md:p-10 bg-card border border-border rounded-[2.5rem] active:scale-95 transition-all cursor-pointer text-left">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-muted border border-border group-hover:bg-[#E1784F]/10"><f.icon className="w-6 h-6 text-foreground group-hover:text-[#E1784F]" /></div>
                <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter mb-2">{f.title}</h3>
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-muted-foreground leading-relaxed mb-6">{f.text}</p>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#E1784F]">Try Now <ArrowRight size={12} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. RESTORED CONTACT SECTION - Stacked for Mobile */}
      <section className="py-20 md:py-40 px-6 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6 text-left">
            <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">Safe Care <br/><span className="text-[#4DB6AC]">For Everyone.</span></h2>
            <p className="text-sm md:text-base leading-relaxed font-medium text-muted-foreground">Professional support for your household. From safety scans to wellness advice.</p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="px-8 py-4 bg-[#4DB6AC] text-black font-black uppercase text-[9px] tracking-widest rounded-lg shadow-xl">Start Check Now</button>
          </div>
          <div className="space-y-10 text-left">
            <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter text-[#E1784F]">Connect.</h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <MapPin className="text-[#E1784F] shrink-0" size={24} />
                <div><p className="font-black uppercase text-[9px] tracking-[0.2em]">Nigeria HQ</p><p className="text-base font-bold opacity-60 italic">Lagos, Nigeria</p></div>
              </div>
              <div className="flex gap-4 items-start">
                <Mail className="text-[#E1784F] shrink-0" size={24} />
                <div><p className="font-black uppercase text-[9px] tracking-[0.2em]">Support Team</p><p className="text-base font-bold opacity-60 italic">hello@afridamai.com</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="pt-20 pb-10 px-6 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-5 space-y-6 text-left">
            <img src="/logo.png" className="h-10 w-auto" alt="Logo" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose opacity-40 max-w-sm">Built for our families, by our people. AfriDam is a skin wellness support tool and is not a medical diagnosis.</p>
          </div>
          <div className="md:col-span-7 flex flex-wrap gap-12 md:gap-20 text-left">
             <div className="space-y-4"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]">Explore</p><ul className="space-y-3 text-[9px] font-black uppercase tracking-widest"><li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Skin Check</li><li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-checker')}>Safety Scan</li></ul></div>
             <div className="space-y-4"><p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Connect</p><ul className="space-y-3 text-[9px] font-black uppercase tracking-widest"><li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/mission')}>Mission</li><li className="hover:text-[#4DB6AC] cursor-pointer opacity-30 italic">Privacy</li></ul></div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border/50 text-center">
          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.4em] opacity-30 leading-relaxed mb-4">AfriDam AI is for skincare wellness and safety purposes only. Always consult a medical professional.</p>
          <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] opacity-30">© 2026 AFRIDAM AI SYSTEMS. GLOBAL INTELLIGENCE, LOCAL HEART.</p>
        </div>
      </footer>

      <AuthModals isOpen={isAuthModalOpen} type={authType} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}