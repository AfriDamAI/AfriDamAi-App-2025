"use client"

import React, { useState, useEffect } from "react"
import { 
  Sparkles, 
  Camera, 
  ArrowRight, 
  Stethoscope, 
  ChevronRight, 
  Sun, 
  Moon,
  Search,
  MapPin, 
  Mail,
  ShieldCheck,
  User as UserIcon,
  Heart,
  Menu,
  X
} from "lucide-react"

import { AuthModals } from "@/components/auth-modals"
import { OnboardingSurvey } from "@/components/onboarding-survey"
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
  const [authType, setAuthType] = useState<"signin" | "signup">("signin");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (user && !user.profile?.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, [user]);

  const openAuth = (type: "signin" | "signup") => {
    setAuthType(type);
    setIsAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleFeatureAccess = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      openAuth("signup");
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-[#E1784F]/30 overflow-x-hidden bg-background text-foreground`}>
      
      {/* 1. AFRICAN PRIDE BANNER */}
      <div className="bg-[#1C1A19] py-2 md:py-3 text-center border-b border-white/5 relative z-[70]">
        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-white">
          🌍 Made by Africans, for Africans
        </p>
      </div>

      {/* 2. NAVIGATION */}
      <nav className={`fixed top-12 md:top-14 left-0 right-0 z-50 transition-all duration-500 px-4 md:px-6 ${scrolled ? (isDark ? 'bg-[#1C1A19]/90 backdrop-blur-3xl border-b border-white/5 py-3' : 'bg-white/90 backdrop-blur-3xl border-b border-black/5 py-3') : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 md:gap-6 group cursor-pointer">
            <img 
              src="/logo.png" 
              alt="AfriDam AI" 
              className={`h-12 md:h-16 w-auto object-contain transition-all duration-500 ${isDark ? 'brightness-100' : 'brightness-90'}`} 
            />
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={toggleTheme} className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-yellow-400' : 'bg-black/5 border-black/10 text-indigo-600'}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className={`flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
               <Link href="/mission" className="hover:text-[#E1784F]">Our Story</Link>
               <a href="#features" className="hover:text-[#E1784F]">How it Works</a>
               <Link href="/contact" className="hover:text-[#E1784F]">Care Hub</Link>
            </div>
            <div className="flex items-center gap-8">
               {user ? (
                 <Link href="/dashboard" className={`px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all ${isDark ? 'bg-[#F7F3EE] text-[#1C1A19]' : 'bg-[#1C1A19] text-white'}`}>Dashboard</Link>
               ) : (
                 <button onClick={() => openAuth("signup")} className={`px-8 py-3 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all bg-[#E1784F] text-white shadow-lg shadow-[#E1784F]/20`}>Get Started</button>
               )}
            </div>
          </div>

          {/* MOBILE TOGGLE */}
          <div className="flex lg:hidden items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-foreground">{isDark ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
              {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="fixed inset-0 z-[60] bg-background p-10 flex flex-col justify-center gap-10 lg:hidden">
             <div className="flex flex-col gap-6 text-xl font-black uppercase italic tracking-tighter">
                <Link href="/mission" onClick={() => setMobileMenuOpen(false)}>Our Story</Link>
                <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
                <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Care Hub</Link>
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
             </div>
             <div className="pt-10 border-t border-border flex flex-col gap-4">
                {!user ? (
                  <>
                    <button onClick={() => openAuth("signup")} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Sign Up</button>
                    <button onClick={() => openAuth("signin")} className="w-full py-5 border border-border text-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest">Login</button>
                  </>
                ) : (
                  <button onClick={() => router.push('/dashboard')} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">Go to Dashboard</button>
                )}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-12 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 items-center gap-10 md:gap-20 relative z-10">
          <div className="lg:col-span-7 space-y-8 md:space-y-12 text-left">
            <div className={`inline-flex items-center gap-3 border px-4 py-2 rounded-full ${isDark ? 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]' : 'bg-[#FEF2ED] border-[#F0A287]/30 text-[#E1784F]'}`}>
              <Heart className="w-3 h-3 md:w-4 md:h-4 animate-pulse fill-[#E1784F]" />
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Gentle Care for African Skin</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[8.5rem] font-black leading-[0.9] tracking-tighter uppercase italic text-foreground">
              Built by <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1784F] via-[#F0A287] to-[#4DB6AC]">Africans, for Africans.</span>
            </h1>

            <p className={`text-lg md:text-2xl leading-relaxed max-w-xl font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Every skin tells a beautiful story. We use smart technology built with love to help you find the gentle care you deserve.
            </p>

            <button 
              onClick={() => handleFeatureAccess("/ai-scanner")}
              className="w-full md:w-auto px-10 py-6 md:px-12 md:py-8 bg-[#E1784F] text-white rounded-2xl md:rounded-[2.5rem] font-black uppercase text-[10px] md:text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all"
            >
              Start Journey <ChevronRight className="ml-2 inline w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 relative mt-10 lg:mt-0">
            <div className={`relative z-10 p-4 md:p-6 border rounded-[3rem] md:rounded-[5.5rem] shadow-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
               <div className="rounded-[2.5rem] md:rounded-[4.5rem] aspect-[4/5] overflow-hidden relative border-4 border-black/20 bg-[#3D261C]">
                  <img src="/model-hero.JPG" alt="AfriDam Model" className="w-full h-full object-cover opacity-90" />
                  <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
                     <div className="w-full p-6 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10">
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC] animate-pulse">Analyzing Glow...</span>
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-3 overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-[#4DB6AC]" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className={`py-12 md:py-24 border-y ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center">
          {[
            { label: "Always Here", val: "24/7" },
            { label: "Our Focus", val: "Melanin" },
            { label: "Expert Care", val: "Verified" },
            { label: "Vetted Safe", val: "Safe" }
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <p className="text-3xl md:text-5xl font-black italic tracking-tighter text-[#E1784F] uppercase">{stat.val}</p>
              <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MISSION SECTION */}
      <section className="py-24 md:py-48 px-6 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-6 md:space-y-8 text-left">
            <h2 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              Built for <span className="text-[#4DB6AC]">African Families.</span>
            </h2>
            <p className={`text-lg md:text-xl font-bold uppercase tracking-tight ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              AfriDam is here to protect your glow. Made with pride in Lagos, Nigeria, for the world.
            </p>
            <Link href="/mission" className="inline-flex h-14 md:h-16 px-10 md:px-12 items-center bg-[#E1784F] text-white rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] tracking-widest shadow-xl active:scale-95 transition-all">
              Our Story <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          <div className="relative group overflow-hidden rounded-[2.5rem] md:rounded-[4rem]">
            <img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000" className={`w-full h-auto grayscale ${isDark ? 'opacity-60' : 'opacity-40'}`} alt="Heritage" />
          </div>
        </div>
      </section>

      {/* 6. FEATURES SECTION */}
      <section id="features" className={`py-24 md:py-48 px-6 relative ${isDark ? 'bg-black/20' : 'bg-gray-100/50'}`}>
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-32">
          <div className="text-center space-y-3">
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase text-foreground">Pure & Simple Care</h2>
             <p className="text-[#E1784F] text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.6em]">Shop • Analysis • Support</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12">
            {[
              { title: "Skin Glow Check", icon: Camera, color: "#4DB6AC", text: "Check your skin instantly with technology that understands you.", path: "/ai-scanner" },
              { title: "Product Check", icon: Search, color: "#E1784F", text: "Ensure your products are safe and gentle for melanin-rich skin.", path: "/ai-checker" },
              { title: "Expert Support", icon: Stethoscope, color: isDark ? "#FFF" : "#000", text: "Advice from specialists who understand African skin care.", path: "/appointments" }
            ].map((f, i) => (
              <div key={i} onClick={() => handleFeatureAccess(f.path)} className="group p-8 md:p-12 bg-card border border-border rounded-[2.5rem] md:rounded-[4rem] hover:border-[#E1784F] transition-all cursor-pointer text-left">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem] flex items-center justify-center mb-8 md:mb-12" style={{ backgroundColor: `${f.color}10` }}>
                  <f.icon className="w-8 h-8 md:w-10 md:h-10" style={{ color: f.color }} />
                </div>
                <h3 className="text-2xl md:text-3xl font-black mb-4 md:mb-6 tracking-tight uppercase italic">{f.title}</h3>
                <p className={`text-xs md:text-sm leading-relaxed mb-8 md:mb-10 font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{f.text}</p>
                <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: f.color }}>
                  Access Hub <ArrowRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section className={`py-24 md:py-48 px-6 ${isDark ? 'bg-black/40' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          <div className="space-y-8 md:space-y-12 text-left">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none">Glow-Powered <br/><span className="text-[#4DB6AC]">Wellness</span></h2>
            <p className="text-md md:text-lg leading-relaxed font-medium opacity-70">Everything you need for your family's skin health. From safe products to expert advice.</p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="w-full md:w-auto px-10 py-5 border-2 border-[#4DB6AC] text-[#4DB6AC] font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-[#4DB6AC] hover:text-black transition-all">Get Started</button>
          </div>
          <div className="space-y-8 md:space-y-12 text-left">
            <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-none text-[#E1784F]">Connect</h2>
            <div className="space-y-6 md:space-y-8">
              <div className="flex gap-4 md:gap-6 items-start">
                <MapPin className="text-[#E1784F] shrink-0" />
                <div>
                  <p className="font-black uppercase text-[10px] tracking-widest">Location</p>
                  <p className="text-sm font-bold opacity-70">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex gap-4 md:gap-6 items-start">
                <Mail className="text-[#E1784F] shrink-0" />
                <div>
                  <p className="font-black uppercase text-[10px] tracking-widest">Email</p>
                  <p className="text-sm font-bold opacity-70">hello@afridamai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className={`pt-20 md:pt-40 pb-12 md:pb-20 px-6 border-t ${isDark ? 'bg-[#151312] border-white/10' : 'bg-white border-border'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-4 space-y-6 md:space-y-8 text-left">
            <img src="/logo.png" className="h-14 md:h-20 w-auto" alt="Logo" />
            <p className="text-[10px] font-bold uppercase tracking-widest leading-loose opacity-60">
              Caring for African skin with love and technology. Made for us, by us.
            </p>
          </div>
          <div className="md:col-span-8 flex flex-wrap gap-12 md:gap-24 text-left">
             <div className="space-y-4 md:space-y-6">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Care Portal</p>
                <ul className="space-y-3 md:space-y-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Glow Check</li>
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Product Check</li>
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => router.push('/marketplace')}>Care Shop</li>
                </ul>
             </div>
             <div className="space-y-4 md:space-y-6">
                <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">Help Hub</p>
                <ul className="space-y-3 md:space-y-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                   <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/contact')}>Contact</li>
                   <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/mission')}>Story</li>
                   <li className="hover:text-[#4DB6AC] cursor-pointer opacity-40">Privacy</li>
                </ul>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 md:mt-20 pt-8 md:pt-10 border-t border-border text-center">
           <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] opacity-40 leading-relaxed">© 2026 AfriDam AI. RESTORING DIGNITY IN CARE.</p>
        </div>
      </footer>

      {/* 9. MODALS */}
      <AuthModals isOpen={isAuthModalOpen} type={authType} onClose={() => setIsAuthModalOpen(false)} />
      
      {showOnboarding && (
        <OnboardingSurvey 
          onComplete={() => {
            setShowOnboarding(false);
            router.push('/dashboard');
          }} 
        />
      )}
    </div>
  )
}