"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import CameraUpload from "@/components/camera-upload"
import { useAuth } from "@/providers/auth-provider"
import { Button } from "@/components/ui/button"

export default function ScanPage() {
  const [imageData, setImageData] = useState<string | null>(null)
  const router = useRouter();

  const handleScanTypeSelected = (type: "skin" | "ingredient") => {
    if (imageData) {
      sessionStorage.setItem("scanType", type)
      sessionStorage.setItem("scanImage", imageData)
      router.push("/results")
    }
  }

  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access the skin scanner</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Skin Assessment</h1>
          <p className="text-lg text-muted-foreground">
            Take or upload a skin photo so our AI can analyze potential concerns and provide insights.
          </p>
        </div>
        <CameraUpload onImageCapture={setImageData} onScanTypeSelected={handleScanTypeSelected} />
      </div>
    </main>
  )
}
