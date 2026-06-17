/**
 * 🛡️ AFRIDAM WELLNESS HUB: ELEGANT UNIFIED EDITION (Rule 6 Synergy)
 * Version: 2026.6.3 (Navigation Cleanup & Responsive Polish)
 * Focus: Sophisticated Scaling, (auth) Group Alignment, Rule 6 Compliance.
 */

"use client"

import React from "react"
import {
  Camera, ArrowRight, MapPin, Mail, Heart, ShieldCheck, Activity, Sparkles, Aperture
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import TeamMemberSection from "@/components/team-member-section"

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();

  /**
   * 🛡️ RULE 6 SYNERGY: 
   * High-speed redirection to dedicated auth nodes.
   */
  const navigateToAuth = (type: "login" | "register") => {
    router.push(`/${type}`);
  };

  const handleFeatureAccess = (path: string) => {
    if (user) router.push(path);
    else navigateToAuth("register");
  };

  return (
    <div className="min-h-svh bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 selection:bg-[#E1784F]/30 relative no-scrollbar">

      {/* 🧭 Navigation handled by AppWrapper → Navigation component */}

      {/* 🌪️ 2. HERO */}
      <section className="min-h-[calc(100svh-5rem)] relative px-4 min-[360px]:px-5 sm:px-6 flex items-center">
        <div className="max-w-screen-xl mx-auto w-full grid lg:grid-cols-12 items-center gap-8 md:gap-20 py-12 md:py-16">

          {/* Text + CTA — mobile: col 1-2 of 3; desktop: left 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-none lg:col-span-7 lg:order-1 order-2 gap-6 items-end"
          >
            {/* Badge + Heading + Subtext */}
            <div className="sm:col-span-2 space-y-4 md:space-y-6" style={{ margin: 0 }}>
              <div className="inline-flex items-center gap-2.5 bg-[#E1784F]/5 dark:bg-white/5 px-4 py-2 rounded-full border border-[#E1784F]/10">
                <Sparkles className="text-[#E1784F]" size={12} />
                <span className="text-[9px] font-black capitalize tracking-widest text-[#E1784F]">Cosmetic Excellence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-black leading-[1.1] tracking-tight italic text-black dark:text-white">
                Your <br /> Skin's <br /> <span className="text-[#E1784F]">Best Friend.</span>
              </h1>
              <p className="text-sm sm:text-lg md:text-2xl font-black max-w-lg opacity-25 tracking-tighter leading-tight italic">
                Melanin Aware. <br /> Safe care for skin of color.
              </p>
            </div>

            {/* CTA Button — stacks beside text on mobile, full-width below on lg */}
            <button
              onClick={() => router.push("/public-scan")}
              className="group sm:col-span-1 lg:col-span-full h-16 md:h-20 px-6 md:px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black capitalize text-[10px] md:text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-4 md:gap-6 active:scale-95 transition-all sm:justify-self-end lg:justify-self-start self-end w-full sm:w-auto lg:w-fit"
            >
              Start Now <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Image Card — full width on mobile (order-1), right 5 cols on desktop */}
          <div className="lg:col-span-5 relative max-w-sm sm:max-w-md mx-auto w-full lg:order-2 order-1">
            <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden border-[10px] border-white dark:border-[#121212] shadow-2xl bg-muted/20 relative group">
              <img
                src="./molle.png"
                alt="AfriDam"
                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[2px] bg-[#E1784F] shadow-[0_0_30px_5px_#E1784F] z-20"
                />
              </div>
              <Link
                href="/public-scan"
                className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-6 bg-black/80 hover:bg-black/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 flex items-center gap-4 sm:gap-5 cursor-pointer active:scale-95 transition-all outline-none"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4DB6AC] rounded-xl sm:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                  <Camera size={20} />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black capitalize tracking-widest text-white italic">Analysis Active</p>
                    <p className="text-[9px] font-bold text-[#4DB6AC] uppercase tracking-widest flex items-center gap-1">Scan <ArrowRight size={10} /></p>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6, repeat: Infinity }} className="h-full bg-[#E1784F]" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 🎥 3. THE VISUAL FLOW */}
      <section className="py-20 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5 border-y border-black/5 dark:border-white/5">
        <div className="max-w-screen-xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <span className="text-[#E1784F] text-[10px] font-black capitalize tracking-widest opacity-40">Simple English Approach</span>
            <h2 className="text-4xl md:text-6xl font-black capitalize italic tracking-tighter leading-tight">Simple Path. <br />Pure Results.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 bg-white dark:bg-black rounded-[3rem] border border-black/5 dark:border-white/5 space-y-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xl italic">01</div>
              <h3 className="text-2xl font-black italic leading-none">Snap a <br />Photo</h3>
              <p className="text-[11px] font-bold opacity-30 leading-relaxed tracking-tight">Capture your skin concern clearly under soft, natural light.</p>
              <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-[2.5rem] relative border border-black/5 dark:border-white/5 flex items-center justify-center">
                <div className="p-8 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 shadow-xl">
                  <Aperture size={40} className="text-[#E1784F]" />
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#E1784F] text-white rounded-[3rem] space-y-8 shadow-2xl relative overflow-hidden group">
              <div className="w-14 h-14 rounded-2xl bg-white text-[#E1784F] flex items-center justify-center font-black text-xl italic">02</div>
              <h3 className="text-2xl font-black capitalize italic leading-none text-white">Instant <br />Check</h3>
              <p className="text-[11px] font-bold opacity-80 leading-relaxed tracking-tight">We check your scan against cosmetic health standards for melanin.</p>
              <div className="aspect-square bg-black/10 rounded-[2.5rem] flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="w-24 h-24 border-2 border-dashed border-white/30 rounded-full flex items-center justify-center">
                  <Activity size={32} />
                </motion.div>
              </div>
            </div>

            <div className="p-10 bg-white dark:bg-black rounded-[3rem] border border-black/5 dark:border-white/5 space-y-8 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-[#4DB6AC] text-white flex items-center justify-center font-black text-xl italic">03</div>
              <h3 className="text-2xl font-black italic leading-none">Get the <br />Answer</h3>
              <p className="text-[11px] font-bold opacity-30 leading-relaxed tracking-tight">Receive immediate results and guidance for your skin journey.</p>
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
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.9] max-w-5xl text-black dark:text-white">
            "Heritage is <br /> our <span className="text-[#4DB6AC]">Foundation</span>, <br /> Skin is our <span className="text-[#E1784F]">Legacy</span>."
          </h2>
          <p className="text-[10px] font-black tracking-[0.5em] opacity-20 mt-16 italic">A Founder's Promise</p>
        </div>
      </section>

      {/* 🧪 5. CARE SOLUTIONS */}
      <section id="features" className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5">
        <div className="max-w-screen-xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Check Skin", icon: Camera, text: "A precision scan to verify your skin health.", path: "/public-scan", color: "#E1784F" },
              { title: "Safe Choice", icon: ShieldCheck, text: "Verify if your products are safe for melanin.", path: "/ingredient-analyzer", color: "#4DB6AC" }
            ].map((f, i) => (
              <div key={i} onClick={() => f.path === '/public-scan' ? router.push(f.path) : handleFeatureAccess(f.path)} className="group p-8 md:p-12 lg:p-16 bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[2.5rem] md:rounded-[4rem] hover:border-[#E1784F] transition-all cursor-pointer shadow-sm">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 text-white shadow-lg" style={{ backgroundColor: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-4xl font-black italic capitalize tracking-tighter mb-4 leading-none">{f.title}</h3>
                <p className="text-[12px] font-bold capitalize tracking-widest opacity-30 leading-relaxed mb-10 max-w-xs">{f.text}</p>
                <div className="flex items-center gap-4 text-[10px] font-black capitalize tracking-widest" style={{ color: f.color }}>Start Now <ArrowRight size={16} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👥 6. TEAM MEMBERS */}
      <TeamMemberSection />

      {/* 🏛️ 7. CONTACT & ACTION */}
      <section id="contact" className="py-16 md:py-24 px-6 md:px-20">
        <div className="max-w-screen-xl mx-auto grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="space-y-10">
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black capitalize italic tracking-tighter leading-[0.85] text-black dark:text-white">Get <br /><span className="text-[#4DB6AC]">Started.</span></h2>
            <p className="text-xl md:text-2xl font-black opacity-20 tracking-tighter italic">Join the movement for <br />Melanin-Rich Health.</p>
            <button onClick={() => navigateToAuth("register")} className="w-full md:w-auto h-20 px-16 bg-[#4DB6AC] text-black font-black capitalize text-[11px] tracking-widest rounded-2xl shadow-xl hover:scale-105 transition-all">Create Profile</button>
          </div>
          <div className="space-y-16">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black capitalize italic tracking-tighter text-[#E1784F]">Contact.</h2>
            <div className="space-y-12">
              <div className="flex gap-8 items-center">
                <MapPin className="text-[#E1784F]" size={32} />
                <div>
                  <p className="font-black text-[9px] tracking-[0.5em] opacity-20">Lagos HQ</p>
                  <p className="text-2xl font-black italic capitalize tracking-tighter text-black dark:text-white">Nigeria</p>
                </div>
              </div>
              <div className="flex gap-8 items-center">
                <Mail className="text-[#E1784F]" size={32} />
                <div>
                  <p className="font-black capitalize text-[9px] tracking-[0.5em] opacity-20">Direct</p>
                  <p className="text-2xl font-black italic tracking-tighter text-black dark:text-white">hello@afridamai.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏷️ Footer rendered by app-wrapper.tsx */}
    </div>
  )
}
