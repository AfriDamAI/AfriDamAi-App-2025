"use client"

/**
 * 🛡️ AFRIDAM NEURAL CORE: INGREDIENT NLP ENGINE (Rule 6 Synergy)
 * Version: 2026.1.13 (Type-Safe Final Edition)
 * Focus: High-Precision Melanin-rich skin and Pediatric safety.
 */

import { findIngredient } from "./ingredient-database"

export interface AnalyzedIngredient {
  name: string
  found: boolean
  profile?: any
  safety: "safe" | "caution" | "avoid" | "unknown"
  concerns: string[]
}

export interface IngredientAnalysisResult {
  totalIngredients: number
  analyzedIngredients: AnalyzedIngredient[]
  safetyScore: number
  allergens: string[]
  irritants: string[]
  recommendations: string[]
  skinTypeCompatibility: Record<string, string>
  summary: string
  isChildSafe?: boolean 
}

/** 1. PARSE: Handles commas, semicolons, and newlines from mobile pastes */
export function parseIngredients(ingredientText: string): string[] {
  return ingredientText
    .split(/[,;\n]/)
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 0 && ing.length < 100)
}

/** 2. ANALYZE: Individual database lookup with Type-Casting */
export function analyzeIngredient(ingredientName: string): AnalyzedIngredient {
  const profile = findIngredient(ingredientName)

  if (!profile) {
    return {
      name: ingredientName,
      found: false,
      safety: "unknown",
      concerns: [],
    }
  }

  // 🛡️ OGA FIX: Force cast the safety rating to match our interface
  return {
    name: profile.name,
    found: true,
    profile,
    safety: (profile.safetyRating as any) || "unknown",
    concerns: profile.commonConcerns || [],
  }
}

/** 3. SCORE: High-risk calculation for Melanin-rich skin */
export function calculateSafetyScore(analyzedIngredients: AnalyzedIngredient[]): number {
  if (analyzedIngredients.length === 0) return 100

  let score = 100
  let analyzedCount = 0

  for (const ingredient of analyzedIngredients) {
    if (ingredient.found) {
      analyzedCount++
      if (ingredient.safety === "caution") score -= 5
      if (ingredient.safety === "avoid") score -= 20 
    }
  }

  const unknownCount = analyzedIngredients.length - analyzedCount
  score -= unknownCount * 2

  return Math.max(0, Math.min(100, score))
}

/** 4. HELPERS: Extractors for Allergens and Irritants */
export function extractAllergens(analyzedIngredients: AnalyzedIngredient[]): string[] {
  return analyzedIngredients
    .filter((ing) => ing.found && ing.profile?.allergenPotential)
    .map((ing) => ing.name)
}

export function extractIrritants(analyzedIngredients: AnalyzedIngredient[]): string[] {
  return analyzedIngredients
    .filter((ing) => ing.found && ing.profile?.irritantPotential)
    .map((ing) => ing.name)
}

/** 5. COMPATIBILITY: Multi-skin type evaluation */
export function determineSkinTypeCompatibility(analyzedIngredients: AnalyzedIngredient[]): Record<string, string> {
  const skinTypes = ["oily", "combination", "normal", "dry", "sensitive"]
  const compatibility: Record<string, string> = {}

  for (const skinType of skinTypes) {
    const compatibleCount = analyzedIngredients.filter((ing) => {
      if (!ing.found || !ing.profile) return true
      return ing.profile.skinTypeCompatibility?.[skinType]
    }).length

    const ratio = compatibleCount / (analyzedIngredients.length || 1)
    if (ratio >= 0.9) compatibility[skinType] = "Excellent"
    else if (ratio >= 0.7) compatibility[skinType] = "Good"
    else if (ratio >= 0.5) compatibility[skinType] = "Fair"
    else compatibility[skinType] = "Poor"
  }
  return compatibility
}

/** 6. RECOMMENDATIONS: Maternal and SPF awareness */
export function generateRecommendations(
  analyzedIngredients: AnalyzedIngredient[],
  allergens: string[],
  irritants: string[],
): string[] {
  const recommendations: string[] = []

  if (irritants.length > 0 || analyzedIngredients.some((ing) => ing.safety === "caution")) {
    recommendations.push("Perform a 24-hour patch test before full application.")
  }

  const needsSPF = analyzedIngredients.some((ing) => {
    const n = ing.name.toLowerCase()
    return n.includes("vitamin c") || n.includes("retinol") || n.includes("acid")
  })
  if (needsSPF) recommendations.push("Apply SPF 30+ daily to protect your glow and prevent dark spots (PIH).")

  if (allergens.length > 0) recommendations.push(`Aesthetic Alert: Avoid if sensitive to: ${allergens.join(", ")}`)

  const isMaternalRisk = analyzedIngredients.some((ing) => 
    ["retinol", "salicylic acid", "hydroquinone"].includes(ing.name.toLowerCase())
  )
  if (isMaternalRisk) recommendations.push("Maternal Care: Consult a professional if nursing or pregnant.")

  return recommendations.length > 0 ? recommendations : ["Formulation looks well-balanced for your skin diary."]
}

/** 7. SUMMARY: Branding grading */
export function generateSummary(safetyScore: number): string {
  if (safetyScore >= 85) return "Aesthetic Grade: Highly compatible with your skin's natural glow."
  if (safetyScore >= 70) return "Balanced: Generally safe, but use with caution."
  if (safetyScore >= 50) return "High Potency: Use carefully to prevent sensitivity."
  return "High Risk: Significant irritant potential detected."
}

/** 8. ASSEMBLY: The Full Engine Execution */
export function analyzeIngredients(ingredientText: string): IngredientAnalysisResult {
  const ingredientNames = parseIngredients(ingredientText)
  const analyzedIngredients = ingredientNames.map(analyzeIngredient)

  const safetyScore = calculateSafetyScore(analyzedIngredients)
  const allergens = extractAllergens(analyzedIngredients)
  const irritants = extractIrritants(analyzedIngredients)
  const skinTypeCompatibility = determineSkinTypeCompatibility(analyzedIngredients)
  const recommendations = generateRecommendations(analyzedIngredients, allergens, irritants)

  const summary = generateSummary(safetyScore)
  const isChildSafe = analyzedIngredients.every(ing => ing.profile?.isChildSafe !== false)

  return {
    totalIngredients: ingredientNames.length,
    analyzedIngredients,
    safetyScore,
    allergens,
    irritants,
    recommendations,
    skinTypeCompatibility,
    summary,
    isChildSafe
  }
}