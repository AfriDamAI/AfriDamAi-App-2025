"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Stethoscope, 
  Leaf, 
  ArrowRight,
  Building2,
  CheckCircle2
} from "lucide-react"

interface Partner {
  id: string
  name: string
  location: string
  category: "Strategic Partner" | "Commercial Integration"
  tagline: string
  description: string
  badgeText: string
  icon: React.ReactNode
  accentColor: string
  highlights: string[]
  logoGraphic: React.ReactNode
}

const PARTNERS: Partner[] = [
  {
    id: "jax-lab",
    name: "Jax Lab",
    location: "Canada",
    category: "Strategic Partner",
    tagline: "Health & Wellness, Nature's Way",
    description: "International strategic partner supporting AfriDam AI's global beauty-tech growth and natural formulation alignment.",
    badgeText: "International Growth Partner",
    icon: <Leaf className="w-5 h-5 text-[#E1784F]" />,
    accentColor: "#E1784F",
    highlights: [
      "Cross-border beauty-tech expansion",
      "Natural formulation alignment for dark skin health",
      "Global wellness network integration"
    ],
    logoGraphic: (
      <div className="flex items-center gap-3">
        <img 
          src="/pics/jaxlab.jpeg" 
          alt="Jax Lab Logo" 
          className="w-10 h-10 rounded-xl object-cover border border-[#E1784F]/30 shrink-0"
        />
        <div>
          <span className="font-black text-lg tracking-wider text-white block uppercase italic leading-none">JAX LAB</span>
          <span className="text-[9px] text-[#E1784F] font-bold uppercase tracking-widest">Health & Wellness</span>
        </div>
      </div>
    )
  },
  {
    id: "mahogany-derm",
    name: "Mahogany Dermatology",
    location: "USA",
    category: "Strategic Partner",
    tagline: "Global Dark Skin Clinical Excellence",
    description: "Strategic clinical network supporting AfriDam AI's doctor network and specialist consultation framework.",
    badgeText: "Clinical Network Partner",
    icon: <Stethoscope className="w-5 h-5 text-[#4DB6AC]" />,
    accentColor: "#4DB6AC",
    highlights: [
      "Board-certified dermatologist network integration",
      "Tele-consultation workflow validation",
      "Clinical protocol review for dark skin conditions"
    ],
    logoGraphic: (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#4DB6AC]/10 border border-[#4DB6AC]/30 flex items-center justify-center text-[#4DB6AC] shrink-0">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="font-black text-lg tracking-wider text-white block uppercase italic leading-none">MAHOGANY</span>
          <span className="text-[9px] text-[#4DB6AC] font-bold uppercase tracking-widest">Dermatology USA</span>
        </div>
      </div>
    )
  },
  {
    id: "ene-naturals",
    name: "Ene Naturals",
    location: "Commercial Partner",
    category: "Commercial Integration",
    tagline: "Automated AI Skin Matching Integration",
    description: "First-tier commercial beauty brand using AfriDam AI's 1-line script to automatically scan and match skincare products online.",
    badgeText: "Script Integration Partner",
    icon: <Building2 className="w-5 h-5 text-[#E1784F]" />,
    accentColor: "#E1784F",
    highlights: [
      "Live 1-line script widget deployment",
      "Automated e-commerce product matching",
      "Clean beauty compliance verification"
    ],
    logoGraphic: (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#E1784F]/10 border border-[#E1784F]/30 flex items-center justify-center text-[#E1784F] shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <span className="font-black text-lg tracking-wider text-white block uppercase italic leading-none">ENE NATURALS</span>
          <span className="text-[9px] text-[#E1784F] font-bold uppercase tracking-widest">Clean Beauty Brand</span>
        </div>
      </div>
    )
  }
]

