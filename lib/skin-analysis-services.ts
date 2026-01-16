"use client"

/**
 * 🔬 AFRIDAM AI NEURAL HYBRID SERVICE
 * Combines Edge Inference (TensorFlow) with Cloud Clinical Enrichment.
 */

import { analyzeSkinImage as runTensorFlowAnalysis } from "./tensorflow-model"
import apiClient from "@/lib/api-client" // 🛡️ RE-ENFORCED: Using our secure client

export interface SkinCondition {
  name: string
  severity: "mild" | "moderate" | "severe"
  confidence: number
  description: string
  recommendation: string
}

export interface DetailedSkinAnalysis {
  overallHealth: number
  conditions: SkinCondition[]
  recommendations: string[]
  productSuggestions: Array<{
    name: string
    category: string
    reason: string
  }>
  summary: string // 🛡️ RE-ENFORCED: Clinical Summary for UI
  processingLog: string // 🛡️ RE-ENFORCED: Transparency for the user
}

/**
 * Perform comprehensive skin analysis
 * Uses TensorFlow.js for local inference, then enriches with Cloud API data
 */
export async function performSkinAnalysis(
  imageData: string, 
  imageId: string
): Promise<DetailedSkinAnalysis> {
  let log = "Neural Node: Online. ";

  try {
    // 🛡️ STEP 1: Run local TensorFlow inference (Fast Edge Processing)
    let localAnalysis = null;
    try {
      localAnalysis = await runTensorFlowAnalysis(imageData);
      log += "Local Inference Complete. ";
    } catch (error) {
      console.warn("Local TensorFlow failed, shifting to Cloud Node:", error);
      log += "Local Inference Bypassed. ";
    }

    // 🛡️ STEP 2: Call API for detailed clinical enrichment
    // OGA FIX: If we have an imageId, we only send the ID to save bandwidth
    const apiResponse = await apiClient.post("/analyzer/skin/enrich", {
      imageId,
      // Only send raw data if imageId is missing (Safety Fallback)
      rawBuffer: !imageId ? imageData : null 
    });

    const apiAnalysis = apiResponse.data;

    // 🛡️ STEP 3: Combine Results with Clinical Bias
    const combinedAnalysis: DetailedSkinAnalysis = {
      overallHealth: localAnalysis?.overallHealth || apiAnalysis.overallHealth || 85,
      conditions: apiAnalysis.conditions || [],
      recommendations: apiAnalysis.recommendations || [
        "Maintain hydration levels",
        "Perform a patch test for new products"
      ],
      productSuggestions: apiAnalysis.productSuggestions || [],
      summary: apiAnalysis.summary || "Dermal analysis complete. Review conditions below.",
      processingLog: log + "Cloud Sync Finalized."
    };

    return combinedAnalysis;
  } catch (error) {
    console.error("Clinical Skin Analysis Failed:", error);
    throw new Error("Dermal Synchronisation Failed. Check clinical connection.");
  }
}

/**
 * Get analysis confidence metrics for Dashboard
 */
export function getConfidenceMetrics(analysis: DetailedSkinAnalysis): {
  averageConfidence: number
  highConfidenceConditions: number
} {
  const confidences = analysis.conditions.map((c) => c.confidence);
  const averageConfidence =
    confidences.length > 0 
      ? Math.round(confidences.reduce((a, b) => a + b) / confidences.length) 
      : 0;
      
  const highConfidenceConditions = confidences.filter((c) => c >= 80).length;

  return {
    averageConfidence,
    highConfidenceConditions,
  };
}