"use client"

import { useState, useEffect } from "react"
import SkinAnalysisResults from "@/components/skin-analyzer-results"
import Questionnaire from "@/components/questionnaire"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { addToHistory } from "@/lib/history-manager"

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [analysisData, setAnalysisData] = useState<any>(null)
  const [recordId, setRecordId] = useState<string | null>(null)

  useEffect(() => {
    // Simulate API call to get analysis results
    const timer = setTimeout(() => {
      const mockData = {
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
      setAnalysisData(mockData)

      const record = addToHistory({
        type: "skin",
        results: {
          conditions: mockData.conditions,
        },
      })
      if (record) {
        setRecordId(record.id)
      }

      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Your Skin Analysis Results</h1>
          <p className="text-lg text-muted-foreground">
            Powered by AI dermatology analysis - for informational purposes only
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

            <Questionnaire />

            {recordId && (
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-sm text-green-700 dark:text-green-200">
                  ✓ This result has been saved to your{" "}
                  <Link href="/history" className="font-semibold underline hover:no-underline">
                    scan history
                  </Link>
                </p>
              </div>
            )}

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
              <Link href="/history" className="flex-1">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  View History
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
