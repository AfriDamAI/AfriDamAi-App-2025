import { type NextRequest, NextResponse } from "next/server"
/** * 🛡️ OGA FIX: We use the verified apiClient to ensure 
 * the Auth Token is attached when forwarding to Tobi's backend.
 */
import { apiClient } from "@/lib/api-client"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // 🛡️ RE-ENFORCED: Validation for Aesthetic Quality
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image (JPEG/PNG)" }, { status: 400 })
    }

    // Validate file size (10MB limit is perfect for high-res skin texture)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "Image too large. Max 10MB allowed." }, { status: 400 })
    }

    /**
     * 🚀 OGA FIX: THE NEURAL HANDSHAKE
     * Instead of just returning a success message, we now forward 
     * this file to Tobi's new AI Service node.
     */
    const backendFormData = new FormData()
    backendFormData.append("file", file)

    // We call the new AI endpoint Tobi created on the main branch
    const backendResponse = await apiClient.post("/ai/upload", backendFormData, {
      headers: { "Content-Type": "multipart/form-data" }
    })

    // 🛡️ RE-ENFORCED: Generate fallback ID if backend doesn't provide one
    const imageId = backendResponse.data?.id || `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    return NextResponse.json(
      {
        success: true,
        imageId,
        imageUrl: backendResponse.data?.url || null, // The Cloud Storage URL from Tobi
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (_err: any) {
    console.error("Aesthetic Upload Sync Error:", _err)
    
    // 🛡️ RE-ENFORCED: Standardizing error for the Scanner UI
    return NextResponse.json(
      { error: "Image synchronization failed. Node may be offline." }, 
      { status: 500 }
    )
  }
}