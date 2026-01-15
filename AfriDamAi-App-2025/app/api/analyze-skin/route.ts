import { type NextRequest, NextResponse } from "next/server"

interface AnalysisRequest {
  imageId: string
  imageData?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()

    if (!body.imageId && !body.imageData) {
      return NextResponse.json({ error: "No image data provided" }, { status: 400 })
    }

    // Simulate AI analysis - in production, this would call TensorFlow.js or a backend ML service
    const analysisResult = {
      imageId: body.imageId,
      timestamp: new Date().toISOString(),
      overallHealth: Math.floor(Math.random() * 30) + 70, // 70-100
      conditions: [
        {
          name: "Mild Acne",
          severity: "mild",
          confidence: Math.floor(Math.random() * 20) + 80,
          description: "Small comedones detected on forehead and chin",
          recommendation: "Use gentle exfoliants 2-3 times weekly",
        },
        {
          name: "Dryness",
          severity: "moderate",
          confidence: Math.floor(Math.random() * 20) + 75,
          description: "Dry patches detected on cheeks",
          recommendation: "Increase hydration with moisturizers containing hyaluronic acid",
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

    return NextResponse.json(analysisResult, { status: 200 })
  } catch (error) {
    console.error("Analysis error:", error)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
