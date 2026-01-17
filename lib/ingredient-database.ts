"use client"

/**
 * 🛡️ AFRIDAM AESTHETIC INTELLIGENCE
 * Comprehensive ingredient database with melanin-specific safety profiles.
 * Optimized for Skincare, Women, and Pediatric Safety.
 */

export interface IngredientProfile {
  name: string
  aliases: string[]
  type: string
  safetyRating: "safe" | "caution" | "avoid"
  isChildSafe?: boolean // 👶 NEW: Supporting maternal safety checks
  commonConcerns: string[]
  allergenPotential: boolean
  irritantPotential: boolean
  skinTypeCompatibility: {
    oily: boolean
    combination: boolean
    normal: boolean
    dry: boolean
    sensitive: boolean
  }
  description: string
  benefits: string[]
  concentration?: string
}

// Comprehensive ingredient database
export const ingredientDatabase: Record<string, IngredientProfile> = {
  water: {
    name: "Water",
    aliases: ["aqua", "h2o"],
    type: "solvent",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: [],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: true,
    },
    description: "Primary solvent and hydrating agent",
    benefits: ["Hydration", "Solvent"],
  },
  glycerin: {
    name: "Glycerin",
    aliases: ["glycerol", "propane-1,2,3-triol"],
    type: "humectant",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: [],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: true,
    },
    description: "Powerful humectant that draws moisture into skin",
    benefits: ["Hydration", "Moisture retention", "Skin softening"],
  },
  salicylicacid: {
    name: "Salicylic Acid",
    aliases: ["bha", "2-hydroxybenzoic acid"],
    type: "exfoliant",
    safetyRating: "caution",
    isChildSafe: false,
    commonConcerns: ["May cause irritation in sensitive skin", "Avoid if pregnant", "Can cause dryness", "Risk of hyperpigmentation if overused on dark skin"],
    allergenPotential: false,
    irritantPotential: true,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: false,
      sensitive: false,
    },
    description: "Beta hydroxy acid for chemical exfoliation",
    benefits: ["Exfoliation", "Pore cleansing", "Acne treatment"],
    concentration: "0.5-2%",
  },
  fragrance: {
    name: "Fragrance",
    aliases: ["parfum", "essential oils", "fragrance blend"],
    type: "fragrance",
    safetyRating: "caution",
    isChildSafe: false,
    commonConcerns: ["Common allergen", "May irritate sensitive skin", "Can cause photosensitivity"],
    allergenPotential: true,
    irritantPotential: true,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: false,
    },
    description: "Synthetic or natural fragrance compounds",
    benefits: ["Scent"],
  },
  phenoxyethanol: {
    name: "Phenoxyethanol",
    aliases: ["phenoxyethanol", "preservative"],
    type: "preservative",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: [],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: true,
    },
    description: "Preservative to prevent microbial growth",
    benefits: ["Preservation", "Antimicrobial"],
  },
  niacinamide: {
    name: "Niacinamide",
    aliases: ["vitamin b3", "nicotinamide"],
    type: "vitamin",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: [],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: true,
    },
    description: "Vitamin B3 derivative with multiple skin benefits",
    benefits: ["Pore minimizing", "Oil control", "Anti-inflammatory", "Brightening"],
  },
  hyaluronicacid: {
    name: "Hyaluronic Acid",
    aliases: ["sodium hyaluronate", "ha"],
    type: "humectant",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: [],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: true,
    },
    description: "Powerful humectant that holds up to 1000x its weight in water",
    benefits: ["Deep hydration", "Plumping", "Anti-aging"],
  },
  vitaminc: {
    name: "Vitamin C",
    aliases: ["ascorbic acid", "l-ascorbic acid"],
    type: "antioxidant",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: ["Can be unstable", "May cause irritation at high concentrations"],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: true,
    },
    description: "Powerful antioxidant for brightening and anti-aging",
    benefits: ["Brightening", "Antioxidant", "Collagen synthesis", "Sun protection"],
  },
  retinol: {
    name: "Retinol",
    aliases: ["vitamin a", "retinyl palmitate"],
    type: "vitamin",
    safetyRating: "caution",
    isChildSafe: false,
    commonConcerns: ["Avoid during pregnancy", "Can cause photosensitivity", "May cause irritation"],
    allergenPotential: false,
    irritantPotential: true,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: true,
      sensitive: false,
    },
    description: "Vitamin A derivative for anti-aging and skin renewal",
    benefits: ["Anti-aging", "Acne treatment", "Skin renewal"],
  },
  benzoylperoxide: {
    name: "Benzoyl Peroxide",
    aliases: ["bpo"],
    type: "acne-fighter",
    safetyRating: "caution",
    isChildSafe: false,
    commonConcerns: ["Can cause dryness", "May bleach fabrics", "Can cause irritation"],
    allergenPotential: false,
    irritantPotential: true,
    skinTypeCompatibility: {
      oily: true,
      combination: true,
      normal: true,
      dry: false,
      sensitive: false,
    },
    description: "Powerful acne-fighting ingredient",
    benefits: ["Acne treatment", "Antibacterial"],
  },
  sheabutter: {
    name: "Shea Butter",
    aliases: ["butyrospermum parkii", "vitellaria paradoxa"],
    type: "emollient",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: ["May be heavy for extremely oily skin"],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: {
      oily: false,
      combination: true,
      normal: true,
      dry: true,
      sensitive: true,
    },
    description: "Traditional African lipid extracted from Shea tree nuts",
    benefits: ["Barrier repair", "Deep moisture", "Anti-inflammatory"],
  },
  hydroquinone: {
    name: "Hydroquinone",
    aliases: ["quinol", "1,4-dihydroxybenzene"],
    type: "lightening agent",
    safetyRating: "avoid",
    isChildSafe: false,
    commonConcerns: ["Risk of exogenous ochronosis on dark skin", "Significant irritation risk", "Strictly medical use only"],
    allergenPotential: true,
    irritantPotential: true,
    skinTypeCompatibility: {
      oily: false,
      combination: false,
      normal: false,
      dry: false,
      sensitive: false,
    },
    description: "Potent skin depigmenting agent with high risk profiles for melanin-rich skin",
    benefits: ["Hyperpigmentation treatment"],
  }
}