export default function PartnersSection() {
  const [selectedPartner, setSelectedPartner] = useState<Partner>(PARTNERS[0])

  return (
    <section 
          id="partners" 
          className="scroll-mt-20 w-full py-16 md:py-24 bg-[#050505] text-white relative overflow-hidden selection:bg-[#E1784F]/30"
        >
      
      {/* BACKGROUND AMBIANCE */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-[#E1784F]/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-[#4DB6AC]/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-[#E1784F] text-xs font-bold uppercase tracking-widest">
            <Globe size={14} className="text-[#4DB6AC]" />
            <span>Global Ecosystem & Strategic Network</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase italic leading-none">
            Backed By Global <span className="text-[#E1784F]">Clinical</span> & <span className="text-[#4DB6AC]">Tech Partners</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base leading-relaxed">
            AfriDam AI collaborates with dermatology networks, international wellness laboratories, and commercial beauty brands to scale specialized care for dark skin.
          </p>
        </div>

        {/* --- TIER 1: INFINITE MARQUEE TICKER BANNER --- */}
        <div className="relative w-full overflow-hidden py-4 border-y border-white/10 bg-white/[0.015] backdrop-blur-md">
          {/* Gradient Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-20 md:w-32 bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-20 md:w-32 bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none" />

          {/* Marquee Motion Container */}
          <motion.div
            className="flex items-center gap-12 md:gap-20 whitespace-nowrap w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20
            }}
          >
            {/* Repeat list 3 times for continuous horizontal scrolling */}
            {[...PARTNERS, ...PARTNERS, ...PARTNERS].map((partner, index) => (
              <div
                key={`${partner.id}-${index}`}
                onClick={() => setSelectedPartner(partner)}
                className="flex items-center gap-4 cursor-pointer opacity-70 hover:opacity-100 transition-all duration-300 group"
              >
                <div className="p-2 rounded-xl bg-white/[0.05] border border-white/10 group-hover:border-[#E1784F]/50 group-hover:scale-105 transition-all">
                  {partner.logoGraphic}
                </div>
                <div className="hidden sm:block">
                  <span className="text-xs font-semibold text-white/50 group-hover:text-white transition-colors block">
                    {partner.location}
                  </span>
                  <span className="text-[10px] text-[#4DB6AC] font-bold uppercase tracking-wider">
                    {partner.category}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* --- TIER 2: INTERACTIVE PEDIGREE ECOSYSTEM GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: PARTNER SELECTOR CARDS (5 COLS) */}
          <div className="lg:col-span-5 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-white/40 block mb-2 px-1">
              Select Strategic Partner
            </span>
            {PARTNERS.map((partner) => {
              const isSelected = selectedPartner.id === partner.id
              return (
                <motion.div
                  key={partner.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setSelectedPartner(partner)}
                  className={`p-4 md:p-5 rounded-2xl cursor-pointer transition-all border ${
                    isSelected
                      ? "bg-white/[0.06] border-[#E1784F] shadow-lg shadow-[#E1784F]/10"
                      : "bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${partner.accentColor}15`,
                          border: `1px solid ${partner.accentColor}40`,
                        }}
                      >
                        {partner.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-white flex items-center gap-2">
                          {partner.name}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                            {partner.location}
                          </span>
                        </h3>
                        <p className="text-xs text-white/50">{partner.badgeText}</p>
                      </div>
                    </div>
                    <ArrowRight
                      size={18}
                      className={`transition-transform ${
                        isSelected ? "text-[#E1784F] translate-x-1" : "text-white/20"
                      }`}
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* RIGHT: INTERACTIVE FEATURED BREAKDOWN DISPLAY (7 COLS) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedPartner.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl relative overflow-hidden space-y-6 shadow-2xl"
              >
                {/* Glow Accent Circle */}
                <div 
                  className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] pointer-events-none"
                  style={{ backgroundColor: `${selectedPartner.accentColor}25` }}
                />

                {/* Card Header Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div className="flex items-center gap-3">
                    {selectedPartner.logoGraphic}
                  </div>
                  <span 
                    className="text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider"
                    style={{
                      color: selectedPartner.accentColor,
                      borderColor: `${selectedPartner.accentColor}40`,
                      backgroundColor: `${selectedPartner.accentColor}10`
                    }}
                  >
                    {selectedPartner.category}
                  </span>
                </div>

                {/* Tagline & Main Description */}
                <div className="space-y-3">
                  <h4 className="text-xl sm:text-2xl font-black text-white italic tracking-tight">
                    "{selectedPartner.tagline}"
                  </h4>
                  <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                    {selectedPartner.description}
                  </p>
                </div>

                {/* Key Highlights List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-black uppercase tracking-widest text-white/40 block">
                    Strategic Scope & Impact
                  </span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedPartner.highlights.map((item, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5"
                      >
                        <CheckCircle2 size={16} className="shrink-0 text-[#4DB6AC]" />
                        <span className="text-xs md:text-sm text-white/80 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Integration Footer Note */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/50 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={16} className="text-[#4DB6AC]" /> Verified AfriDam AI Ecosystem Partner
                  </span>
                  <span className="text-white/30">Ecosystem 2026</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  )
}