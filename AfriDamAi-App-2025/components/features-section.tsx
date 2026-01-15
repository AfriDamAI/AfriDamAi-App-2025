"use client"

import { Card } from "@/components/ui/card"

const features = [
  {
    icon: "✨",
    title: "AI Skin Detection",
    description:
      "Our deep learning models detect acne, pigmentation, dryness, and more with dermatologist-level accuracy.",
  },
  {
    icon: "🧪",
    title: "Ingredient Analysis",
    description: "Paste product ingredients and instantly get insights about irritants, allergens, and compatibility.",
  },
  {
    icon: "🔒",
    title: "Privacy & Security",
    description: "All scans are processed securely with encrypted storage and anonymized image handling.",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 md:py-32 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Powered by AfriDamAI</h2>
          <p className="text-lg text-muted-foreground text-balance">
            -Comprehensive skin analysis and ingredient intelligence in one platform
            -An ecosystem of trust & precision AfriDamAI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
