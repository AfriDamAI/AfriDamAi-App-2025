"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import IngredientResults from "@/components/ingredient-results"

interface IngredientAnalyzerProps {
  onAnalysisComplete: (results: any) => void
}

export default function IngredientAnalyzer({ onAnalysisComplete }: IngredientAnalyzerProps) {
  const [ingredientText, setIngredientText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!ingredientText.trim()) {
      alert("Please enter ingredients to analyze")
      return
    }

    setIsAnalyzing(true)

    // Simulate API call to analyze ingredients
    setTimeout(() => {
      const mockResults = {
        productName: "Analyzed Product",
        totalIngredients: ingredientText.split(",").length,
        safetyScore: 82,
        ingredients: [
          {
            name: "Water",
            type: "solvent",
            safety: "safe",
            description: "Primary solvent and hydrating agent",
            concerns: [],
          },
          {
            name: "Glycerin",
            type: "humectant",
            safety: "safe",
            description: "Powerful humectant that draws moisture into skin",
            concerns: [],
          },
          {
            name: "Salicylic Acid",
            type: "exfoliant",
            safety: "caution",
            description: "Beta hydroxy acid for exfoliation",
            concerns: ["May cause irritation in sensitive skin", "Avoid if pregnant"],
          },
          {
            name: "Fragrance",
            type: "fragrance",
            safety: "caution",
            description: "Synthetic fragrance blend",
            concerns: ["Common allergen", "May irritate sensitive skin"],
          },
          {
            name: "Phenoxyethanol",
            type: "preservative",
            safety: "safe",
            description: "Preservative to prevent microbial growth",
            concerns: [],
          },
        ],
        allergens: ["Fragrance"],
        irritants: ["Salicylic Acid (in high concentrations)"],
        recommendations: [
          "Patch test before full application",
          "Start with 2-3 times per week usage",
          "Use SPF 30+ during the day",
          "Avoid mixing with other exfoliants",
          "Not recommended for sensitive skin types",
        ],
        skinTypeCompatibility: {
          oily: "Excellent",
          combination: "Good",
          normal: "Good",
          dry: "Fair",
          sensitive: "Poor",
        },
      }

      setResults(mockResults)
      onAnalysisComplete(mockResults)
      setIsAnalyzing(false)
    }, 2000)
  }

  const handleReset = () => {
    setIngredientText("")
    setResults(null)
    onAnalysisComplete(null)
  }

  if (results) {
    return (
      <div className="space-y-6">
        <IngredientResults data={results} />
        <Button onClick={handleReset} size="lg" variant="outline" className="w-full bg-transparent">
          Analyze Another Product
        </Button>
      </div>
    )
  }

  return (
    <Card className="p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="ingredients" className="block text-sm font-semibold text-foreground mb-2">
            Product Ingredients
          </label>
          <p className="text-sm text-muted-foreground mb-3">
            Paste the ingredient list from your product. You can copy it directly from the label or product page.
          </p>
          <textarea
            id="ingredients"
            value={ingredientText}
            onChange={(e) => setIngredientText(e.target.value)}
            placeholder="Example: Water, Glycerin, Salicylic Acid, Fragrance, Phenoxyethanol..."
            className="w-full h-40 p-4 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-orange-900">
            <strong>Tip:</strong> For best results, paste the full INCI (International Nomenclature of Cosmetic
            Ingredients) list. Ingredients are typically listed in order of concentration.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !ingredientText.trim()}
            size="lg"
            className="flex-1 bg-orange-700 hover:bg-orange-300 text-white disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Analyzing...
              </>
            ) : (
              "Analyze Ingredients"
            )}
          </Button>
          <Button onClick={handleReset} size="lg" variant="outline" className="flex-1 bg-transparent">
            Clear
          </Button>
        </div>
      </div>
    </Card>
  )
}
