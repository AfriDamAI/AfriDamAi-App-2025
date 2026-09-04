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

  // overflow-hidden is what masks the slide-up, but it was also clipping the
  // italic overhang on the last glyph (the "I" of AI lost its right edge) and
  // the cap-height that leading-[0.9] pushes above the line box. Padding opens
  // the mask on those two edges; the matching negative margin keeps layout
  // byte-identical. Deliberately no padding-bottom — that edge has to stay
  // tight or the text peeks out before it animates in.
  const maskClass =
    "inline-block overflow-hidden align-bottom pt-[0.12em] -mt-[0.12em] pr-[0.18em] -mr-[0.18em]";

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#141812]">
      {/* Background video / poster.
          Two source sets, swapped by breakpoint via Tailwind's responsive
          display utilities (hidden/sm:hidden) rather than object-fit tricks:
          - Below sm: the true 9:16 vertical cut — full-bleed object-cover
            with no crop trade-off, since its shape already matches a phone
            screen.
          - From sm up: the original 16:9 landscape cut, same as before. */}
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
      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-end px-[6vw] pb-[20vh]">
        <div className="max-w-5xl">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black italic uppercase tracking-tighter leading-[0.9] text-white text-balance">
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

          {/* Subtitle and CTA join the same stagger — previously only the
              heading animated, so the rest of the block popped in flat. */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(2)}
            className="mt-6 max-w-xl text-sm md:text-lg font-medium leading-relaxed tracking-tight uppercase text-white/70"
          >
            Melanin-rich skin intelligence for clinical scans, verified care, and safer skincare choices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={stagger(3)}
            className="mt-11 flex items-center gap-7"
          >
            <a
              href="/public-scan"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}