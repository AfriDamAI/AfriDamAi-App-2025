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
  ShieldCheck
} from "lucide-react"

import { AuthModals } from "@/components/auth-modals"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider" // Ensure theme hook is imported
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LandingPage() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme(); // Use the global theme provider
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<"signin" | "signup" | any>("signin");
  const [scrolled, setScrolled] = useState(false);

  // Define isDark based on the current theme state
  const isDark = theme === "dark";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      
      {/* 1. NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-8 ${scrolled ? (isDark ? 'bg-[#1C1A19]/90 backdrop-blur-3xl border-b border-white/5 py-4' : 'bg-white/90 backdrop-blur-3xl border-b black/5 py-4') : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-6 group cursor-pointer">
            <img 
              src="/logo.png" 
              alt="AfriDam AI" 
              className={`h-16 md:h-20 w-auto object-contain transition-all duration-500 ${isDark ? 'brightness-100' : 'brightness-90'}`} 
            />
            <div className="hidden md:flex flex-col border-l border-border pl-6">
              <span className={`text-[10px] font-black uppercase tracking-[0.5em] leading-none ${isDark ? 'text-[#E1784F]' : 'text-[#C55A32]'}`}>
                Your Skin, Decoded
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <button 
              onClick={toggleTheme}
              className={`p-3 rounded-xl border transition-all ${isDark ? 'bg-white/5 border-white/10 text-yellow-400 hover:bg-white/10' : 'bg-black/5 border-black/10 text-indigo-600 hover:bg-black/10'}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
               <Link href="/mission" className="hover:text-[#E1784F] transition-colors uppercase">Our Mission</Link>
               <a href="#features" className="hover:text-[#E1784F] transition-colors uppercase">Technology</a>
               <Link href="/contact" className="hover:text-[#E1784F] transition-colors uppercase">Support Hub</Link>
            </div>

            <div className="flex items-center gap-8">
               {user ? (
                 <Link href="/dashboard" className={`px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] transition-all shadow-2xl ${isDark ? 'bg-[#F7F3EE] text-[#1C1A19]' : 'bg-[#1C1A19] text-white'}`}>Access Portal</Link>
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

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-32 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 items-center gap-20 relative z-10">
          <div className="lg:col-span-7 space-y-12">
            <div className={`inline-flex items-center gap-3 border px-5 py-2.5 rounded-full ${isDark ? 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20 text-[#4DB6AC]' : 'bg-[#4DB6AC]/5 border-[#4DB6AC]/30 text-[#2D8E85]'}`}>
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Advancing African Dermatology</span>
            </div>

            <h1 className="text-7xl md:text-[8.5rem] font-black leading-[0.85] tracking-tighter uppercase italic">
              Instant <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E1784F] via-[#F0A287] to-[#4DB6AC]">AI Analysis.</span>
            </h1>

            <p className={`text-xl md:text-2xl leading-relaxed max-w-xl font-medium ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              Clinical-grade dermal assessment optimized for melanin-rich skin. Get immediate insights with our proprietary vision engine.
            </p>

            <button 
              onClick={() => handleFeatureAccess("/ai-scanner")}
              className="group relative px-12 py-8 bg-[#E1784F] text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all"
            >
              Start Instant Analysis <ChevronRight className="ml-3 inline w-5 h-5" />
            </button>
          </div>

          <div className="lg:col-span-5 relative hidden lg:block">
            <div className={`relative z-10 p-6 border rounded-[5.5rem] shadow-2xl backdrop-blur-sm ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
               <div className="rounded-[4.5rem] aspect-[4/5] overflow-hidden relative border-4 border-black/20">
                  <img src="https://images.unsplash.com/photo-1515688594390-b649af70d282?q=80&w=800" className="w-full h-full object-cover grayscale brightness-50" alt="Scanner" />
                  <div className="absolute inset-0 p-10 flex flex-col justify-between items-center">
                     <div className="w-full flex justify-between">
                        <div className="w-14 h-14 border-t-4 border-l-4 border-[#E1784F] rounded-tl-3xl" />
                        <div className="w-14 h-14 border-t-4 border-r-4 border-[#E1784F] rounded-tr-3xl" />
                     </div>
                     <div className="w-full p-8 rounded-[2.5rem] bg-black/60 backdrop-blur-xl border border-white/10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC] animate-pulse">Analysis Engine Active</span>
                        <div className="h-1.5 w-full bg-white/10 rounded-full mt-4 overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 2, repeat: Infinity }} className="h-full bg-gradient-to-r from-[#4DB6AC] to-[#E1784F]" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HONEST CLINICAL ANCHORS */}
      <section className={`py-24 border-y transition-colors duration-500 ${isDark ? 'border-white/5 bg-black/20' : 'border-black/5 bg-muted'}`}>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "AI Support", val: "24/7" },
            { label: "Dermal Focus", val: "Melanin" },
            { label: "Expert Network", val: "Verified" },
            { label: "Ingredients", val: "Vetted" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
              <p className="text-4xl md:text-5xl font-black italic tracking-tighter text-[#E1784F] uppercase">{stat.val}</p>
              <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. THE MISSION CTA */}
      <section className="py-48 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-8">
            <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none text-foreground">
              Decoding <span className="text-[#4DB6AC]">African Skin.</span>
            </h2>
            <p className={`text-xl font-bold uppercase tracking-tight ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
              AfriDam AI exists to bridge the diagnostic gap. Engineered in Lagos, Nigeria, for the global diaspora.
            </p>
            <Link 
              href="/mission" 
              className="inline-flex h-16 px-12 items-center bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:brightness-110 shadow-2xl transition-all"
            >
              Explore Our Mission <ArrowRight className="ml-3 w-4 h-4" />
            </Link>
          </div>
          <div className="relative group">
            <div className="absolute inset-0 bg-[#E1784F]/20 blur-[100px] rounded-full group-hover:scale-110 transition-transform duration-700" />
            <img 
              src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=1000" 
              className={`relative rounded-[4rem] border border-border grayscale transition-opacity ${isDark ? 'opacity-60' : 'opacity-40'}`} 
              alt="Clinical Mission" 
            />
          </div>
        </div>
      </section>

      {/* 5. FEATURES GRID */}
      <section id="features" className={`py-48 px-6 relative transition-colors duration-500 ${isDark ? 'bg-black/20' : 'bg-gray-100/50'}`}>
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="text-center space-y-4">
             <h2 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-foreground">Clinical Precision</h2>
             <p className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.6em]">Marketplace • Analysis • Consultation</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Instant AI Analysis", icon: Camera, color: "#4DB6AC", text: "Scan for common dermal conditions with AI optimized for African skin types.", path: "/ai-scanner" },
              { title: "Ingredient Checker", icon: Search, color: "#E1784F", text: "Instantly detect harmful chemicals or bleaching agents in product labels.", path: "/ai-checker" },
              { title: "Talk to a Doctor", icon: Stethoscope, color: isDark ? "#FFF" : "#000", text: "Professional consultations with dermatologists who understand melanin-rich skin.", path: "/appointments" }
            ].map((f, i) => (
              <div 
                key={i}
                onClick={() => handleFeatureAccess(f.path)}
                className={`group p-12 h-full rounded-[4rem] border transition-all duration-500 relative overflow-hidden backdrop-blur-md cursor-pointer ${isDark ? 'bg-card border-border hover:border-[#4DB6AC]/50' : 'bg-card border-border hover:shadow-2xl'}`}
              >
                <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center mb-12 border" style={{ backgroundColor: `${f.color}10`, borderColor: `${f.color}40` }}>
                  <f.icon className="w-10 h-10" style={{ color: f.color }} />
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tight uppercase italic text-foreground">{f.title}</h3>
                <p className={`text-sm leading-relaxed mb-10 font-medium ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>{f.text}</p>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all" style={{ color: f.color }}>
                  Access Terminal <ArrowRight size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CONTACT SECTION */}
      <section className={`py-48 px-6 transition-colors duration-500 ${isDark ? 'bg-black/40' : 'bg-muted'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-24">
          <div className="space-y-12">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-foreground text-foreground">AI-Powered <br/><span className="text-[#4DB6AC]">Skincare</span></h2>
            <p className={`text-lg leading-relaxed font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Experience personalized skincare recommendations powered by artificial intelligence. Our advanced technology analyzes melanin-rich skin types to suggest perfect Marketplace products.</p>
            <button onClick={() => handleFeatureAccess("/ai-scanner")} className="px-10 py-5 border-2 border-[#4DB6AC] text-[#4DB6AC] font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#4DB6AC] hover:text-black transition-all">Try AI Scanner</button>
          </div>
          <div className="space-y-12">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none text-[#E1784F]">Contact Us</h2>
            <div className="space-y-8">
              <div className="flex gap-6 items-start">
                <MapPin className="text-[#E1784F] shrink-0" />
                <div>
                  <p className="font-black uppercase text-xs tracking-widest mb-1 text-foreground">Address</p>
                  <p className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Innovation Hub, Tech District, Lagos, Nigeria</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <Phone className="text-[#E1784F] shrink-0" />
                <div>
                  <p className="font-black uppercase text-xs tracking-widest mb-1 text-foreground">Phone</p>
                  <p className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>+234 90 256 43150</p>
                </div>
              </div>
              <div className="flex gap-6 items-start">
                <Mail className="text-[#E1784F] shrink-0" />
                <div>
                  <p className="font-black uppercase text-xs tracking-widest mb-1 text-foreground">Email</p>
                  <p className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>info@afridamai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. THEME-AWARE FOOTER */}
      <footer className={`pt-40 pb-20 px-6 border-t transition-colors duration-500 ${isDark ? 'bg-[#151312] border-white/10' : 'bg-card border-border'}`}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-20">
          <div className="md:col-span-4 space-y-8">
            <img 
              src="/logo.png" 
              className={`h-20 w-auto transition-all ${isDark ? 'brightness-100' : 'brightness-90'}`} 
              alt="AfriDam AI" 
            />
            <p className={`text-xs font-bold uppercase tracking-widest leading-loose ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Ethical AI research and development for Pan-African skin health. Based in Lagos, Nigeria.
            </p>
          </div>
          <div className="md:col-span-8 flex flex-wrap gap-24">
             <div className="space-y-6">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#E1784F]">Clinical Node</p>
                <ul className={`space-y-4 text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-foreground'}`}>
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-scanner')}>Skin Scanner</li>
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => handleFeatureAccess('/ai-checker')}>Ingredient Checker</li>
                   <li className="hover:text-[#E1784F] cursor-pointer" onClick={() => router.push('/marketplace')}>Marketplace</li>
                </ul>
             </div>
             <div className="space-y-6">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-[#4DB6AC]">Support Hub</p>
                <ul className={`space-y-4 text-[10px] font-black uppercase tracking-widest transition-colors ${isDark ? 'text-gray-300 hover:text-white' : 'text-foreground'}`}>
                   <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/contact')}>Contact Us</li>
                   <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/profile')}>User Profile</li>
                   <li className="hover:text-[#4DB6AC] cursor-pointer" onClick={() => router.push('/mission')}>Our Mission</li>
                   <li className="hover:text-[#4DB6AC] cursor-pointer">Privacy Protocol</li>
                </ul>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-border text-center">
           <p className={`text-[8px] font-black uppercase tracking-[0.6em] ${isDark ? 'text-gray-600' : 'text-gray-500'}`}>© 2026 AfriDam AI Clinical Systems. All Rights Reserved.</p>
        </div>
      </footer>

      <AuthModals isOpen={isAuthModalOpen} type={authType} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  )
}