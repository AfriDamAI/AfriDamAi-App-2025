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
    label: "A skin check-in",
    caption: "Take a moment to notice how your skin feels and changes.",
    alt: "Woman examining her face in a mirror with one hand on her cheek",
  },
  {
    src: "/images/community/woman-2.jpg",
    label: "Digital skin scan",
    caption: "A phone-based scan can help you explore your skin concerns.",
    alt: "Woman looking into a phone camera with a digital skin analysis overlay",
  },
  {
    src: "/images/community/woman-3.jpg",
    label: "At-home scan",
    caption: "Explore your skin from the comfort of home.",
    alt: "Woman's face framed on a phone screen during a digital skin scan",
  },
  {
    src: "/images/community/woman-4.jpg",
    label: "Skin insights",
    caption: "Clear visual cues can make skin observations easier to follow.",
    alt: "Woman's face with a digital overlay highlighting pigmentation, acne, texture, and hydration",
  },
  {
    src: "/images/community/woman-5.jpg",
    label: "Guidance on the go",
    caption: "Keep useful skincare guidance close at hand.",
    alt: "Woman holding a phone displaying a skincare app",
  },
  {
    src: "/images/community/woman-6.jpg",
    label: "Care from home",
    caption: "Connect with a skincare professional from wherever you are.",
    alt: "Woman smiling during a video consultation with a clinician on her phone",
  },
  {
    src: "/images/community/woman-7.jpg",
    label: "A dermatologist's perspective",
    caption: "Talk through your skin concerns in a one-to-one consultation.",
    alt: "Dermatologist speaking with a patient across a desk",
  },
  {
    src: "/images/community/woman-8.jpg",
    label: "A moment of self-care",
    caption: "Make time to check in with your skin and care for yourself.",
    alt: "Smiling woman gently touching her face while looking in a mirror",
  },
];

const AUTOPLAY_INTERVAL = 3000;

export default function CommunityCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // How many slide positions the track can actually stop at. Lower than
  // entries.length, because the last screenful of cards is already visible
  // once the track hits max scroll — see lastReachableIndex below.
  const [reachableCount, setReachableCount] = useState(entries.length);
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

  // Now that a whole number of cards fills the viewport, the track runs out of
  // scroll before the final card reaches the left edge. Advancing past that
  // point scrolls nowhere while the scroll handler snaps activeIndex back,
  // which reads as the carousel stalling. Cap the index at the last position
  // the track can genuinely stop on.
  const lastReachableIndex = () => {
    const track = trackRef.current;
    if (!track) return entries.length - 1;

    const children = Array.from(track.children) as HTMLElement[];
    const maxScroll = track.scrollWidth - track.clientWidth;

    for (let i = 0; i < children.length; i++) {
      if (children[i].offsetLeft - track.offsetLeft >= maxScroll - 1) return i;
    }
    return children.length - 1;
  };

  // Card count per view is breakpoint-driven, so remeasure on resize.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const recount = () => setReachableCount(lastReachableIndex() + 1);
    recount();

    const observer = new ResizeObserver(recount);
    observer.observe(track);

    return () => observer.disconnect();
  }, []);

  const handlePrev = () => {
    pauseAutoplay();
    const previous = activeIndex <= 0 ? reachableCount - 1 : activeIndex - 1;
    setActiveIndex(previous);
    scrollToIndex(previous);
    scheduleResume();
  };

  const handleNext = () => {
    pauseAutoplay();
    const next = activeIndex + 1 >= reachableCount ? 0 : activeIndex + 1;
    setActiveIndex(next);
    scrollToIndex(next);
    scheduleResume();
  };

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((current) => {
        const next = current + 1 >= reachableCount ? 0 : current + 1;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused, reachableCount]);

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
    // Band 2 of the alternating section rhythm — see `surface-*` in globals.css.
    <section className="surface-dim relative w-full overflow-hidden py-24 text-black dark:text-white md:py-32 transition-colors duration-500">
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
              Every skin type <span className="text-[#E1784F]">deserves</span> care.
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
              className="group relative shrink-0 snap-start overflow-hidden rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/[0.03] basis-full sm:basis-[calc((100%-1.5rem)/2)] lg:basis-[calc((100%-3rem)/3)] xl:basis-[calc((100%-4.5rem)/4)]"
            >
              <div className="relative aspect-[4/4.4] overflow-hidden bg-black/5 dark:bg-white/5">
                {/* One photo, filling the card edge to edge. Anchored high so
                    what the crop takes is the bottom of the frame, never the
                    face. Per-entry `focus` overrides it when a shot sits low. */}
                <Image
                  src={entry.src}
                  alt={entry.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                  style={{ objectPosition: entry.focus ?? "50% 20%" }}
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
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

        {/* One dot per position the track can actually stop at, not one per
            card — trailing dots for cards already on screen were unclickable. */}
        <div className="mt-10 flex items-center gap-2">
          {entries.slice(0, reachableCount).map((_, i) => (
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
