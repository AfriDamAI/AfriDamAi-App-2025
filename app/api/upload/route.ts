import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    // Convert file to base64 for storage
    const buffer = await file.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    // Generate unique ID for the image
    const imageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // In a real app, you would store this in a database or cloud storage
    // For now, we'll return the base64 data and ID
    return NextResponse.json(
      {
        success: true,
        imageId,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
