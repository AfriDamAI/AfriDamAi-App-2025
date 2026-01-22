/**
 * 🛡️ AFRIDAM HOME CONTENT (Rule 6 Synergy)
 * Version: 2026.1.22 (Bypass Integration)
 * Focus: High-Precision Direct Routing & Clinical Disclaimers.
 */

"use client";

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Zap, ShieldCheck, Sparkles, Camera, Info } from "lucide-react"
import { OurProductsSection } from "./our-product-section"
import { useRouter } from "next/navigation"; // 🚀 Added for Rule 6
import { useAuth } from "@/providers/auth-provider"; // 🚀 Added to check session

export default function HomePageContent() {
  const router = useRouter();
  const { user } = useAuth();

  /**
   * 🚀 RULE 6 EXPRESS BYPASS
   * Ensures clicking 'Start Journey' or 'Analyze' goes straight to the tool
   * or forces a high-speed registration if the user is a guest.
   */
  const handleAction = (path: string) => {
    if (user) {
      router.push(path);
    } else {
      // 🛡️ OGA FIX: If not logged in, we push to register first
      router.push("/register");
    }
  };

  return (
    <div className="bg-background selection:bg-[#E1784F]/30 overflow-x-hidden">
      
      {/* 🛡️ 1. WORLD-CLASS HERO SECTION */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden px-6 py-12 md:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#E1784F]/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-8 text-left"
            >
              <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-[#E1784F]/10 border border-[#E1784F]/20">
                <Sparkles size={14} className="text-[#E1784F]" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]">
                  Clinical Intelligence
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] text-foreground text-balance">
                Built by <br className="hidden md:block"/> 
                <span className="text-[#E1784F]">Africans</span>, <br/> 
                for Africans.
              </h1>

              <p className="text-md md:text-xl text-muted-foreground font-medium leading-relaxed max-w-xl text-balance">
                Every skin tells a beautiful story. We use smart technology built with love to help you find the gentle care you deserve.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={() => handleAction("/scanner")} // 🚀 Updated
                  className="group px-8 py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-[#E1784F]/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Start Journey <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => handleAction("/analyzer")} // 🚀 Updated
                  className="px-8 py-5 bg-transparent border border-border text-foreground rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] hover:bg-foreground/5 transition-all flex items-center justify-center gap-3"
                >
                  Analyze Ingredients
                </button>
              </div>

              <div className="flex items-center gap-8 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-[#4DB6AC]" size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50 text-foreground">Derm-Approved</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="text-[#E1784F]" size={20} />
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50 text-foreground">Instant Results</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="relative aspect-[4/5] md:aspect-square lg:aspect-auto lg:h-[700px] rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
            >
              <Image
                src="/beautiful-face.jpg"
                alt="Melanin Skin Excellence"
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#E1784F] rounded-2xl flex items-center justify-center text-white">
                    <Camera size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest">AI Scanner Active</p>
                    <p className="text-[8px] text-white/50 uppercase tracking-widest">Scanning for 14+ conditions</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* REMAINDER OF FILE UNCHANGED */}
      <div className="bg-muted/30 py-4 border-y border-border">
        {/* ... */}
      </div>
      {/* ... */}
    </div>
  );
}