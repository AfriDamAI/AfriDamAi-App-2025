"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";

/**
 * Afridam homepage hero — video background.
 *
 * Drop the delivered assets into /public/videos/:
 * - afridam-hero.webm   (primary, VP9, muted, ~966KB)
 * - afridam-hero.mp4    (fallback, H.264, muted, ~1.7MB)
 * - afridam-hero-poster.jpg  (first frame, shown before the video paints)
 */

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  // The mask reveal *is* the motion here, so reduced motion snaps it to the
  // final frame rather than just shortening it.
  const revealTransition = reducedMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.22, 1, 0.36, 1] as const };
  const stagger = (index: number) => ({
    ...revealTransition,
    delay: reducedMotion ? 0 : index * 0.12,
  });

  const maskClass =
    "inline-block overflow-hidden align-bottom pt-[0.12em] -mt-[0.12em] pr-[0.18em] -mr-[0.18em]";

  return (
    // Band 1 of the alternating section rhythm
    <section className="surface-bright relative w-full py-6 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center transition-colors duration-500">
      
      {/* FLOATING CARD FRAME */}
      <div className="relative w-full max-w-6xl h-[65vh] min-h-[480px] max-h-[650px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-black/10 dark:border-white/15 shadow-2xl shadow-black/15 dark:shadow-[#E1784F]/20 bg-[#1a1f18] flex items-end transition-colors duration-500">
        
        {/* Background video / poster */}
        {reducedMotion ? (
          <>
            <Image
              src="/videos/afridam-hero-mobile-poster.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover sm:hidden"
            />
            <Image
              src="/videos/afridam-hero-poster.jpg"
              alt=""
              fill
              priority
              sizes="100vw"
              className="hidden object-cover sm:block"
            />
          </>
        ) : (
          <>
            <video
              className="absolute inset-0 h-full w-full object-cover sm:hidden"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/videos/afridam-hero-mobile-poster.jpg"
            >
              <source src="/videos/afridam-hero-mobile.webm" type="video/webm" />
              <source src="/videos/afridam-hero-mobile.mp4" type="video/mp4" />
            </video>
            <video
              ref={videoRef}
              className="absolute inset-0 hidden h-full w-full object-cover sm:block"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/videos/afridam-hero-poster.jpg"
            >
              <source src="/videos/afridam-hero.webm" type="video/webm" />
              <source src="/videos/afridam-hero.mp4" type="video/mp4" />
            </video>
          </>
        )}

        {/* Gradient Scrim (Bottom to Top)
          This ensures the white text ALWAYS pops perfectly against the video, 
          while leaving the top portion (the doctor's face) fully visible. 
        */}
        <div className="absolute inset-0 pointer-events-none z-0 bg-gradient-to-t from-[#0a0c08] via-[#0a0c08]/50 to-transparent" />

        {/* Copy block */}
        <div className="relative z-10 w-full p-6 sm:p-10 md:p-14">
          <div className="max-w-4xl">
            {/* Scaled down text size slightly for better breathing room */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-white text-balance drop-shadow-sm">
              <span className={maskClass}>
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={stagger(0)}
                  className="inline-block"
                >
                  AfriDam
                </motion.span>
              </span>{" "}
              <span className={maskClass}>
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={stagger(1)}
                  className="inline-block text-[#E1784F]"
                >
                  AI
                </motion.span>
              </span>
            </h1>

            {/* Refined Clinical Copy */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(2)}
              className="mt-4 sm:mt-5 max-w-xl text-xs sm:text-sm md:text-base font-black leading-relaxed tracking-[0.15em] uppercase text-white/90 drop-shadow-md"
            >
              Melanin rich-skin decoded.
            </motion.p>

            {/* Premium CTA Pill Button with Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={stagger(3)}
              className="mt-6 sm:mt-8 flex items-center"
            >
              <a
                href="/public-scan"
                className="group inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-7 py-3.5 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all duration-300 hover:bg-[#E1784F] hover:border-[#E1784F] active:scale-95"
              >
                Start Skin Scan
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}