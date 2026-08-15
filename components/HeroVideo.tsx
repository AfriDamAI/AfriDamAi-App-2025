"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";

/**
 * Afridam homepage hero — video background.
 *
 * Drop the delivered assets into /public/videos/:
 *   - afridam-hero.webm   (primary, VP9, muted, ~966KB)
 *   - afridam-hero.mp4    (fallback, H.264, muted, ~1.7MB)
 *   - afridam-hero-poster.jpg  (first frame, shown before the video paints)
 *
 * These three files are in video-for-public-folder/ — copy them to
 * public/videos/ in the project (create the folder if it doesn't exist).
 */

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const revealTransition = {
    duration: 0.9,
    ease: [0.22, 1, 0.36, 1] as const,
  };
  const reducedMotion = useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#141812]">
      {/* Background video — poster covers first paint / slow connections.
          If the user has reduced motion enabled, we skip playback and just
          show the poster frame as a static hero image. */}
      {reducedMotion ? (
        <Image
          src="/videos/afridam-hero-poster.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
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
      )}

      {/* Dark diagonal overlay — keeps the left text block legible without
          flattening the whole frame */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,12,8,0.72) 0%, rgba(10,12,8,0.42) 42%, rgba(10,12,8,0.15) 68%)",
        }}
      />

      {/* Copy block */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-end px-[6vw] pb-[10vh]">
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] text-white text-balance">
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={revealTransition}
                className="inline-block"
              >
                AfriDam
              </motion.span>
            </span>{" "}
            <span className="inline-block overflow-hidden align-bottom">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ ...revealTransition, delay: 0.12 }}
                className="inline-block text-[#E1784F]"
              >
                AI
              </motion.span>
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-sm md:text-lg font-medium leading-relaxed tracking-tight uppercase text-white/70">
            Melanin-rich skin intelligence for clinical scans, verified care, and safer skincare choices.
          </p>

          <div className="mt-11 flex items-center gap-7">
            <a
              href="/collection"
              className="group inline-flex items-center gap-2.5 border-b border-[#E1784F] pb-2 text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-[#4DB6AC] hover:text-[#4DB6AC]"
            >
              Start Skin Scan
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
