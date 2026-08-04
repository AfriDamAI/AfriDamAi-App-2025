"use client"

import Link from "next/link"
import { Camera, ShieldCheck, ShoppingBag } from "lucide-react"
import { motion } from "framer-motion"

const careHubItems = [
  {
    title: "AI Scanner",
    description: "Instant skin texture and health analysis",
    icon: Camera,
    accent: "#E1784F",
    tile: "bg-[#3A2A24]",
  },
  {
    title: "Ingredient Analyzer",
    description: "Analyze cosmetic ingredients",
    icon: ShieldCheck,
    accent: "#4DB6AC",
    tile: "bg-[#22342F]",
  },
  {
    title: "Marketplace",
    description: "Shop trusted skincare products",
    icon: ShoppingBag,
    accent: "#E1784F",
    tile: "bg-[#3A2A24]",
  },
]

export default function CareHubSection() {
  return (
    <>
      <section id="care-hub" className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-[#151312] text-black dark:text-white overflow-hidden">
        <div className="max-w-screen-xl mx-auto space-y-16 md:space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, margin: "-120px" }}
            className="text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
              The Care Hub.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 lg:gap-10">
            {careHubItems.map((item, index) => {
              const Icon = item.icon

              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.55 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  <div
                    className="group flex min-h-[420px] flex-col justify-between rounded-[3rem] border border-black/5 dark:border-white/10 bg-white dark:bg-[#23211F] p-9 sm:p-10 md:p-12 shadow-sm dark:shadow-[0_24px_80px_rgba(0,0,0,0.18)] transition-all duration-500 hover:-translate-y-2 hover:border-[#E1784F]/50 hover:bg-white dark:hover:bg-[#292522] hover:shadow-[0_32px_100px_rgba(225,120,79,0.10)]"
                  >
                    <div className="space-y-12">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.tile} text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                        <Icon size={28} strokeWidth={2.3} style={{ color: item.accent }} />
                      </div>

                      <div className="space-y-6">
                        <h3 className="text-3xl font-black tracking-tighter leading-none text-black dark:text-white">
                          {item.title}
                        </h3>
                        <p className="max-w-xs text-base md:text-lg font-bold leading-relaxed text-black/35 dark:text-white/45">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-12">
                      <span
                        className="text-[10px] font-black uppercase tracking-[0.28em]"
                        style={{ color: item.accent }}
                      >

                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 md:py-24 bg-gray-50/50 dark:bg-[#151312] text-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-120px" }}
          className="relative mx-auto max-w-screen-xl overflow-hidden rounded-[3rem] md:rounded-[4rem] bg-[#E1784F] px-8 py-14 sm:px-12 md:px-20 md:py-24 shadow-[0_30px_120px_rgba(225,120,79,0.24)]"
        >
          <div className="absolute inset-y-0 right-0 hidden w-1/2 md:block">
            <div className="absolute inset-0 bg-white/10 [clip-path:polygon(0_0,100%_0,55%_50%,100%_100%,12%_100%,55%_50%)]" />
          </div>
          <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative z-10 max-w-4xl space-y-10">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95] text-white">
                Build Your Brand With Us
              </h2>
              <p className="max-w-3xl text-lg md:text-2xl font-bold leading-snug text-white/90">
                Join the movement. Whether you are a certified specialist or a vendor of authentic products, join us to bridge the gap.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              <Link
                href="/specialist"
                className="inline-flex h-16 min-w-64 items-center justify-center rounded-full bg-white px-8 text-[12px] font-black text-[#E1784F] transition-all duration-300 hover:-translate-y-1 hover:bg-white/95 hover:shadow-2xl active:scale-95"
              >
                Join as Specialist
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex h-16 min-w-64 items-center justify-center rounded-full bg-[#151312] px-8 text-[12px] font-black text-white transition-all duration-300 hover:-translate-y-1 hover:bg-black hover:shadow-2xl active:scale-95"
              >
                Join as Vendor
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
    </>
  )
}
