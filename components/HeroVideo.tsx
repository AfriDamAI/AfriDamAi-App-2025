"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
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

      {/* Copy block with "Your Skin's Best Friend" section */}
      <div className="relative z-10 mx-auto flex h-full max-w-[1280px] items-end px-4 min-[360px]:px-5 sm:px-6 pb-[10vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl w-full space-y-8"
        >
          {/* Badge + Heading + Subtext */}
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2.5 bg-[#E1784F]/5 dark:bg-white/5 px-4 py-2 rounded-full border border-[#E1784F]/10">
              <Sparkles className="text-[#E1784F]" size={12} />
              <span className="text-[9px] font-black capitalize tracking-widest text-[#E1784F]">Clinical Excellence</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-black leading-[1.1] tracking-tight italic text-white">
              Your <br /> Skin&apos;s <br /> <span className="text-[#E1784F]">Best Friend.</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-2xl font-black max-w-lg opacity-70 tracking-tighter leading-tight italic text-white">
              Localized protection. <br /> Safe care for the heritage.
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/public-scan")}
            className="group h-14 md:h-16 px-6 md:px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black capitalize text-[10px] md:text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-4 md:gap-6 active:scale-95 transition-all w-fit"
          >
            Start Now <ArrowRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
