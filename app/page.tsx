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
  Phone,
  Mail,
  ShieldCheck,
  User as UserIcon,
  Heart,
  Baby,
  Flower2
} from "lucide-react"

import { AuthModals } from "@/components/auth-modals"
import { OnboardingSurvey } from "@/components/onboarding-survey"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup" | any>("signin");
  const [scrolled, setScrolled] = useState(false);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
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
      <div className="bg-[#1C1A19] py-3 text-center border-b border-white/5 relative z-[60]">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white">
          🌍 Made by Africans, for Africans
        </p>
      </div>

      {/* 2. NAVIGATION */}
      <nav className={`fixed top-10 left-0 right-0 z-50 transition-all duration-500 px-6 py-8 ${scrolled ? (isDark ? 'bg-[#1C1A19]/90 backdrop-blur-3xl border-b border-white/5 py-4' : 'bg-white/90 backdrop-blur-3xl border-b black/5 py-4') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-6 group cursor-pointer">
            <img 
              src="/logo.png" 
              alt="AfriDam AI" 
              className={`h-16 md:h-20 w-auto object-contain transition-all duration-500 ${isDark ? 'brightness-100' : 'brightness-90'}`} 
            />
            <div className="hidden md:flex flex-col border-l border-border pl-6">
              <span className={`text-[10px] font-black uppercase tracking-[0.5em] leading-none ${isDark ? 'text-[#E1784F]' : 'text-[#C55A32]'}`}>
                Your Natural Glow
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <button onClick={toggleTheme} className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-black/5 border-black/10 text-indigo-600 hover:bg-black/10'}`}>
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
               <Link href="/mission" className="hover:text-[#E1784F] transition-colors">Our Story</Link>
               <a href="#features" className="hover:text-[#E1784F] transition-colors">How it Works</a>
               <Link href="/contact" className="hover:text-[#E1784F] transition-colors">Care Hub</Link>
            </div>

            <div className="flex items-center gap-8">
               {user ? (
                 <div className="flex items-center gap-6">
                    <Link href="/profile" className="w-12 h-12 rounded-full border-2 border-[#E1784F] overflow-hidden bg-muted flex items-center justify-center hover:scale-110 transition-transform">
                      {user.profile?.avatarUrl ? <img src={user.profile.avatarUrl} className="w-full h-full object-cover" alt="Profile" /> : <UserIcon className="w-5 h-5 text-[#E1784F]" />}
                    </Link>
                    <Link href="/dashboard" className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl ${isDark ? 'bg-[#F7F3EE] text-[#1C1A19]' : 'bg-[#1C1A19] text-white'}`}>Dashboard</Link>
                 </div>
               ) : (
                 <>
                   <button onClick={() => openAuth("signin")} className={`text-[10px] font-black uppercase tracking-[0.4em] hover:text-[#E1784F] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Login</button>
                   <button onClick={() => openAuth("signup")} className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl ${isDark ? 'bg-[#E1784F] text-white' : 'bg-[#1C1A19] text-white'}`}>Get Started</button>
                 </>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 items-center gap-20 relative z-10">
          <div className="lg:col-span-7 space-y-12">
            <div className={`inline-flex items-center gap-3 border px-5 py-2.5 rounded-full ${isDark ? 'bg-[#E1784F]/10 border-[#E1784F]/20 text-[#E1784F]' : 'bg-[#FEF2ED] border-[#F0A287]/30 text-[#E1784F]'}`}>
              <Heart className="w-4 h-4 animate-pulse fill-[#E1784F]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Gentle Care for African Skin</span>
            </div>

            <h1 className="text-7xl md:text-[8.5rem] font-black leading-[0.85] tracking-tighter uppercase italic text-foreground">
              Built by <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1784F] via-[#F0A287] to-[#4DB6AC]">Africans, for Africans.</span>
            </h1>

            <p className={`text-xl md:text-2xl leading-relaxed max-w-xl font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Every skin tells a beautiful story. We use smart technology built with love to help you find the gentle care you deserve.
            </p>

            <button 
              onClick={() => handleFeatureAccess("/ai-scanner")}
              className="group relative px-12 py-8 bg-[#E1784F] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all"
            >
              Start Your Journey <ChevronRight className="ml-3 inline w-5 h-5" />
            </button>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className={`relative z-10 p-6 border rounded-[5.5rem] shadow-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
               <div className="rounded-[4.5rem] aspect-[4/5] overflow-hidden relative border-4 border-black/20 bg-[#3D261C]">
                  <img src="/model-hero.JPG" alt="AfriDam Glow Model" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.98 }} />
                  <div className="absolute inset-0 p-10 flex flex-col justify-between items-center">
                     <div className="w-full flex justify-between">
                        <div className="w-14 h-14 border-t-4 border-l-4 border-[#E1784F] rounded-tl-3xl opacity-80" />
                        <div className="w-14 h-14 border-t-4 border-r-4 border-[#E1784F] rounded-tr-3xl opacity-80" />
                     </div>
                     <div className="w-full p-8 rounded-[2.5rem] bg-black/60 backdrop-blur-xl border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC] animate-pulse">Analyzing Glow...</span>
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
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
      <section className={`py-24 border-y ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Always Here", val: "24/7" },
            { label: "Our Focus", val: "Melanin" },
            { label: "Expert Care", val: "Verified" },
            { label: "Vetted Safe", val: "Safe" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#E1784F] uppercase">{stat.val}</p>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MISSION SECTION */}
      <section className="py-48 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-foreground">
              Built for <span className="text-[#4DB6AC]">African Families.</span>
            </h2>
            <p className={`text-xl font-bold uppercase tracking-tight ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              AfriDam is here to protect your glow. Made with pride in Lagos, Nigeria, for the world.
            </p>
            <Link href="/mission" className="inline-flex h-16 px-12 items-center bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all">
              Our Full Story <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#E1784F]/20 blur-[100px] rounded-full" />
            <img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000" className={`relative rounded-[4rem] border border-border grayscale ${isDark ? 'opacity-60' : 'opacity-40'}`} alt="Heritage Care" />
          </div>
        </div>
      </section>

      {/* 6. FEATURES SECTION */}
      <section id="features" className={`py-48 px-6 relative transition-colors ${isDark ? 'bg-black/20' : 'bg-gray-100/50'}`}>
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="text-center space-y-4">
             <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-foreground">Pure & Simple Care</h2>
             <p className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.6em]">Shop • Analysis • Support</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Skin Glow Check", icon: Camera, color: "#4DB6AC", text: "Check your skin instantly with technology that understands you perfectly.", path: "/ai-scanner" },
              { title: "Product Safety Check", icon: Search, color: "#E1784F", text: "Find out instantly if your products are safe and gentle for your skin.", path: "/ai-checker" },
              { title: "Expert Support", icon: Stethoscope, color: isDark ? "#FFF" : "#000", text: "Advice from specialists who understand melanin-rich skin care.", path: "/appointments" }
            ].map((f, i) => (
              <div key={i} onClick={() => handleFeatureAccess(f.path)} className={`group p-12 h-full rounded-[4rem] border transition-all duration-500 relative overflow-hidden backdrop-blur-md cursor-pointer bg-card border-border hover:border-[#E1784F]`}>
                <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 border" style={{ backgroundColor: `${f.color}10`, borderColor: `${f.color}40` }}>
                  <f.icon className="w-10 h-10" style={{ color: f.color }} />
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tight uppercase italic text-foreground">{f.title}</h3>
                <p className={`text-sm leading-relaxed mb-10 font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{f.text}</p>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: f.color }}>
                  Access Hub <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section className={`py-48 px-6 transition-colors ${isDark ? 'bg-black/40' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24">
          <div className="space-y-12">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground">Glow-Powered <br/><span className="text-[#4DB6AC]">Wellness</span></h2>
            <p className="text-lg leading-relaxed font-medium opacity-70">Everything you need for your family's skin health. From safe products to expert advice, we've got you covered.</p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="px-10 py-5 border-2 border-[#4DB6AC] text-[#4DB6AC] font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#4DB6AC] hover:text-black transition-all">Get Started</button>
          </div>
          <div className="space-y-12">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-[#E1784F]">Connect With Us</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <MapPin className="text-[#E1784F]" />
                <div>
                  <p className="font-black uppercase text-xs tracking-widest text-foreground">Our Location</p>
                  <p className="text-sm font-bold opacity-70">Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <Mail className="text-[#E1784F]" />
                <div>
                  <p className="font-black uppercase text-xs tracking-widest text-foreground">Email</p>
                  <p className="text-sm font-bold opacity-70">hello@afridamai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className={`pt-40 pb-20 px-6 border-t ${isDark ? 'bg-[#151312] border-white/10' : 'bg-white border-border'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-20">
          <div className="md:col-span-4 space-y-8">
            <img src="/logo.png" className="h-20 w-auto" alt="AfriDam Logo" />
            <p className="text-xs font-bold uppercase tracking-widest leading-loose opacity-60">
              Caring for African skin with love and technology. Made for us, by us.
            </p>
          </div>
          <div className="md:col-span-8 flex flex-wrap gap-24">
             <div className="space-y-6">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#E1784F]">Care Portal</p>
                <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Skin Glow Check</li>
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Product Check</li>
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => router.push('/marketplace')}>The Care Shop</li>
                </ul>
             </div>
             <div className="space-y-6">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#4DB6AC]">Help Hub</p>
                <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
                   <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/contact')}>Contact Us</li>
                   <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/mission')}>Our Story</li>
                   <li className="hover:text-[#4DB6AC] cursor-pointer">Privacy Promise</li>
                </ul>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-border text-center">
           <p className="text-[8px] font-black uppercase tracking-[0.6em] opacity-40">© 2026 AfriDam AI. RESTORING DIGNITY IN CARE.</p>
        </div>
      </footer>

      {/* 9. MODALS & POPUPS */}
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