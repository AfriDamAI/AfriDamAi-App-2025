import { type NextRequest, NextResponse } from "next/server"
/** * 🛡️ OGA FIX: Points to our verified intelligence engine 
 * rather than simulating random data.
 */
import { analyzeIngredients } from "@/lib/ingredient-nlp-engine"

interface IngredientAnalysisRequest {
  ingredients: string
}

export async function POST(request: NextRequest) {
  try {
    const body: IngredientAnalysisRequest = await request.json()

    if (!body.ingredients || body.ingredients.trim().length === 0) {
      return NextResponse.json({ error: "No ingredients provided for analysis" }, { status: 400 })
    }

    /**
     * 🔬 NEURAL ENGINE EXECUTION
     * We pass the raw text to our engine which handles:
     * 1. Parsing (commas, newlines, etc.)
     * 2. Melanin-specific safety scoring
     * 3. Pediatric/Baby-safe verification
     */
    const analysisResult = analyzeIngredients(body.ingredients);

    // 🛡️ RE-ENFORCED: Standardizing response for the Frontend
    return NextResponse.json({
      ...analysisResult,
      productName: "Aesthetic Safety Audit",
      timestamp: new Date().toISOString()
    }, { status: 200 })

  } catch (error) {
    console.error("Aesthetic analysis error:", error)
    return NextResponse.json(
      { error: "Neural synchronization failed. Please check formula text." }, 
      { status: 500 }
    )
  }
}