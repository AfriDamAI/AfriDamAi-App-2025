"use client";

import React, { useState, useEffect } from "react";

export default function HeroCarousel() {
    const slides = [
        {
            title: "Elevate Your Shopping Experience",
            button: "Shop Now",
            gradient: "from-orange-500 to-orange-300",
            href: "/ecommerce/product-listing-page",
        },
        {
            title: "Discover Premium Collections",
            button: "Explore",
            gradient: "from-blue-600 to-indigo-500",
            href: "/ecommerce/product-listing-page",
        },
        {
            title: "Unbeatable Deals Await You",
            button: "Grab Offer",
            gradient: "from-emerald-500 to-green-400",
            href: "/ecommerce/product-listing-page",
        },
    ];

    const [active, setActive] = useState(0);

    // Auto-slide every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActive((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-11/12 max-w-7xl h-[380px] rounded-2xl overflow-hidden shadow-lg relative mb-16">
            {/* SLIDES WRAPPER */}
            <div
                className="flex h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${active * 100}%)` }}
            >
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`w-full h-full flex-shrink-0 bg-gradient-to-br ${slide.gradient} relative flex items-center justify-center text-center`}
                    >
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"></div>

                        {/* Content */}
                        <div className="relative z-10">
                            <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-xl mb-5 tracking-tight">
                                {slide.title}
                            </h1>
                            <button
                                onClick={() => window.location.href = slide.href}
                            className="px-7 py-3 bg-white text-gray-900 font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                                {slide.button}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* INDICATORS */}
            <div className="absolute bottom-4 w-full flex justify-center gap-2 z-20">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActive(index)}
                        className={`w-3 h-3 rounded-full transition-all ${active === index ? "bg-white scale-110" : "bg-white/40"
                            }`}
                    ></button>
                ))}
            </div>

            {/* LEFT / RIGHT NAV BUTTONS */}
            <button
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm"
                onClick={() => setActive((prev) => (prev - 1 + slides.length) % slides.length)}
            >
                ‹
            </button>
            <button
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur-sm"
                onClick={() => setActive((prev) => (prev + 1) % slides.length)}
            >
                ›
            </button>
        </section>
    );
}
