"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: "s1",
    tagline: "Neural Intelligence",
    title: "AI Powered <br/> Skin Analysis",
    subtitle: "Handcrafted products vetted by clinical data.",
    img: "/hero-1.jpg",
  },
  {
    id: "s2",
    tagline: "Sustainable Heritage",
    title: "African <br/> Botanicals",
    subtitle: "Handcrafted from native, ethically sourced ingredients.",
    img: "/hero-2.jpg",
  },
  {
    id: "s3",
    tagline: "Ethical Protocol",
    title: "Sustainable <br/> & Ethical",
    subtitle: "Packaging and sourcing protocols you can trust.",
    img: "/hero-3.jpg",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const delay = 5000;

  useEffect(() => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const goTo = (i: number) => setIndex(i);

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-16 rounded-[3rem] overflow-hidden shadow-2xl border border-border group">
      <div className="relative h-[450px] md:h-[550px] w-full bg-muted">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={slide.img}
              alt={slide.title.replace("<br/>", " ")}
              fill
              className="object-cover scale-105"
              priority={i === 0}
            />

            {/* 🛡️ RE-ENFORCED: Clinical Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-center px-8 md:px-20">
              <div className="max-w-2xl space-y-6">
                <motion.div 
                   initial={{ opacity: 0, y: 20 }}
                   animate={i === index ? { opacity: 1, y: 0 } : {}}
                   className="inline-flex items-center gap-3 px-4 py-2 bg-[#E1784F]/20 backdrop-blur-md border border-[#E1784F]/30 rounded-full"
                >
                  <Sparkles size={12} className="text-[#E1784F]" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">
                    {slide.tagline}
                  </span>
                </motion.div>

                <motion.h2 
                   initial={{ opacity: 0, y: 20 }}
                   animate={i === index ? { opacity: 1, y: 0 } : {}}
                   transition={{ delay: 0.1 }}
                   className="text-4xl md:text-7xl font-black italic uppercase tracking-tighter text-white leading-[0.9]"
                   dangerouslySetInnerHTML={{ __html: slide.title }}
                />
                
                <motion.p 
                   initial={{ opacity: 0, y: 20 }}
                   animate={i === index ? { opacity: 1, y: 0 } : {}}
                   transition={{ delay: 0.2 }}
                   className="text-sm md:text-lg font-medium text-white/70 max-w-md tracking-tight uppercase"
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 🏛️ CONTROLS: Refined for Clinical Look */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          aria-label="Previous"
          onClick={prev}
          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl text-white rounded-2xl border border-white/10 hover:bg-[#E1784F] transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          aria-label="Next"
          onClick={next}
          className="w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-xl text-white rounded-2xl border border-white/10 hover:bg-[#E1784F] transition-all"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* 🎯 INDICATORS: Aligned with AfriDam Orange */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`transition-all duration-500 rounded-full ${
              i === index ? "w-10 h-2 bg-[#E1784F]" : "w-2 h-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}