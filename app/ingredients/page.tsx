"use client"

import { useState } from "react"
import IngredientAnalyzer from "@/components/ingredient-analyzer"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function IngredientsPage() {
  const [analysisResults, setAnalysisResults] = useState<any>(null)

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Ingredient Analyzer</h1>
          <p className="text-lg text-muted-foreground">
            Paste product ingredients to get AI-powered analysis of irritants, allergens, and skin compatibility
          </p>
        </div>

        <IngredientAnalyzer onAnalysisComplete={setAnalysisResults} />

        {analysisResults && (
          <div className="mt-8">
            <Link href="/scan">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white">
                Back to Skin Scan
              </Button>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
