"use client"

// Custom hook for skin analysis with loading and error states

import { useState, useCallback } from "react"
import { performSkinAnalysis } from "@/lib/skin-analysis-services"

interface UseSkinAnalysisState {
  isLoading: boolean
  error: string | null
  data: any | null
}

export function useSkinAnalysis() {
  const [state, setState] = useState<UseSkinAnalysisState>({
    isLoading: false,
    error: null,
    data: null,
  })

  const analyze = useCallback(async (imageData: string, imageId: string) => {
    setState({ isLoading: true, error: null, data: null })

    try {
      const result = await performSkinAnalysis(imageData, imageId)
      setState({ isLoading: false, error: null, data: result })
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Analysis failed"
      setState({ isLoading: false, error: errorMessage, data: null })
      throw error
    }
  }, [])

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null })
  }, [])

  return {
    ...state,
    analyze,
    reset,
  }
}
