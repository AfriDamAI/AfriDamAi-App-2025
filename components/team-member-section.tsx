"use client"

import { motion } from "framer-motion"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

import ogImage from "@/public/pics/og.png"
import anaduImage from "@/public/pics/anadu.png"
import dawiitImage from "@/public/pics/Dawiit.png"
import rasheedahImage from "@/public/pics/Rasheedah.png"

import tobImage from "@/public/pics/tob.png"
import anuImage from "@/public/pics/anu.png"
import natImage from "@/public/pics/nat.png"
import matImage from "@/public/pics/mott.jpeg"

const teamMembers = [
  {
    id: 1,
    name: "Ogirima Obey",
    title: "Founder & CEO",
    description: "Registered Nurse & Venture Builder. Bridges clinical gaps with tech systems.",
    image: ogImage,
    imagePosition: "center", // 🎯 adjust per-photo if a face sits off-center, e.g. "center 20%"
  },
  {
    id: 2,
    name: "Dr. Anand Urheka",
    title: "CMO",
    description: "Chief Medical Officer. Provides the clinical oversight for the AI diagnostics.",
    image: anaduImage,
    imagePosition: "center", // 🎯 this photo is wide/off-center in the source — tweak here if needed
  },
  {
    id: 3,
    name: "Dr. Dawitt",
    title: "CMO",
    description: "Chief Medical Officer. Provides the clinical oversight for the AI diagnostics.",
    image: dawiitImage,
    imagePosition: "center",
  },
  {
    id: 4,
    name: "Dr. Rasheeda",
    title: "CMO",
    description: "Chief Medical Officer. Provides the clinical oversight for the AI diagnostics.",
    image: rasheedahImage,
    imagePosition: "center",
  },
  // {
  //   id: 3,
  //   name: "Oluwatobi Adejoro",
  //   title: "Technical Lead",
  //   description: "Leads the Node.js/NestJS architecture and API integration.",
  //   image: tobImage,
  // },
  // {
  //   id: 4,
  //   name: "Tochi Omeche",
  //   title: "AI Coordinator",
  //   description: "Manages the African datasets and model training for the scanner.",
  //   image: anuImage,
  // },
  // {
  //   id: 5,
  //   name: "Nathan Isong",
  //   title: "Head of AI",
  //   description: "Lead the model architecture",
  //   image: natImage,
  // },
  // {
  //   id: 6,
  //   name: "Mistura Agbabiaka",
  //   title: "Workflow Coordinator",
  //   description: "Ensures the seamless handoff between AI detection and specialist consultation.",
  //   image: matImage,
  // },
]

