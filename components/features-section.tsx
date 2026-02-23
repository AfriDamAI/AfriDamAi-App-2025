"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Sparkles, ShieldCheck, Microscope, Zap } from "lucide-react"

const features = [
  {
    icon: <Microscope className="text-[#E1784F]" size={32} />,
    title: "AI Dermal Analysis",
    description:
      "Proprietary deep learning trained on melanin-rich datasets to detect texture, pigmentation, and vitality.",
  },
  {
    icon: <Zap className="text-[#4DB6AC]" size={32} />,
    title: "Ingredient Intelligence",
    description: "Instant chemical audit of product formulations to flag irritants and allergens for your phenotype.",
  },
  {
    icon: <ShieldCheck className="text-[#E1784F]" size={32} />,
    title: "Privacy Protocol",
    description: "Clinical-grade AES-256 encryption. Your scan data is anonymized and never sold to third parties.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 md:py-40 bg-muted/20">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        {/* 🧬 SECTION HEADER */}
        <div className="text-left md:text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E1784F]/10 border border-[#E1784F]/20 rounded-full mx-auto">
            <Sparkles size={12} className="text-[#E1784F]" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">
              Platform Capabilities
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-foreground leading-none">
            Powered by <span className="text-[#E1784F]">AfriDam AI</span>
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground font-medium uppercase tracking-tight max-w-2xl mx-auto leading-relaxed">
            A specialized ecosystem of trust and precision designed specifically for the African skin journey.
          </p>
        </div>

        {/* 🧪 FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-10 bg-card border-border rounded-[2.5rem] hover:border-[#E1784F]/30 transition-all shadow-sm hover:shadow-2xl h-full flex flex-col items-start text-left">
                <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-8 border border-border">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground mb-4">
                  {feature.title}
                </h3>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground leading-loose">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}