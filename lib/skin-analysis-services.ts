"use client"

/**
 * 🛡️ AFRIDAM AESTHETIC NEURAL SERVICE (Rule 6 Synergy)
 * Version: 2026.1.1 (Backend Handshake Optimization)
 * Focus: Sophisticated Scaling, Property Alignment, Rule 6 Compliance.
 */

import { analyzeSkinImage as runTensorFlowAnalysis } from "./tensorflow-model"
import { apiClient } from "@/lib/api-client" 

export interface SkinObservation {
  name: string
  intensity: "low" | "moderate" | "high"
  confidence: number
  description: string
  suggestion: string
}

export interface DetailedSkinAnalysis {
  overallGlow: number
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
      // 🛡️ Rule 6: No jargon, just graceful fallback
      log += "Local Analysis Bypassed. ";
    }

    /** * 🚀 RULE 6 SYNC: 
     * Handshake with Tobi's AI Module.
     * Path: /ai/analyze-skin/enrich
     */
    const apiResponse = await apiClient.post("/ai/analyze-skin/enrich", {
      imageId,
      rawBuffer: !imageId ? imageData : null 
    });

    const apiData = apiResponse.data;

    // 🛡️ STEP 3: Combine Results with Property Fallbacks (Preventing Undefined)
    const combinedAnalysis: DetailedSkinAnalysis = {
      // 🚀 OGA FIX: Checking both camelCase and snake_case from Backend
      overallGlow: localAnalysis?.overallHealth || apiData.overallGlow || apiData.overall_glow || 85,
      observations: apiData.observations || apiData.conditions || [],
      recommendations: apiData.recommendations || [
        "Maintain hydration levels",
        "Perform a 24-hour patch test for new products"
      ],
      careSuggestions: apiData.careSuggestions || apiData.care_suggestions || apiData.productSuggestions || [],
      summary: apiData.summary || "Aesthetic evaluation complete. Review details below.",
      processingLog: log + "Cloud AI Sync Finalized."
    };

    return combinedAnalysis;
  } catch (error) {
    console.error("Clinical Sync Failed:", error);
    // 🛡️ RE-ENFORCED: Relatable English
    throw new Error("We couldn't sync your skin data. Please check your connection and try again.");
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