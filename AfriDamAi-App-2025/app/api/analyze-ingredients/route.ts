import { type NextRequest, NextResponse } from "next/server"

interface IngredientAnalysisRequest {
  ingredients: string
}

export async function POST(request: NextRequest) {
  try {
    const body: IngredientAnalysisRequest = await request.json()

    if (!body.ingredients || body.ingredients.trim().length === 0) {
      return NextResponse.json({ error: "No ingredients provided" }, { status: 400 })
    }

    // Parse ingredients from comma-separated list
    const ingredientList = body.ingredients
      .split(",")
      .map((ing) => ing.trim())
      .filter((ing) => ing.length > 0)

    // Simulate NLP analysis - in production, this would use a real NLP model
    const analysisResult = {
      productName: "Analyzed Product",
      totalIngredients: ingredientList.length,
      safetyScore: Math.floor(Math.random() * 30) + 70,
      ingredients: ingredientList.map((ingredient, index) => ({
        name: ingredient,
        type: ["solvent", "humectant", "exfoliant", "preservative", "fragrance"][index % 5],
        safety: ["safe", "safe", "caution", "safe", "caution"][index % 5],
        description: `${ingredient} is a cosmetic ingredient with specific properties`,
        concerns: index % 3 === 0 ? ["May cause irritation in sensitive skin"] : [],
      })),
      allergens: ingredientList.filter((_, i) => i % 4 === 0),
      irritants: ingredientList.filter((_, i) => i % 5 === 2),
      recommendations: [
        "Patch test before full application",
        "Start with 2-3 times per week usage",
        "Use SPF 30+ during the day",
        "Avoid mixing with other exfoliants",
      ],
      skinTypeCompatibility: {
        oily: "Excellent",
        combination: "Good",
        normal: "Good",
        dry: "Fair",
        sensitive: "Poor",
      },
    }

    return NextResponse.json(analysisResult, { status: 200 })
  } catch (error) {
    console.error("Ingredient analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
