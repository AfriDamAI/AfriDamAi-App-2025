export interface TreatmentStep {
  name: string
  duration: string
  description: string
}

export interface Product {
  name: string
  benefit: string
}

export interface TreatmentRoutine {
  morning: TreatmentStep[]
  evening: TreatmentStep[]
  products: Product[]
}

export function getTreatmentRoutine(): TreatmentRoutine {
  return {
    morning: [
      {
        name: "Gentle Cleanser",
        duration: "2 min",
        description: "Remove overnight oils and impurities",
      },
      {
        name: "Vitamin C Serum",
        duration: "1 min",
        description: "Antioxidant protection and brightening",
      },
      {
        name: "Moisturizer",
        duration: "2 min",
        description: "Hydrate and protect skin barrier",
      },
      {
        name: "SPF 50 Sunscreen",
        duration: "2 min",
        description: "Essential UV protection",
      },
    ],
    evening: [
      {
        name: "Makeup Remover",
        duration: "3 min",
        description: "Gently remove makeup and sunscreen",
      },
      {
        name: "Gentle Cleanser",
        duration: "2 min",
        description: "Deep cleanse pores",
      },
      {
        name: "Retinol Treatment",
        duration: "1 min",
        description: "Anti-aging and cell renewal (3x weekly)",
      },
      {
        name: "Night Moisturizer",
        duration: "2 min",
        description: "Rich hydration and repair overnight",
      },
    ],
    products: [
      { name: "Cleanser", benefit: "Gentle, pH-balanced" },
      { name: "Toner", benefit: "Balancing hydration" },
      { name: "Serum", benefit: "Targeted treatment" },
      { name: "Moisturizer", benefit: "Barrier protection" },
      { name: "Sunscreen", benefit: "UV defense" },
      { name: "Retinol", benefit: "Anti-aging" },
    ],
  }
}
