"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import SkinAnalysisResults from "@/components/skin-analyzer-results"
import { addToHistory } from "@/lib/history-manager"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [hasData, setHasData] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const scanType = sessionStorage.getItem("scanType") as "skin" | "ingredient" | null
    const scanImage = sessionStorage.getItem("scanImage")

    if (!scanType || !scanImage) {
      // Redirect back to scan if no data
      router.push("/scan")
      return
    }

    setHasData(true)

    // Simulate API call to get analysis results
    const timer = setTimeout(() => {
      const results = {
        overallHealth: 78,
        conditions: [
          {
            name: "Mild Acne",
            severity: "mild",
            confidence: 92,
            description: "Small comedones detected on forehead and chin",
            recommendation: "Use gentle exfoliants 2-3 times weekly",
          },
          {
            name: "Dryness",
            severity: "moderate",
            confidence: 85,
            description: "Dry patches detected on cheeks",
            recommendation: "Increase hydration with moisturizers containing hyaluronic acid",
          },
          {
            name: "Uneven Tone",
            severity: "mild",
            confidence: 78,
            description: "Minor pigmentation variations",
            recommendation: "Use vitamin C serum for brightening",
          },
        ],
        recommendations: [
          "Use a gentle cleanser twice daily",
          "Apply SPF 30+ sunscreen daily",
          "Stay hydrated with 8+ glasses of water",
          "Consider a dermatologist consultation for persistent acne",
        ],
        productSuggestions: [
          { name: "Gentle Cleanser", category: "Cleanser", reason: "Non-irritating for acne-prone skin" },
          { name: "Hyaluronic Acid Serum", category: "Serum", reason: "Hydration for dry patches" },
          { name: "Vitamin C Serum", category: "Serum", reason: "Brightening for uneven tone" },
          { name: "Broad Spectrum SPF 30", category: "Sunscreen", reason: "Daily UV protection" },
        ],
      }

      setAnalysisData(results)

      if (scanType) {
        addToHistory({
          type: scanType,
          imageUrl: scanImage,
          results: {
            conditions: results.conditions,
          },
        })
      }

      // Clear sessionStorage after saving
      sessionStorage.removeItem("scanType")
      sessionStorage.removeItem("scanImage")

      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  if (!hasData) {
    return null
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Skin Analysis Results</h1>
          <p className="text-lg text-muted-foreground">
            Powered by AfriDam AI dermatology analysis - for informational purposes only
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              </div>
              <p className="text-lg text-muted-foreground">Analyzing your skin...</p>
            </div>
          </div>
        ) : analysisData ? (
          <>
            <SkinAnalysisResults data={analysisData} />

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Link href="/scan" className="flex-1">
                <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Scan Again
                </Button>
              </Link>
              <Link href="/ingredients" className="flex-1">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  Analyze Ingredients
                </Button>
              </Link>
              <Link href="/dashboard" className="flex-1">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">No analysis data available</p>
          </div>
        )}
      </div>
    </main>
  )
}
