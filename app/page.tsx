/**
 * 🛡️ AFRIDAM WELLNESS HUB: ELEGANT UNIFIED EDITION (Rule 6 Synergy)
 * Version: 2026.6.4
 * Focus: Sophisticated Scaling, (auth) Group Alignment, Rule 6 Compliance.
 */

"use client"

import React from "react"
import {
  Camera, ArrowRight, ShieldCheck
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import TeamMemberSection from "@/components/team-member-section"
import CareHubSection from "@/components/care-hub-section"
import PedigreeSection from "@/components/pedigree-section"
import Image from "next/image";
import FaqChatbot from "@/components/FaqChatbot"
import PartnersSection from "@/components/PartnersSection"
import HeroVideo from "@/components/HeroVideo"; 
import CommunityCarousel from "@/components/CommunityCarousel";


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

      {/* 🎬 1. BRAND HERO VIDEO (now first thing seen on the page) */}
      <HeroVideo />

      {/* 🌍 1.5 COMMUNITY CAROUSEL — diverse skin tones, right after the video */}
      <CommunityCarousel />

      {/* 🎥 2. THE VISUAL FLOW */}
<section className="surface-bright py-20 md:py-36 px-6 border-y border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
  <div className="max-w-screen-xl mx-auto space-y-16 md:space-y-20">

    {/* Section Header */}
    <div className="text-center space-y-4 max-w-2xl mx-auto">
      <span className="text-[#E1784F] text-xs font-black uppercase tracking-[0.2em] opacity-90">
        Simple English Approach
      </span>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black capitalize italic tracking-tighter leading-tight text-black dark:text-white">
        Simple Path. <br className="hidden md:block" />
        <span className="text-[#E1784F]">Pure Results.</span>
      </h2>
    </div>

    {/* Steps Grid: 2 White Cards & 2 Brand Orange Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">

      {/* STEP 01 - WHITE CARD */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="p-8 md:p-10 bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-8 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#E1784F]/10 text-[#E1784F] flex items-center justify-center font-black text-xl italic border border-[#E1784F]/20">
            01
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black italic leading-tight text-black dark:text-white">
              Snap a <br />Photo
            </h3>
            <p className="text-sm sm:text-base font-semibold text-black/70 dark:text-white/70 leading-relaxed tracking-tight">
              Capture your skin concern clearly under soft, natural light.
            </p>
          </div>
        </div>

      <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-[2rem] relative border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden group">
  <Image
    src="/videos/step%20one.jpg"
    alt="Taking a photo of a skin concern"
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
    className="object-cover rounded-[2rem]"
  />
</div>
      </motion.div>

      {/* STEP 02 - BRAND ORANGE CARD */}
<motion.div
  whileHover={{ y: -6 }}
  transition={{ duration: 0.3 }}
  className="p-8 md:p-10 bg-[#E1784F] text-white rounded-[2.5rem] space-y-8 shadow-xl shadow-[#E1784F]/25 relative overflow-hidden flex flex-col justify-between"
>
  <div className="space-y-6 relative z-10">
    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-xl italic border border-white/30">
      02
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl sm:text-3xl font-black capitalize italic leading-tight text-white">
        Instant <br />Check
      </h3>
      <p className="text-sm sm:text-base font-semibold text-white/95 leading-relaxed tracking-tight">
        We tailor your skin analysis and routine suggestions for melanin-rich skin.
      </p>
    </div>
  </div>

  <div className="aspect-square bg-black/10 rounded-[2rem] flex items-center justify-center relative overflow-hidden border border-white/20 z-10">
    <video
      src="/videos/step two.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover rounded-[2rem] pointer-events-none"
    />
  </div>
</motion.div>
      {/* STEP 03 - WHITE CARD */}
<motion.div
  whileHover={{ y: -6 }}
  transition={{ duration: 0.3 }}
  className="p-8 md:p-10 bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-8 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
>
  <div className="space-y-6">
    <div className="w-14 h-14 rounded-2xl bg-[#4DB6AC]/10 text-[#4DB6AC] flex items-center justify-center font-black text-xl italic border border-[#4DB6AC]/20">
      03
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl sm:text-3xl font-black italic leading-tight text-black dark:text-white">
        Get the <br />Answer
      </h3>
      <p className="text-sm sm:text-base font-semibold text-black/70 dark:text-white/70 leading-relaxed tracking-tight">
        Receive immediate results and guidance for your skin journey.
      </p>
    </div>
  </div>

  <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-[2rem] relative overflow-hidden border border-black/5 dark:border-white/5 flex items-center justify-center">
    <video
      src="/videos/step three.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover rounded-[2rem] pointer-events-none"
    />
  </div>
</motion.div>

      {/* STEP 04 - BRAND ORANGE CARD */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3 }}
          className="p-8 md:p-10 bg-[#E1784F] text-white rounded-[2.5rem] space-y-8 shadow-xl shadow-[#E1784F]/25 relative overflow-hidden flex flex-col justify-between"
        >
          <div className="space-y-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-xl italic border border-white/30">
              04
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black italic leading-tight text-white">
                Meet the <br />Consultants
              </h3>
              <p className="text-sm sm:text-base font-semibold text-white/95 leading-relaxed tracking-tight">
                Connect your results to real specialist insight and next-step care.
              </p>
            </div>
          </div>

          <div className="aspect-square bg-black/10 rounded-[2rem] relative overflow-hidden border border-white/20 z-10 flex items-center justify-center">
            <video
              src="/videos/step four.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover rounded-[2rem] pointer-events-none"
            />
          </div>
        </motion.div>

      </div> {/* Closes cards grid */}
    </div>   {/* Closes line 296: <div className="max-w-screen-xl..."> */}
  </section>  {/* Closes line 295: <section className="py-20..."> */}

      {/* 📜 4. THE MANIFESTO */}
      <section className="surface-bright relative isolate overflow-hidden py-24 md:py-40 px-6 text-center transition-colors duration-500">
        {/* A restrained brand watermark keeps the message legible in either theme.
            Both washes are tinted to the bright surface rather than a colour of
            their own — anything lighter and this band reads as a dim step in
            dark mode, breaking the alternation. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-white/70 dark:bg-[#050505]/45" />
          <div className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 md:h-[42rem] md:w-[42rem]">
            <Image
              src="/logo.png"
              alt=""
              fill
              sizes="672px"
              className="object-contain opacity-[0.08] mix-blend-multiply dark:opacity-[0.2] dark:brightness-125 dark:mix-blend-screen"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_16%,rgba(255,255,255,0.55)_78%)] dark:bg-[radial-gradient(circle_at_center,transparent_12%,rgba(5,5,5,0.5)_78%)]" />
        </div>

        <div className="relative z-10 max-w-screen-xl mx-auto flex flex-col items-center">
          <Image
            src="/logo.png"
            alt="AfriDam AI"
            width={210}
            height={210}
            className="mb-10 h-auto w-32 object-contain sm:w-40 md:w-48"
          />
          <div className="mb-10 h-px w-16 bg-gradient-to-r from-[#E1784F] to-[#4DB6AC]" />
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.9] max-w-5xl text-black dark:text-white">
            &quot;Where cultural <br /> Roots <span className="text-[#4DB6AC]">Meet</span> <br /> Glowing <span className="text-[#E1784F]">Skin</span>.&quot;
          </h2>
          <p className="text-[10px] font-black tracking-[0.5em] opacity-20 mt-16 italic">A Founder&apos;s Promise</p>
        </div>
      </section>

      {/* 5. CARE SOLUTIONS
      <section id="features" className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5">
        <div className="max-w-screen-xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Check Skin", icon: Camera, text: "A precision scan to verify your skin health.", path: "/public-scan", color: "#E1784F" },
              { title: "Safe Choice", icon: ShieldCheck, text: "Verify if your products are safe for melanin.", path: "/ingredient-analyzer", color: "#4DB6AC" }
            ].map((f) => (
              <div key={f.title} onClick={() => f.path === "/public-scan" ? router.push(f.path) : handleFeatureAccess(f.path)} className="group p-8 md:p-12 lg:p-16 bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[2.5rem] md:rounded-[4rem] hover:border-[#E1784F] transition-all cursor-pointer shadow-sm">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3" style={{ backgroundColor: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-4xl font-black italic capitalize tracking-tighter mb-4 leading-none">{f.title}</h3>
                <p className="text-[12px] font-bold capitalize tracking-widest opacity-30 leading-relaxed mb-10 max-w-xs">{f.text}</p>
                <div className="flex items-center gap-4 text-[10px] font-black capitalize tracking-widest" style={{ color: f.color }}>
                  Start Now <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 5. PEDIGREE */}
      <PedigreeSection />

      {/* 6. CARE HUB + BRAND CTA */}
      <CareHubSection />

      {/* 7. FAQ SECTION */}
      <FaqChatbot />

      {/* 8. TEAM MEMBERS */}
      <TeamMemberSection />
      
      {/* 9. PARTNERS SECTION */}
      <PartnersSection />

      {/* 9. Footer rendered by app-wrapper.tsx */}
    </div>
  )
}
