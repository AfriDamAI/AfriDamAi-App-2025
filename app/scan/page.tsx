"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import CameraUpload from "@/components/camera-upload"

export default function ScanPage() {
  const [imageData, setImageData] = useState<string | null>(null)
  const router = useRouter()

  const handleScanTypeSelected = (type: "skin" | "ingredient") => {
    if (imageData) {
      sessionStorage.setItem("scanType", type)
      sessionStorage.setItem("scanImage", imageData)
      router.push("/results")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Skin Scan</h1>
          <p className="text-lg text-muted-foreground">
            Record a video or upload a video/image of your skin for AI analysis
          </p>
        </div>
        <CameraUpload onImageCapture={setImageData} onScanTypeSelected={handleScanTypeSelected} />
      </div>
    </main>
  )
}