export default function TeamMemberSection() {
  const [current, setCurrent] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(1)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  // Ref so autoplay closure always reads the latest value without re-creating the interval
  const itemsPerViewRef = useRef(1)
  const total = teamMembers.length

  // Responsive items per view: 1 on mobile, 2 on sm, 3 on md
  useEffect(() => {
    const update = () => {
      const n = window.innerWidth >= 768 ? 3 : window.innerWidth >= 640 ? 2 : 1
      setItemsPerView(n)
      itemsPerViewRef.current = n
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Clamp current index when items per view increases (avoids blank trailing slides)
  useEffect(() => {
    setCurrent((prev) => Math.min(prev, Math.max(0, total - itemsPerView)))
  }, [itemsPerView])

  const startAutoplay = () => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => {
        const max = Math.max(0, total - itemsPerViewRef.current)
        return prev >= max ? 0 : prev + 1
      })
    }, 3000)
  }

  const stopAutoplay = () => {
    if (timerRef.current) clearInterval(timerRef.current)
  }

  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [])

  const maxIndex = Math.max(0, total - itemsPerView)
  const itemWidthPct = 100 / itemsPerView

  const goNext = () => {
    stopAutoplay()
    setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1))
    startAutoplay()
  }

  const goPrev = () => {
    stopAutoplay()
    setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1))
    startAutoplay()
  }

  return (
    <section className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5 border-y border-black/5 dark:border-white/5">
      <div className="max-w-screen-xl mx-auto space-y-16">

        {/* Section Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 bg-[#E1784F]/5 dark:bg-white/5 px-4 py-2 rounded-full border border-[#E1784F]/10">
            <Sparkles className="text-[#E1784F]" size={12} />
            <span className="text-[9px] font-black capitalize tracking-widest text-[#E1784F]">
              Our Team
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-tight text-black dark:text-white">
            Meet The <span className="text-[#4DB6AC]">Minds</span>
          </h2>
          <p className="text-[11px] font-bold opacity-30 tracking-widest max-w-lg mx-auto leading-relaxed">
            Passionate experts dedicated to revolutionizing skin care for melanin-rich communities.
          </p>
        </div>

        {/* Mobile/Tablet Carousel — visible below lg (1024px) */}
        <div className="block lg:hidden">
          <div className="relative">

            {/* overflow-x-hidden only — allows shadows and rounded corners to breathe vertically */}
            <div className="overflow-x-hidden py-3">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${current * itemWidthPct}%)` }}
              >
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="shrink-0 px-3"
                    style={{ width: `${itemWidthPct}%` }}
                  >
                    <div className="bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 p-6 shadow-sm flex flex-col items-center justify-center text-center h-full w-full">

                      {/* Image — border frame explicitly centered; per-member imagePosition fine-tunes the photo inside it */}
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full overflow-hidden mb-5 border-4 border-gray-100 dark:border-white/10 shrink-0 mx-auto self-center">
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover object-center"
                          style={{ objectPosition: member.imagePosition ?? "center" }}
                          sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 144px"
                        />
                      </div>

                      {/* Title Badge */}
                      <div className="inline-flex items-center px-3 py-1.5 bg-[#E1784F]/10 dark:bg-[#E1784F]/20 rounded-full mb-3">
                        <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-[#E1784F]">
                          {member.title}
                        </span>
                      </div>

                      {/* Name */}
                      <h3 className="text-base sm:text-lg font-black italic tracking-tight text-black dark:text-white mb-2">
                        {member.name}
                      </h3>

                      {/* Description */}
                      <p className="text-[10px] font-bold opacity-30 leading-relaxed tracking-tight">
                        {member.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Left arrow */}
            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center shadow-md z-10"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Right arrow */}
            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white dark:bg-black border border-black/10 dark:border-white/10 flex items-center justify-center shadow-md z-10"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Dots — one per valid starting position */}
          <div className="flex justify-center gap-2 mt-5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => { stopAutoplay(); setCurrent(i); startAutoplay() }}
                className={`h-2 rounded-full transition-all ${
                  i === current ? "w-6 bg-[#E1784F]" : "w-2 bg-neutral-300 dark:bg-neutral-600"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Grid — fixed 4 columns (matches current 4 team members exactly,
            so there's no leftover empty slot pulling the row off-center).
            Sits inside the max-w-screen-xl mx-auto container above, so left/right
            margins stay equal. */}
        <div className="hidden lg:grid grid-cols-4 gap-6 md:gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 p-6 md:p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:border-[#E1784F]/30 h-full w-full flex flex-col items-center justify-center text-center">

                {/* Image — border frame explicitly centered; per-member imagePosition fine-tunes the photo inside it */}
                <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden mb-6 border-4 border-gray-100 dark:border-white/10 group-hover:border-[#E1784F]/30 transition-all duration-500 mx-auto self-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full"
                  >
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover object-center"
                      style={{ objectPosition: member.imagePosition ?? "center" }}
                      sizes="(max-width: 768px) 144px, 176px"
                    />
                  </motion.div>
                </div>

                {/* Title Badge */}
                <div className="inline-flex items-center px-4 py-1.5 bg-[#E1784F]/10 dark:bg-[#E1784F]/20 rounded-full mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]">
                    {member.title}
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg md:text-xl font-black italic tracking-tight text-black dark:text-white mb-3">
                  {member.name}
                </h3>

                {/* Description */}
                <p className="text-[10px] md:text-[11px] font-bold opacity-30 leading-relaxed tracking-tight">
                  {member.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}