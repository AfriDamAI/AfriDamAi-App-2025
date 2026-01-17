"use client"

/**
 * 🛡️ AFRIDAM AESTHETIC NEURAL SERVICE
 * Version: 2026.1.0
 * Combines Edge Inference (TensorFlow) with Cloud Aesthetic Enrichment.
 */

import { analyzeSkinImage as runTensorFlowAnalysis } from "./tensorflow-model"
import apiClient from "@/lib/api-client" 

export interface SkinObservation {
  name: string
  intensity: "low" | "moderate" | "high" // 🛡️ RE-ENFORCED: Non-medical terminology
  confidence: number
  description: string
  suggestion: string
}

export interface DetailedSkinAnalysis {
  overallGlow: number // 🛡️ RE-ENFORCED: Beauty-centric metric
  observations: SkinObservation[]
  recommendations: string[]
  careSuggestions: Array<{
    name: string
    category: string
    reason: string
  }>
  summary: string 
  processingLog: string 
}

/**
 * Perform comprehensive aesthetic skin analysis
 * Uses TensorFlow.js for local inference, then enriches with Cloud AI data
 */
export async function performSkinAnalysis(
  imageData: string, 
  imageId: string
): Promise<DetailedSkinAnalysis> {
  let log = "Aesthetic Node: Online. ";

  try {
    // 🛡️ STEP 1: Run local TensorFlow inference (Fast Edge Processing)
    let localAnalysis = null;
    try {
      localAnalysis = await runTensorFlowAnalysis(imageData);
      log += "Local Analysis Complete. ";
    } catch (error) {
      console.warn("Local TensorFlow failed, shifting to Cloud Node:", error);
      log += "Local Analysis Bypassed. ";
    }

    /** * 🚀 OGA FIX: SYNCED WITH TOBI'S AI MODULE
     * Path updated from /analyzer/skin/enrich to /ai/analyze-skin/enrich
     */
    const apiResponse = await apiClient.post("/ai/analyze-skin/enrich", {
      imageId,
      // Only send raw data if imageId is missing (Safety Fallback)
      rawBuffer: !imageId ? imageData : null 
    });

    const apiAnalysis = apiResponse.data;

    // 🛡️ STEP 3: Combine Results with Aesthetic Bias
    const combinedAnalysis: DetailedSkinAnalysis = {
      overallGlow: localAnalysis?.overallHealth || apiAnalysis.overallGlow || 85,
      observations: apiAnalysis.observations || apiAnalysis.conditions || [],
      recommendations: apiAnalysis.recommendations || [
        "Maintain hydration levels",
        "Perform a 24-hour patch test for new products"
      ],
      careSuggestions: apiAnalysis.careSuggestions || apiAnalysis.productSuggestions || [],
      summary: apiAnalysis.summary || "Aesthetic evaluation complete. Review details below.",
      processingLog: log + "Cloud AI Sync Finalized."
    };

    return combinedAnalysis;
  } catch (error) {
    console.error("Aesthetic Skin Analysis Failed:", error);
    throw new Error("Glow Sync Failed. Please check your connection.");
  }
}

/**
 * Get analysis confidence metrics for Dashboard
 */
export function getConfidenceMetrics(analysis: DetailedSkinAnalysis): {
  averageConfidence: number
  highConfidenceObservations: number
} {
  const confidences = (analysis.observations || []).map((o) => o.confidence);
  const averageConfidence =
    confidences.length > 0 
      ? Math.round(confidences.reduce((a, b) => a + b) / confidences.length) 
      : 0;
      
  const highConfidenceObservations = confidences.filter((c) => c >= 80).length;

  return {
    averageConfidence,
    highConfidenceObservations,
  };
}