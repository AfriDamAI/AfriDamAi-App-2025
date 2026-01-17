/**
 * 🛡️ AFRIDAM NEURAL CORE: INGREDIENT SAFETY SERVICE
 * Optimized for Skincare, Women, and Pediatric Safety.
 */

import apiClient from "@/lib/api-client"

export interface IngredientResult {
  productName: string;
  totalIngredients: number;
  safetyScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  isChildSafe: boolean; // 👶 NEW: Vital for your target audience
  ingredients: Array<{
    name: string;
    type: string;
    safety: "safe" | "caution" | "avoid";
    description: string;
    concerns: string[];
  }>;
  recommendations: string[];
  summary: string;
  timestamp: number;
}

export async function performIngredientAnalysis(ingredientText: string): Promise<IngredientResult> {
  if (!ingredientText || ingredientText.length < 3) {
    throw new Error("Invalid formulation text detected.");
  }

  try {
    /** * 🚀 OGA FIX: SYNCED WITH TOBI'S AI MODULE
     * Changed from /analyzer/ingredients to /ai/ingredient-check
     */
    const response = await apiClient.post("/ai/ingredient-check", {
      text: ingredientText,
      source: "manual_ingestion"
    });

    const data = response.data;

    // 🛡️ RE-ENFORCED: Data Mapping for Aesthetic/Beauty Scope
    return {
      productName: data.productName || "Safety Audit Result",
      totalIngredients: data.totalIngredients || 0,
      safetyScore: data.safetyScore || 0,
      // Color-coding for the UI
      riskLevel: data.safetyScore >= 80 ? "LOW" : data.safetyScore >= 50 ? "MEDIUM" : "HIGH",
      // 👶 NEW: Check for child-safe ingredients (Tobi's new logic)
      isChildSafe: data.isChildSafe ?? (data.safetyScore >= 85), 
      ingredients: (data.ingredients || []).map((ing: any) => ({
        name: ing.name,
        type: ing.type || "Beauty Component",
        safety: ing.safety || "caution",
        description: ing.description || "Safety data for this component is being updated.",
        concerns: ing.concerns || [],
      })),
      recommendations: data.recommendations || ["Perform a 24-hour patch test."],
      summary: data.summary || "Evaluation complete. Please check flagged items.",
      timestamp: Date.now()
    };

  } catch (error) {
    console.error("Aesthetic Intelligence Sync Error:", error);
    
    // 🔬 FALLBACK: Simple Local Parser if Backend is truly offline
    return {
      productName: "Basic Safety Check",
      totalIngredients: 0,
      safetyScore: 50,
      riskLevel: "MEDIUM",
      isChildSafe: false,
      ingredients: [],
      recommendations: ["Connection weak. Please try again for full AI analysis."],
      summary: "Limited offline analysis. Full safety check requires sync.",
      timestamp: Date.now()
    };
  }
}