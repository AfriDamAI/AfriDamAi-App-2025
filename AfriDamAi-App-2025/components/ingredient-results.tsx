"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Ingredient {
  name: string
  type: string
  safety: "safe" | "caution" | "avoid"
  description: string
  concerns: string[]
}

interface IngredientResultsProps {
  data: {
    productName: string
    totalIngredients: number
    safetyScore: number
    ingredients: Ingredient[]
    allergens: string[]
    irritants: string[]
    recommendations: string[]
    skinTypeCompatibility: Record<string, string>
  }
}

export default function IngredientResults({ data }: IngredientResultsProps) {
  const getSafetyColor = (safety: string) => {
    switch (safety) {
      case "safe":
        return "bg-green-100 text-green-800 border-green-300"
      case "caution":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "avoid":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  const getSafetyIcon = (safety: string) => {
    switch (safety) {
      case "safe":
        return "✓"
      case "caution":
        return "!"
      case "avoid":
        return "✕"
      default:
        return "?"
    }
  }

  return (
    <div className="space-y-8">
      {/* Safety Score */}
      <Card className="p-8 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Product Safety Score</h2>
          <div className="text-5xl font-bold text-green-600">{data.safetyScore}%</div>
        </div>
        <Progress value={data.safetyScore} className="h-3" />
        <p className="text-sm text-muted-foreground mt-4">
          Based on ingredient safety profiles, allergen content, and irritant potential
        </p>
      </Card>

      {/* Allergens & Irritants */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 border-red-200 bg-red-50">
          <h3 className="text-lg font-bold text-red-900 mb-4">Known Allergens</h3>
          {data.allergens.length > 0 ? (
            <ul className="space-y-2">
              {data.allergens.map((allergen, index) => (
                <li key={index} className="flex items-center gap-2 text-red-800">
                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                  {allergen}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-red-800">No known allergens detected</p>
          )}
        </Card>

        <Card className="p-6 border-orange-200 bg-orange-50">
          <h3 className="text-lg font-bold text-orange-900 mb-4">Potential Irritants</h3>
          {data.irritants.length > 0 ? (
            <ul className="space-y-2">
              {data.irritants.map((irritant, index) => (
                <li key={index} className="flex items-center gap-2 text-orange-800">
                  <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                  {irritant}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-orange-800">No major irritants detected</p>
          )}
        </Card>
      </div>

      {/* Ingredient Breakdown */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Ingredient Breakdown</h3>
        <div className="space-y-3">
          {data.ingredients.map((ingredient, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-foreground">{ingredient.name}</h4>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold border ${getSafetyColor(ingredient.safety)}`}
                    >
                      {getSafetyIcon(ingredient.safety)} {ingredient.safety.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{ingredient.description}</p>
                  <p className="text-xs text-muted-foreground">Type: {ingredient.type}</p>
                  {ingredient.concerns.length > 0 && (
                    <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded p-2">
                      <p className="text-xs font-semibold text-yellow-900 mb-1">Concerns:</p>
                      <ul className="text-xs text-yellow-800 space-y-1">
                        {ingredient.concerns.map((concern, i) => (
                          <li key={i}>• {concern}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Skin Type Compatibility */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Skin Type Compatibility</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(data.skinTypeCompatibility).map(([skinType, compatibility]) => (
            <Card key={skinType} className="p-4 text-center">
              <p className="text-sm font-semibold text-foreground capitalize mb-2">{skinType}</p>
              <p
                className={`text-sm font-bold ${
                  compatibility === "Excellent"
                    ? "text-green-600"
                    : compatibility === "Good"
                      ? "text-blue-600"
                      : compatibility === "Fair"
                        ? "text-yellow-600"
                        : "text-red-600"
                }`}
              >
                {compatibility}
              </p>
            </Card>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Usage Recommendations</h3>
        <Card className="p-6">
          <ul className="space-y-3">
            {data.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-foreground pt-0.5">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <p className="text-sm text-amber-900">
          <strong>Disclaimer:</strong> This analysis is for informational purposes only. Always perform a patch test
          before using new products. If you experience any adverse reactions, discontinue use and consult a
          dermatologist.
        </p>
      </Card>
    </div>
  )
}
