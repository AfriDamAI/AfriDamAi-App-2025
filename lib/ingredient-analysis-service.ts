"use client"

/**
 * 🛡️ AFRIDAM NEURAL CORE: INGREDIENT SAFETY SERVICE (Rule 6 Synergy)
 * Version: 2026.1.18 (Type-Safe Hybrid)
 * Focus: High-speed local analysis with Cloud Aesthetic Enrichment.
 */

import apiClient from "@/lib/api-client"
import { analyzeIngredients as runLocalAnalysis } from "./ingredient-nlp-engine"

export interface IngredientResult {
  productName: string;
  totalIngredients: number;
  safetyScore: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  isChildSafe: boolean;
  ingredients: Array<{
    name: string;
    type: string;
    // 🚀 OGA FIX: Added 'unknown' to match the NLP Engine's output
    safety: "safe" | "caution" | "avoid" | "unknown"; 
    description: string;
    concerns: string[];
  }>;
  recommendations: string[];
  summary: string;
  timestamp: number;
}

/**
 * Perform hybrid ingredient analysis
 */
export async function performIngredientAnalysis(ingredientText: string): Promise<IngredientResult> {
  if (!ingredientText || ingredientText.length < 3) {
    throw new Error("Please enter a valid list of ingredients.");
  }

  // 🛡️ STEP 1: INSTANT LOCAL ANALYSIS
  const localData = runLocalAnalysis(ingredientText);

  try {
    /** * 🚀 RULE 6 ENDPOINT SYNC */
    const response = await apiClient.post("/ai/ingredient-check", {
      text: ingredientText,
      source: "manual_ingestion"
    });

    const cloudData = response.data;

    // 🛡️ STEP 2: CLOUD ENRICHMENT
    return {
      productName: cloudData.productName || "Safety Audit Result",
      totalIngredients: cloudData.totalIngredients || localData.totalIngredients,
      safetyScore: cloudData.safetyScore || localData.safetyScore,
      riskLevel: (cloudData.safetyScore || localData.safetyScore) >= 80 ? "LOW" : "MEDIUM",
      isChildSafe: cloudData.isChildSafe ?? localData.isChildSafe, 
      ingredients: (cloudData.ingredients || localData.analyzedIngredients).map((ing: any) => ({
        name: ing.name,
        // 🚀 OGA FIX: Force string conversion to prevent 'any' errors
        type: String(ing.type || ing.profile?.type || "Beauty Component"),
        safety: (ing.safety as "safe" | "caution" | "avoid" | "unknown") || "unknown",
        description: String(ing.description || ing.profile?.description || "Safety data is being updated."),
        concerns: ing.concerns || [],
      })),
      recommendations: cloudData.recommendations || localData.recommendations,
      summary: cloudData.summary || localData.summary,
      timestamp: Date.now()
    };

  } catch (error) {
    console.warn("Cloud Sync failed, reverting to Local Engine:", error);
    
    // 🛡️ STEP 3: GRACEFUL LOCAL FALLBACK
    return {
      productName: "Local Safety Audit",
      totalIngredients: localData.totalIngredients,
      safetyScore: localData.safetyScore,
      riskLevel: localData.safetyScore >= 80 ? "LOW" : localData.safetyScore >= 50 ? "MEDIUM" : "HIGH",
      isChildSafe: localData.isChildSafe || false,
      ingredients: localData.analyzedIngredients.map(ing => ({
        name: ing.name,
        type: String(ing.profile?.type || "Component"),
        safety: ing.safety as "safe" | "caution" | "avoid" | "unknown",
        description: String(ing.profile?.description || "Analyzed via local database."),
        concerns: ing.concerns,
      })),
      recommendations: localData.recommendations,
      summary: localData.summary + " (Offline Mode)",
      timestamp: Date.now()
    };
  }
}