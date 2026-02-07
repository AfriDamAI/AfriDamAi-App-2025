import { type NextRequest, NextResponse } from "next/server"

/** * 🛡️ OGA FIX: Final Path Sync
 * This path matches the physical filename in your lib folder: skin-analysis-services.ts
 * Standardizing to absolute alias (@/) to prevent Vercel build ghosts.
 */
import { performSkinAnalysis } from "@/lib/skin-analysis-services"

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
     * Handshake with the hybrid scanner logic
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