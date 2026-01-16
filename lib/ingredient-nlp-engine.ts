"use client"

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
}

/**
 * Parse ingredient list from text
 */
export function parseIngredients(ingredientText: string): string[] {
  // 🛡️ RE-ENFORCED: Handles commas, semicolons, and newlines from mobile pastes
  return ingredientText
    .split(/[,;\n]/)
    .map((ing) => ing.trim())
    .filter((ing) => ing.length > 0 && ing.length < 100)
}

/**
 * Analyze individual ingredient
 */
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

  return {
    name: profile.name,
    found: true,
    profile,
    safety: profile.safetyRating,
    concerns: profile.commonConcerns,
  }
}

/**
 * Calculate overall safety score
 */
export function calculateSafetyScore(analyzedIngredients: AnalyzedIngredient[]): number {
  if (analyzedIngredients.length === 0) return 100

  let score = 100
  let analyzedCount = 0

  for (const ingredient of analyzedIngredients) {
    if (ingredient.found) {
      analyzedCount++
      switch (ingredient.safety) {
        case "safe":
          break
        case "caution":
          score -= 5
          break
        case "avoid":
          // 🛡️ RE-ENFORCED: Avoided ingredients are high-risk on melanin-rich skin
          score -= 20 
          break
      }
    }
  }

  // Penalize for unknown ingredients to ensure clinical caution
  const unknownCount = analyzedIngredients.length - analyzedCount
  score -= unknownCount * 2

  return Math.max(0, Math.min(100, score))
}

/**
 * Extract allergens from analyzed ingredients
 */
export function extractAllergens(analyzedIngredients: AnalyzedIngredient[]): string[] {
  return analyzedIngredients.filter((ing) => ing.found && ing.profile?.allergenPotential).map((ing) => ing.name)
}

/**
 * Extract irritants from analyzed ingredients
 */
export function extractIrritants(analyzedIngredients: AnalyzedIngredient[]): string[] {
  return analyzedIngredients.filter((ing) => ing.found && ing.profile?.irritantPotential).map((ing) => ing.name)
}

/**
 * Determine skin type compatibility
 */
export function determineSkinTypeCompatibility(analyzedIngredients: AnalyzedIngredient[]): Record<string, string> {
  const skinTypes = ["oily", "combination", "normal", "dry", "sensitive"]
  const compatibility: Record<string, string> = {}

  for (const skinType of skinTypes) {
    const compatibleCount = analyzedIngredients.filter((ing) => {
      if (!ing.found || !ing.profile) return true
      return ing.profile.skinTypeCompatibility[skinType as keyof typeof ing.profile.skinTypeCompatibility]
    }).length

    const compatibilityRatio = compatibleCount / (analyzedIngredients.length || 1)

    if (compatibilityRatio >= 0.9) {
      compatibility[skinType] = "Excellent"
    } else if (compatibilityRatio >= 0.7) {
      compatibility[skinType] = "Good"
    } else if (compatibilityRatio >= 0.5) {
      compatibility[skinType] = "Fair"
    } else {
      compatibility[skinType] = "Poor"
    }
  }

  return compatibility
}

/**
 * Generate recommendations based on analysis
 */
export function generateRecommendations(
  analyzedIngredients: AnalyzedIngredient[],
  allergens: string[],
  irritants: string[],
): string[] {
  const recommendations: string[] = []

  // Patch test recommendation
  if (irritants.length > 0 || analyzedIngredients.some((ing) => ing.safety === "caution")) {
    recommendations.push("Patch test before full application to check for sensitivity")
  }

  // Frequency recommendation
  if (irritants.some(i => ["salicylic acid", "retinol", "benzoyl peroxide"].includes(i.toLowerCase()))) {
    recommendations.push("Start with 2-3 times per week usage and gradually increase")
  }

  // 🛡️ RE-ENFORCED: SPF and PIH Prevention for Melanin-rich skin
  if (
    analyzedIngredients.some((ing) => ing.name.toLowerCase().includes("vitamin c")) ||
    analyzedIngredients.some((ing) => ing.name.toLowerCase().includes("retinol")) ||
    analyzedIngredients.some((ing) => ing.name.toLowerCase().includes("acid"))
  ) {
    recommendations.push("Apply SPF 30+ daily to prevent hyperpigmentation (PIH) while using actives")
  }

  // Allergen warning
  if (allergens.length > 0) {
    recommendations.push(`Risk of reaction. Avoid if allergic to: ${allergens.join(", ")}`)
  }

  // Combination warning
  if (irritants.length > 1) {
    recommendations.push("Caution: Multiple actives detected. Avoid mixing with other exfoliants")
  }

  // Pregnancy warning
  if (
    analyzedIngredients.some((ing) => ["retinol", "salicylic acid", "hydroquinone"].includes(ing.name.toLowerCase()))
  ) {
    recommendations.push("Clinical Alert: Consult your healthcare provider if pregnant or nursing")
  }

  return recommendations.length > 0 ? recommendations : ["Formulation appears stable for general application"]
}

/**
 * Generate summary text
 */
export function generateSummary(
  safetyScore: number,
  allergens: string[],
  irritants: string[],
  unknownCount: number,
): string {
  if (safetyScore >= 85) {
    return "Clinical Grade: This product appears to be safe for most phenotypes with minimal concerns."
  } else if (safetyScore >= 70) {
    return "Balanced: This product is generally safe but contains components that may cause sensitivity."
  } else if (safetyScore >= 50) {
    return "Active Potency: This product contains multiple irritants. Clinical patch test highly recommended."
  } else {
    return "High Risk: Significant irritant potential detected. Consult our Specialist Node before use."
  }
}

/**
 * Perform complete ingredient analysis
 */
export function analyzeIngredients(ingredientText: string): IngredientAnalysisResult {
  // Parse ingredients
  const ingredientNames = parseIngredients(ingredientText)

  // Analyze each ingredient
  const analyzedIngredients = ingredientNames.map(analyzeIngredient)

  // Calculate metrics
  const safetyScore = calculateSafetyScore(analyzedIngredients)
  const allergens = extractAllergens(analyzedIngredients)
  const irritants = extractIrritants(analyzedIngredients)
  const skinTypeCompatibility = determineSkinTypeCompatibility(analyzedIngredients)
  const recommendations = generateRecommendations(analyzedIngredients, allergens, irritants)

  const unknownCount = analyzedIngredients.filter((ing) => !ing.found).length
  const summary = generateSummary(safetyScore, allergens, irritants, unknownCount)

  return {
    totalIngredients: ingredientNames.length,
    analyzedIngredients,
    safetyScore,
    allergens,
    irritants,
    recommendations,
    skinTypeCompatibility,
    summary,
  }
}