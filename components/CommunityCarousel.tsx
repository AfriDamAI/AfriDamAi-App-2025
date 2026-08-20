"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Entry = {
  src: string;
  label: string;
  caption: string;
  alt: string;
  /** Optional. Fine-tune crop if a face still looks off-center after the
   *  default top-anchored crop, e.g. "50% 25%" or "50% 10%". */
  focus?: string;
};

const entries: Entry[] = [
  {
    src: "/images/community/woman-1.jpg",
    label: "Deep tone care",
    caption: "Balanced routines for visible, confident skin health.",
    alt: "Community member with deep skin tone",
  },
  {
    src: "/images/community/woman-2.jpg",
    label: "Golden undertones",
    caption: "Guidance shaped around tone, texture, and climate.",
    alt: "Community member with golden undertones",
  },
  {
    src: "/images/community/woman-3.jpg",
    label: "Sensitive skin",
    caption: "Ingredient checks that make daily choices feel simpler.",
    alt: "Community member with sensitive skin",
  },
  {
    src: "/images/community/woman-4.jpg",
    label: "Even glow goals",
    caption: "Support for hyperpigmentation, dryness, and clarity.",
    alt: "Community member with even glow goals",
  },
  {
    src: "/images/community/woman-5.jpg",
    label: "Melanin-first",
    caption: "Care built for every shade, not retrofitted later.",
    alt: "Community member representing melanin-rich skin",
  },
  {
    src: "/images/community/woman-6.jpg",
    label: "Everyday protection",
    caption: "Safer skincare decisions from scan to marketplace.",
    alt: "Community member focused on everyday skin protection",
  },
  {
    src: "/images/community/woman-7.jpg",
    label: "Clinical confidence",
    caption: "Specialist insight when your skin needs a closer look.",
    alt: "Community member representing clinical skin confidence",
  },
  {
    src: "/images/community/woman-8.jpg",
    label: "Healthy texture",
    caption: "Track visible changes with clear, practical next steps.",
    alt: "Community member with healthy skin texture",
  },
  {
    src: "/images/community/woman-9.jpg",
    label: "One standard",
    caption: "A beauty-tech experience designed for the full community.",
    alt: "Community member representing inclusive skincare",
  },
];

const AUTOPLAY_INTERVAL = 3000;

export default function CommunityCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pauseAutoplay = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
    setIsPaused(true);
  };

  // Resumes autoplay a few seconds after touch ends, instead of instantly —
  // so lifting a finger to read a caption doesn't yank the carousel forward.
  const scheduleResume = (delayMs = 3000) => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false);
      resumeTimerRef.current = null;
    }, delayMs);
  };

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    };
  }, []);

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.children[index] as HTMLElement | undefined;
    if (!card) return;

    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const handlePrev = () => {
    pauseAutoplay();
    const previous = activeIndex <= 0 ? entries.length - 1 : activeIndex - 1;
    setActiveIndex(previous);
    scrollToIndex(previous);
    scheduleResume();
  };

  const handleNext = () => {
    pauseAutoplay();
    const next = activeIndex + 1 >= entries.length ? 0 : activeIndex + 1;
    setActiveIndex(next);
    scrollToIndex(next);
    scheduleResume();
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const next = current + 1 >= entries.length ? 0 : current + 1;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const children = Array.from(track.children) as HTMLElement[];
        const trackLeft = track.scrollLeft;
        let closest = 0;
        let closestDist = Infinity;

        children.forEach((child, i) => {
          const dist = Math.abs(child.offsetLeft - track.offsetLeft - trackLeft);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });

        setActiveIndex(closest);
      });
    };

    track.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-[#050505] py-24 text-black dark:text-white md:py-32 transition-colors duration-500">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-black/10 dark:via-white/10 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#4DB6AC]/5 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-16 h-64 w-64 rounded-full bg-[#E1784F]/5 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-screen-xl px-6 md:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 md:mb-20 md:flex-row md:items-end">
          <div>
            <div className="mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-[#E1784F]">
              <span className="h-px w-7 bg-[#E1784F]" />
              Every Tone, One Standard
            </div>
            <h2 className="max-w-[15ch] text-4xl font-black italic leading-tight tracking-tight text-black dark:text-white md:text-6xl">
              Every complexion <span className="text-[#E1784F]">deserves</span> to be understood.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white transition-colors hover:border-[#E1784F] hover:text-[#E1784F]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 dark:border-white/15 text-black dark:text-white transition-colors hover:border-[#E1784F] hover:text-[#E1784F]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          onMouseEnter={pauseAutoplay}
          onMouseLeave={() => scheduleResume(500)}
          onTouchStart={pauseAutoplay}
          onTouchEnd={() => scheduleResume(3000)}
          className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {entries.map((entry) => (
            <figure
              key={entry.src}
              className="group relative w-[65vw] shrink-0 snap-start overflow-hidden rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.03] sm:w-[40vw] md:w-[26vw] lg:w-[20vw]"
            >
              <div className="relative aspect-[4/4.4] overflow-hidden bg-black/5 dark:bg-white/5">
                {/* Blurred backdrop — same photo, scaled and blurred, fills
                    any space the full uncropped photo doesn't reach so
                    there's never a bare black gap. */}
                <Image
                  src={entry.src}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(max-width: 640px) 65vw, (max-width: 768px) 40vw, (max-width: 1024px) 26vw, 20vw"
                  className="scale-125 object-cover opacity-60 blur-2xl"
                />
                {/* Full, uncropped photo on top — nothing hidden */}
                <Image
                  src={entry.src}
                  alt={entry.alt}
                  fill
                  sizes="(max-width: 640px) 65vw, (max-width: 768px) 40vw, (max-width: 1024px) 26vw, 20vw"
                  className="object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-sm font-black italic tracking-tight text-white">{entry.label}</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-white/70">{entry.caption}</p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex items-center gap-2">
          {entries.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => {
                pauseAutoplay();
                setActiveIndex(i);
                scrollToIndex(i);
                scheduleResume();
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-8 bg-[#E1784F]" : "w-1.5 bg-black/25 dark:bg-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}