// Component to handle TensorFlow model loading and initialization

"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { loadModel, isModelLoaded } from "@/lib/tensorflow-model"

interface SkinAnalysisLoaderProps {
  children: React.ReactNode
}

export default function SkinAnalysisLoader({ children }: SkinAnalysisLoaderProps) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initializeModel = async () => {
      try {
        if (!isModelLoaded()) {
          await loadModel()
        }
        setIsReady(true)
      } catch (err) {
        console.error("Failed to initialize skin analysis model:", err)
        setError("Failed to load analysis model. Using API fallback.")
        setIsReady(true) // Still allow app to work with API fallback
      }
    }

    initializeModel()
  }, [])

  if (error) {
    console.warn(error)
  }

  return <>{isReady ? children : <div className="flex items-center justify-center min-h-screen">Loading...</div>}</>
}
