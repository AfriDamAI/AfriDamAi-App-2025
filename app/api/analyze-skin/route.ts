import { type NextRequest, NextResponse } from "next/server"
/** * 🛡️ OGA FIX: Points to our verified hybrid service 
 * that combines local TensorFlow with Tobi's Cloud AI.
 */
import { performSkinAnalysis } from "@/lib/skin-analysis-service"

interface AnalysisRequest {
  imageId: string
  imageData?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisRequest = await request.json()

    // 🛡️ RE-ENFORCED: Validation for Play Store Stability
    if (!body.imageId && !body.imageData) {
      return NextResponse.json(
        { error: "Neural input missing. Please capture a clear image." }, 
        { status: 400 }
      )
    }

    /**
     * 🔬 NEURAL HYBRID EXECUTION
     * We pass the data to our service which:
     * 1. Runs local TensorFlow (Fast results)
     * 2. Calls Tobi's new /ai/analyze-skin/enrich (Deep results)
     */
    const analysisResult = await performSkinAnalysis(
      body.imageData || "", 
      body.imageId
    );

    // 🛡️ RE-ENFORCED: Standardizing for the Aesthetic Dashboard
    return NextResponse.json({
      ...analysisResult,
      timestamp: new Date().toISOString(),
      status: "Verified by AfriDam AI"
    }, { status: 200 })

  } catch (error: any) {
    console.error("Aesthetic analysis error:", error)
    
    // 🛡️ RE-ENFORCED: Graceful failure for the UI
    return NextResponse.json(
      { error: error.message || "Glow synchronization failed." }, 
      { status: 500 }
    )
  }
}