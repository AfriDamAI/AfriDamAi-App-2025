/**
 * 🛡️ AFRIDAM PEDIGREE SECTION
 * Sits between "4. THE MANIFESTO" and "CareHubSection" on the homepage.
 * Covers: Credentials & Certifications, Numbers That Matter.
 * (Brand Origin, Expertise Behind the Brand, and Supporting Imagery are handled separately.)
 */

"use client"

import { useEffect, useRef, useState } from "react"
import { ShieldCheck, BadgeCheck, Globe2, Users, TestTube, CheckCircle } from "lucide-react"
import { motion, useInView } from "framer-motion"

const certifications = [
  {
    icon: BadgeCheck,
    title: "Legal Registration",
    text: "Fully incorporated company with official CAC registration (AfriDam AI Ltd).",
    color: "#E1784F"
  },
  {
    icon: Globe2,
    title: "Global Recognition",
    text: "Recognized and certified by the African Health Summit in Ireland after presenting our skin AI platform on the global stage.",
    color: "#4DB6AC"
  },
  {
    icon: ShieldCheck,
    title: "Clinical Standards",
    text: "Supported by an international team of medical specialists and skin experts to keep our software accurate and safe.",
    color: "#E1784F"
  }
]

// 🔢 COUNT-UP CONFIG
const stats = [
  { target: 14000, decimals: 0, prefix: "", suffix: "+", label: "People Reached (4 Months)", icon: Users, color: "#E1784F" },
  { target: 40000, decimals: 0, prefix: "", suffix: "+", label: "Dark Skin Clinical Images", icon: TestTube, color: "#4DB6AC" },
  { target: 5.2, decimals: 1, prefix: "", suffix: "B", label: "Global Dark Skin Population", icon: Globe2, color: "#E1784F" },
  { target: 100, decimals: 0, prefix: "", suffix: "%", label: "Fully Working System", icon: CheckCircle, color: "#4DB6AC" }
]

/**
 * 🔢 COUNTING STAT
 */
function CountingStat({
  target,
  decimals,
  prefix,
  suffix
}: {
  target: number
  decimals: number
  prefix: string
  suffix: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" })
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!isInView) return

    const duration = 3800 // ms
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setValue(target)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, target])

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString("en-US")

  return (
    <div ref={ref} className="text-5xl sm:text-6xl md:text-5xl lg:text-6xl font-black italic tracking-tighter text-black dark:text-white leading-none drop-shadow-sm">
      {prefix}
      {formatted}
      {suffix}
    </div>
  )
}

export default function PedigreeSection() {
  return (
    <section className="surface-dim py-24 md:py-40 px-6 transition-colors duration-500">
      <div className="max-w-screen-xl mx-auto space-y-20 md:space-y-28">

        {/* 🏥 CREDENTIALS & CERTIFICATIONS */}
        <div className="space-y-10 md:space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-[#E1784F] text-[10px] font-black capitalize tracking-widest opacity-60">
              Verified & Trusted
            </span>
            {/* Scaled text size and added drop-shadow for extra visual thickness */}
            <h2 className="text-5xl md:text-7xl font-black capitalize italic tracking-tighter leading-[0.9] text-black dark:text-white drop-shadow-sm">
              Credentials & <span className="text-[#4DB6AC]">Certifications.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {certifications.map((cert) => (
              <motion.div
                key={cert.title}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-10 bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-6 shadow-sm hover:shadow-2xl transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${cert.color}1A`, color: cert.color }}
                >
                  <cert.icon size={26} />
                </div>
                <div className="space-y-3">
                  {/* Thickened card title */}
                  <h3 className="text-2xl md:text-3xl font-black italic tracking-tight text-black dark:text-white drop-shadow-sm">
                    {cert.title}
                  </h3>
                  <p className="text-sm font-medium text-black/60 dark:text-white/60 leading-relaxed">
                    {cert.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 📊 NUMBERS THAT MATTER */}
        <div className="space-y-10 md:space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-[#E1784F] text-[10px] font-black capitalize tracking-widest opacity-60">
              By The Numbers
            </span>
            {/* Scaled text size and added drop-shadow for extra visual thickness */}
            <h2 className="text-5xl md:text-7xl font-black capitalize italic tracking-tighter leading-[0.9] text-black dark:text-white drop-shadow-sm">
              Numbers That <span className="text-[#4DB6AC]">Matter.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-black/40 p-8 rounded-[2rem] border border-black/5 dark:border-white/10 flex flex-col items-start gap-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}1A`, color: stat.color }}
                >
                  <stat.icon size={26} strokeWidth={2.5} />
                </div>

                <div className="flex flex-col gap-2">
                  <CountingStat
                    target={stat.target}
                    decimals={stat.decimals}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                  <p className="text-xs md:text-[11px] lg:text-xs font-black uppercase tracking-widest text-black/60 dark:text-white/60 leading-tight">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}