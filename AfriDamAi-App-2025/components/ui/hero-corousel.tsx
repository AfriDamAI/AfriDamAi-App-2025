"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

const slides = [
  {
    id: "s1",
    title: "Natural Skincare, Powered by AI",
    subtitle: "Discover personalized skincare with our AI-powered scanner.",
    img: "/hero-1.jpg",
  },
  {
    id: "s2",
    title: "African Botanicals, Global Quality",
    subtitle: "Handcrafted products made from native ingredients.",
    img: "/hero-2.jpg",
  },
  {
    id: "s3",
    title: "Sustainable & Ethical",
    subtitle: "Packaging and sourcing you can trust.",
    img: "/hero-3.jpg",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef<number | null>(null);
  const delay = 5000;

  useEffect(() => {
    // Auto play
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, delay);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);
  const goTo = (i: number) => setIndex(i);

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-10 rounded-2xl overflow-hidden">
      <div className="relative h-64 sm:h-96 w-full bg-gray-100 dark:bg-gray-800">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            aria-hidden={i !== index}
          >
            {/* Use next/image if images are present in /public; fallback to img if not configured */}
            <Image
              src={slide.img}
              alt={slide.title}
              fill
              className="object-cover"
              priority={i === 0}
            />

            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent dark:from-black/60 flex items-end sm:items-center">
              <div className="p-6 sm:p-12 text-white">
                <h2 className="text-xl sm:text-3xl font-bold drop-shadow-lg">{slide.title}</h2>
                <p className="mt-2 text-sm sm:text-base drop-shadow">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 text-gray-800 dark:text-white rounded-full p-2 shadow hover:scale-105 transition-transform"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-black/50 text-gray-800 dark:text-white rounded-full p-2 shadow hover:scale-105 transition-transform"
      >
        ›
      </button>

      {/* Indicators */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={`w-3 h-3 rounded-full transition-colors ${i === index ? "bg-white dark:bg-orange-400" : "bg-white/50 dark:bg-white/30"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
