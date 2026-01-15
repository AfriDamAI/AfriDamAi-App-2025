// Service layer for ingredient analysis

import { analyzeIngredients } from "./ingredient-nlp-engine"

export async function performIngredientAnalysis(ingredientText: string): Promise<any> {
  try {
    // Perform NLP analysis
    const nlpResult = analyzeIngredients(ingredientText)

    // Format for UI
    const result = {
      productName: "Analyzed Product",
      totalIngredients: nlpResult.totalIngredients,
      safetyScore: nlpResult.safetyScore,
      ingredients: nlpResult.analyzedIngredients.map((ing) => ({
        name: ing.name,
        type: ing.profile?.type || "unknown",
        safety: ing.safety,
        description: ing.profile?.description || "Ingredient details not available",
        concerns: ing.concerns,
      })),
      allergens: nlpResult.allergens,
      irritants: nlpResult.irritants,
      recommendations: nlpResult.recommendations,
      skinTypeCompatibility: nlpResult.skinTypeCompatibility,
      summary: nlpResult.summary,
    }

    return result
  } catch (error) {
    console.error("Ingredient analysis error:", error)
    throw error
  }
}