/**
 * Normalize ingredient name for database lookup
 */
export function normalizeIngredientName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "").trim()
}

/**
 * 🛡️ RE-ENFORCED: Pre-computed Alias Map for O(1) Search Performance
 */
const aliasMap: Record<string, string> = {}
Object.entries(ingredientDatabase).forEach(([key, profile]) => {
  aliasMap[key] = key
  profile.aliases.forEach(alias => {
    aliasMap[normalizeIngredientName(alias)] = key
  })
})

/**
 * Find ingredient in database
 */
export function findIngredient(name: string): IngredientProfile | null {
  const normalized = normalizeIngredientName(name)

  const databaseKey = aliasMap[normalized]
  if (databaseKey && ingredientDatabase[databaseKey]) {
    return ingredientDatabase[databaseKey]
  }

  return null
}

/**
 * 🔬 NEW: Local Engine Bridge
 * Required by performIngredientAnalysis in ingredient-checker.ts
 */
export function analyzeIngredients(text: string) {
  const ingredientsToSearch = text.split(/,|\n/).map(i => i.trim()).filter(i => i.length > 0)
  const analyzedIngredients = ingredientsToSearch
    .map(name => {
      const profile = findIngredient(name)
      if (profile) {
        return {
          name: profile.name,
          safety: profile.safetyRating,
          profile: profile,
          concerns: profile.commonConcerns
        }
      }
      return null
    })
    .filter(Boolean)

  const totalIngredients = analyzedIngredients.length
  const safeCount = analyzedIngredients.filter(i => i?.safety === "safe").length
  const safetyScore = totalIngredients > 0 ? Math.round((safeCount / totalIngredients) * 100) : 100

  return {
    totalIngredients,
    safetyScore,
    analyzedIngredients,
    summary: safetyScore > 80 ? "This formula appears balanced and safe for regular use." : "Caution advised. Flagged ingredients detected.",
    recommendations: ["Perform a 24-hour patch test before full application."],
    skinTypeCompatibility: {
      "Oily": "Good",
      "Dry": "Good",
      "Sensitive": "Caution"
    }
  }
}