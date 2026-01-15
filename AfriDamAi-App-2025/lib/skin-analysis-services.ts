// Service layer for skin analysis combining TensorFlow and API calls

import { analyzeSkinImage as runTensorFlowAnalysis } from "./tensorflow-model"
import { analyzeSkinImage as callAnalysisAPI } from "./api-client"

interface DetailedSkinAnalysis {
  overallHealth: number
  conditions: Array<{
    name: string
    severity: "mild" | "moderate" | "severe"
    confidence: number
    description: string
    recommendation: string
  }>
  recommendations: string[]
  productSuggestions: Array<{
    name: string
    category: string
    reason: string
  }>
}

/**
 * Perform comprehensive skin analysis
 * Uses TensorFlow.js for local inference, then enriches with API data
 */
export async function performSkinAnalysis(imageData: string, imageId: string): Promise<DetailedSkinAnalysis> {
  try {
    // Step 1: Run local TensorFlow inference
    let localAnalysis
    try {
      localAnalysis = await runTensorFlowAnalysis(imageData)
    } catch (error) {
      console.warn("Local TensorFlow analysis failed, falling back to API:", error)
      localAnalysis = null
    }

    // Step 2: Call API for detailed analysis
    const apiAnalysis = await callAnalysisAPI(imageId, imageData)

    // Step 3: Combine results
    const combinedAnalysis: DetailedSkinAnalysis = {
      overallHealth: localAnalysis?.overallHealth || apiAnalysis.overallHealth,
      conditions: apiAnalysis.conditions,
      recommendations: apiAnalysis.recommendations,
      productSuggestions: apiAnalysis.productSuggestions,
    }

    return combinedAnalysis
  } catch (error) {
    console.error("Skin analysis failed:", error)
    throw error
  }
}

/**
 * Get analysis confidence metrics
 */
export function getConfidenceMetrics(analysis: DetailedSkinAnalysis): {
  averageConfidence: number
  highConfidenceConditions: number
} {
  const confidences = analysis.conditions.map((c) => c.confidence)
  const averageConfidence =
    confidences.length > 0 ? Math.round(confidences.reduce((a, b) => a + b) / confidences.length) : 0
  const highConfidenceConditions = confidences.filter((c) => c >= 80).length

  return {
    averageConfidence,
    highConfidenceConditions,
  }
}
