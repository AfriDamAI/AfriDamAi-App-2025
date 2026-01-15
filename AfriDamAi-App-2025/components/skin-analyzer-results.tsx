"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface Condition {
  name: string
  severity: "mild" | "moderate" | "severe"
  confidence: number
  description: string
  recommendation: string
}

interface ProductSuggestion {
  name: string
  category: string
  reason: string
}

interface AnalysisData {
  overallHealth: number
  conditions: Condition[]
  recommendations: string[]
  productSuggestions: ProductSuggestion[]
}

interface SkinAnalysisResultsProps {
  data: AnalysisData
}

export default function SkinAnalysisResults({ data }: SkinAnalysisResultsProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "moderate":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "severe":
        return "bg-red-100 text-red-800 border-red-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="space-y-8">
      {/* Overall Health Score */}
      <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-foreground">Overall Skin Health Score</h2>
          <div className="text-5xl font-bold text-orange-600">{data.overallHealth}%</div>
        </div>
        <Progress value={data.overallHealth} className="h-3" />
        <p className="text-sm text-muted-foreground mt-4">
          Based on detected conditions, hydration levels, and overall skin appearance
        </p>
      </Card>

      {/* Detected Conditions */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Detected Conditions</h3>
        <div className="space-y-4">
          {data.conditions.map((condition, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-lg font-bold text-foreground">{condition.name}</h4>
                  <p className="text-sm text-muted-foreground">{condition.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(condition.severity)}`}
                >
                  {condition.severity.charAt(0).toUpperCase() + condition.severity.slice(1)}
                </span>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="font-semibold text-foreground">{condition.confidence}%</span>
                </div>
                <Progress value={condition.confidence} className="h-2" />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm font-semibold text-orange-900 mb-1">Recommendation:</p>
                <p className="text-sm text-orange-800">{condition.recommendation}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* General Recommendations */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">General Recommendations</h3>
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

      {/* Product Suggestions */}
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-4">Suggested Products</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.productSuggestions.map((product, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <h4 className="text-lg font-bold text-foreground mb-2">{product.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{product.category}</p>
              <div className="bg-green-50 border border-green-200 rounded p-2">
                <p className="text-sm text-green-800">{product.reason}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <p className="text-sm text-amber-900">
          <strong>Disclaimer:</strong> This analysis is for informational purposes only and should not replace
          professional medical advice. Please consult with a dermatologist for accurate diagnosis and treatment
          recommendations.
        </p>
      </Card>
    </div>
  )
}
