"use client"

/**
 * 🛡️ AFRIDAM CLINICAL PROTOCOLS
 * Standardized treatment routines optimized for melanin-rich skin phenotypes.
 */

export interface TreatmentStep {
  name: string
  duration: string
  description: string
  frequency?: string // 🛡️ RE-ENFORCED: For active ingredients
}

export interface Product {
  name: string
  benefit: string
  category: "Cleanser" | "Treatment" | "Moisturizer" | "Protection"
}

export interface TreatmentRoutine {
  morning: TreatmentStep[]
  evening: TreatmentStep[]
  products: Product[]
  clinicalNote: string
}

export function getTreatmentRoutine(): TreatmentRoutine {
  return {
    morning: [
      {
        name: "Gentle Ph-Balanced Cleanser",
        duration: "2 min",
        description: "Purify skin from overnight sebum without stripping natural oils.",
      },
      {
        name: "Antioxidant (Vitamin C)",
        duration: "1 min",
        description: "Neutralize free radicals and prevent environmental hyperpigmentation.",
        frequency: "Daily"
      },
      {
        name: "Barrier Moisturizer",
        duration: "2 min",
        description: "Seal in hydration and strengthen the dermal barrier.",
      },
      {
        name: "Broad Spectrum SPF 50",
        duration: "2 min",
        description: "Essential UV defense to prevent PIH and photo-aging.",
        frequency: "Every 4 hours if outdoors"
      },
    ],
    evening: [
      {
        name: "Oil-Based Pre-Wash",
        duration: "3 min",
        description: "Break down sunscreen, pollutants, and surface debris (Double Cleanse Step 1).",
      },
      {
        name: "Water-Based Cleanser",
        duration: "2 min",
        description: "Deep cleanse the pores to prepare for active treatment.",
      },
      {
        name: "Neural Active (Retinol/Exfoliant)",
        duration: "1 min",
        description: "Accelerate cell turnover and address texture/pigmentation.",
        frequency: "2-3x Weekly (Gradual buildup)"
      },
      {
        name: "Regenerative Night Cream",
        duration: "2 min",
        description: "Support cellular repair and maintain moisture levels during sleep.",
      },
    ],
    products: [
      { name: "Hydrating Cleanser", benefit: "pH-balanced, non-stripping", category: "Cleanser" },
      { name: "Niacinamide Serum", benefit: "Oil control & pore refining", category: "Treatment" },
      { name: "Vitamin C Complex", benefit: "Brightening & protection", category: "Treatment" },
      { name: "Ceramide Cream", benefit: "Barrier repair & locking", category: "Moisturizer" },
      { name: "Invisible Sunscreen", benefit: "Zero white-cast UV defense", category: "Protection" },
      { name: "Retinol 0.5%", benefit: "Resurfacing & anti-aging", category: "Treatment" },
    ],
    clinicalNote: "Consistency is key. Results typically synchronize with your skin's 28-day renewal cycle."
  }
}