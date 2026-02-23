"use client"

/**
 * 🛡️ AFRIDAM AESTHETIC INTELLIGENCE (Rule 6 Synergy)
 * Version: 2026.1.16 (Full Data Node)
 * Focus: Comprehensive melanin-specific safety profiles.
 */

export interface IngredientProfile {
  name: string
  aliases: string[]
  type: string
  safetyRating: "safe" | "caution" | "avoid"
  isChildSafe?: boolean
  commonConcerns: string[]
  allergenPotential: boolean
  irritantPotential: boolean
  skinTypeCompatibility: {
    oily: boolean
    combination: boolean
    normal: boolean
    dry: boolean
    sensitive: boolean
    [key: string]: boolean // 🚀 OGA FIX: Allows the NLP engine to index skin types dynamically
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
    skinTypeCompatibility: { oily: true, combination: true, normal: true, dry: true, sensitive: true },
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
    skinTypeCompatibility: { oily: true, combination: true, normal: true, dry: true, sensitive: true },
    description: "Powerful humectant that draws moisture into skin",
    benefits: ["Hydration", "Moisture retention", "Skin softening"],
  },
  salicylicacid: {
    name: "Salicylic Acid",
    aliases: ["bha", "2-hydroxybenzoic acid"],
    type: "exfoliant",
    safetyRating: "caution",
    isChildSafe: false,
    commonConcerns: ["May cause irritation in sensitive skin", "Avoid if pregnant", "Risk of hyperpigmentation if overused on dark skin"],
    allergenPotential: false,
    irritantPotential: true,
    skinTypeCompatibility: { oily: true, combination: true, normal: true, dry: false, sensitive: false },
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
    commonConcerns: ["Common allergen", "Can cause photosensitivity"],
    allergenPotential: true,
    irritantPotential: true,
    skinTypeCompatibility: { oily: true, combination: true, normal: true, dry: true, sensitive: false },
    description: "Synthetic or natural fragrance compounds",
    benefits: ["Scent"],
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
    skinTypeCompatibility: { oily: true, combination: true, normal: true, dry: true, sensitive: true },
    description: "Vitamin B3 derivative with multiple skin benefits",
    benefits: ["Pore minimizing", "Oil control", "Brightening"],
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
    skinTypeCompatibility: { oily: true, combination: true, normal: true, dry: true, sensitive: true },
    description: "Powerful humectant that holds water",
    benefits: ["Deep hydration", "Plumping"],
  },
  retinol: {
    name: "Retinol",
    aliases: ["vitamin a", "retinyl palmitate"],
    type: "vitamin",
    safetyRating: "caution",
    isChildSafe: false,
    commonConcerns: ["Avoid during pregnancy", "Can cause photosensitivity", "Irritation risk"],
    allergenPotential: false,
    irritantPotential: true,
    skinTypeCompatibility: { oily: true, combination: true, normal: true, dry: true, sensitive: false },
    description: "Vitamin A derivative for skin renewal",
    benefits: ["Anti-aging", "Acne treatment"],
  },
  sheabutter: {
    name: "Shea Butter",
    aliases: ["butyrospermum parkii"],
    type: "emollient",
    safetyRating: "safe",
    isChildSafe: true,
    commonConcerns: ["May be heavy for extremely oily skin"],
    allergenPotential: false,
    irritantPotential: false,
    skinTypeCompatibility: { oily: false, combination: true, normal: true, dry: true, sensitive: true },
    description: "Traditional African lipid for deep moisture",
    benefits: ["Barrier repair", "Anti-inflammatory"],
  },
  hydroquinone: {
    name: "Hydroquinone",
    aliases: ["quinol"],
    type: "lightening agent",
    safetyRating: "avoid",
    isChildSafe: false,
    commonConcerns: ["Risk of ochronosis on dark skin", "Strictly medical use only"],
    allergenPotential: true,
    irritantPotential: true,
    skinTypeCompatibility: { oily: false, combination: false, normal: false, dry: false, sensitive: false },
    description: "Potent skin depigmenting agent with high risk",
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
 * 🛡️ PRE-COMPUTED ALIAS MAP
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
 * 🔬 LOCAL ENGINE BRIDGE
 * Synchronizes with ingredient-nlp-engine.ts
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
    .filter((i): i is NonNullable<typeof i> => i !== null)

  const totalIngredients = analyzedIngredients.length
  const safeCount = analyzedIngredients.filter(i => i.safety === "safe").length
  const safetyScore = totalIngredients > 0 ? Math.round((safeCount / totalIngredients) * 100) : 100

  return {
    totalIngredients,
    safetyScore,
    analyzedIngredients,
    summary: safetyScore > 80 ? "This formula appears balanced and safe for regular use." : "Caution advised. Flagged ingredients detected.",
    recommendations: ["Perform a 24-hour patch test before full application."],
    skinTypeCompatibility: {
      "Oily": safetyScore > 70 ? "Good" : "Caution",
      "Dry": safetyScore > 70 ? "Good" : "Caution",
      "Sensitive": safetyScore > 90 ? "Good" : "Avoid"
    }
  }
}