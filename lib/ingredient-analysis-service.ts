// 🧪 RE-ENFORCED: Clinical Ingredient Intelligence Service
import { analyzeIngredients } from "./ingredient-nlp-engine"
import apiClient from "@/lib/api-client"

export async function performIngredientAnalysis(ingredientText: string): Promise<any> {
  if (!ingredientText || ingredientText.length < 3) {
    throw new Error("Invalid formulation text detected.");
  }

  try {
    // 🛡️ RE-ENFORCED: Attempt High-Precision Cloud Analysis first
    try {
      const cloudResponse = await apiClient.post("/analyzer/ingredients", {
        text: ingredientText,
        source: "manual_ingestion"
      });
      if (cloudResponse.data) return cloudResponse.data;
    } catch (cloudError) {
      console.warn("Cloud Intelligence Offline - Falling back to Local NLP Node");
    }

    // 🔬 FALLBACK: Local NLP analysis for offline/low-bandwidth usage
    const nlpResult = await Promise.resolve(analyzeIngredients(ingredientText));

    // 🛡️ RE-ENFORCED: Production-ready Data Mapping
    const result = {
      productName: "Neural Audit Result",
      totalIngredients: nlpResult.totalIngredients,
      safetyScore: nlpResult.safetyScore,
      // Mapping risk level for UI color-coding
      riskLevel: nlpResult.safetyScore >= 80 ? "LOW" : nlpResult.safetyScore >= 50 ? "MEDIUM" : "HIGH",
      ingredients: nlpResult.analyzedIngredients.map((ing: any) => ({
        name: ing.name,
        type: ing.profile?.type || "General Component",
        safety: ing.safety, // "safe" | "caution" | "avoid"
        description: ing.profile?.description || "Clinical data for this specific component is pending review.",
        concerns: ing.concerns || [],
      })),
      allergens: nlpResult.allergens || [],
      irritants: nlpResult.irritants || [],
      recommendations: nlpResult.recommendations || ["Perform a 24-hour patch test before full application."],
      skinTypeCompatibility: nlpResult.skinTypeCompatibility || {
        "Oily": "Good",
        "Dry": "Good",
        "Sensitive": "Caution"
      },
      summary: nlpResult.summary || "Analysis complete. Review flagged components above.",
      timestamp: Date.now()
    }

    return result
  } catch (error) {
    console.error("Clinical Intelligence Error:", error)
    throw new Error("Formula synchronization failed. Please check your connection.");
  }
}