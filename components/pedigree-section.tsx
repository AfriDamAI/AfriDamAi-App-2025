/**
 * 🛡️ AFRIDAM PEDIGREE SECTION
 * Sits between "4. THE MANIFESTO" and "CareHubSection" on the homepage.
 * Covers: Credentials & Certifications, Key Partnerships & Integrations, Numbers That Matter.
 * (Brand Origin, Expertise Behind the Brand, and Supporting Imagery are handled separately.)
 */

"use client"

import { useEffect, useRef, useState } from "react"
import { ShieldCheck, BadgeCheck, Handshake, Globe2 } from "lucide-react"
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

const partners = [
  { name: "Mahogany Dermatology", region: "USA" },
  { name: "Jax Lab", region: "Canada" },
  { name: "Ene Naturals", region: "Commercial Partner" }
]

// 🔢 COUNT-UP CONFIG
// `target` is the raw number to animate to. `decimals` controls rounding
// (e.g. 5.2 needs 1 decimal place). `prefix`/`suffix` wrap the formatted number.
const stats = [
  { target: 14000, decimals: 0, prefix: "", suffix: "+", label: "People Reached (4 Months)" },
  { target: 40000, decimals: 0, prefix: "", suffix: "+", label: "Dark Skin Clinical Images" },
  { target: 5.2, decimals: 1, prefix: "", suffix: "B", label: "Global Dark Skin Population" },
  { target: 100, decimals: 0, prefix: "", suffix: "%", label: "Fully Working System" }
]

/**
 * 🔢 COUNTING STAT
 * Animates from 0 to `target` once it scrolls into view, using
 * requestAnimationFrame with an ease-out curve. Runs only once (viewport
 * `once: true`) so it doesn't re-trigger every time you scroll past it.
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

    const duration = 3800 // ms — slowed down so the count is easy to follow
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic — fast start, gentle finish
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(target * eased)

      if (progress < 1) {
        requestAnimationFrame(tick)
      } else {
        setValue(target) // snap to exact target at the end
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, target])

  const formatted =
    decimals > 0
      ? value.toFixed(decimals)
      : Math.round(value).toLocaleString("en-US")

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-black italic tracking-tighter">
      {prefix}
      {formatted}
      {suffix}
    </div>
  )
}

export default function PedigreeSection() {
  return (
    <section className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5">
      <div className="max-w-screen-xl mx-auto space-y-20 md:space-y-28">

        {/* 🏥 CREDENTIALS & CERTIFICATIONS */}
        <div className="space-y-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-[#E1784F] text-[10px] font-black capitalize tracking-widest opacity-60">
              Verified & Trusted
            </span>
            <h2 className="text-4xl md:text-6xl font-black capitalize italic tracking-tighter leading-tight text-black dark:text-white">
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
                  <h3 className="text-xl font-black italic tracking-tight text-black dark:text-white">
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

        {/* 🤝 KEY PARTNERSHIPS & INTEGRATIONS */}
        <div className="space-y-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-[#4DB6AC] text-[10px] font-black capitalize tracking-widest opacity-60">
              Working Together
            </span>
            <h2 className="text-4xl md:text-6xl font-black capitalize italic tracking-tighter leading-tight text-black dark:text-white">
              Key <span className="text-[#E1784F]">Partnerships.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="p-8 md:p-10 bg-[#4DB6AC]/5 dark:bg-white/5 border border-[#4DB6AC]/15 rounded-[2.5rem] flex flex-col gap-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#4DB6AC]/10 text-[#4DB6AC] flex items-center justify-center">
                  <Handshake size={26} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black italic tracking-tight text-black dark:text-white">
                    {partner.name}
                  </h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-black/40 dark:text-white/40">
                    {partner.region}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 📊 NUMBERS THAT MATTER */}
        <div className="space-y-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-[#E1784F] text-[10px] font-black capitalize tracking-widest opacity-60">
              By The Numbers
            </span>
            <h2 className="text-4xl md:text-6xl font-black capitalize italic tracking-tighter leading-tight text-black dark:text-white">
              Numbers That <span className="text-[#4DB6AC]">Matter.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="p-8 md:p-10 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] text-center space-y-2"
              >
                <CountingStat
                  target={stat.target}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 leading-relaxed">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}