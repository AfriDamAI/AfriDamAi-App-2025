"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

interface CameraUploadProps {
  onImageCapture: (imageData: string) => void
  onScanTypeSelected?: (type: "skin" | "ingredient") => void
}

export default function CameraUpload({ onImageCapture, onScanTypeSelected }: CameraUploadProps) {
  const [mode, setMode] = useState<"select" | "video" | "preview">("select")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const initializeVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      mediaStreamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setMode("video")
    } catch (error) {
      console.error("[v0] Error accessing camera:", error)
      alert("Unable to access camera. Please check permissions.")
    }
  }

  const startRecording = () => {
    if (!mediaStreamRef.current) return

    chunksRef.current = []
    const mediaRecorder = new MediaRecorder(mediaStreamRef.current)

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "video/webm" })
      extractFrameFromVideo(blob)
    }

    mediaRecorderRef.current = mediaRecorder
    mediaRecorder.start()
    setIsRecording(true)
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const extractFrameFromVideo = (videoBlob: Blob) => {
    const videoUrl = URL.createObjectURL(videoBlob)
    const tempVideo = document.createElement("video")
    tempVideo.src = videoUrl
    tempVideo.crossOrigin = "anonymous"
    tempVideo.preload = "metadata"

    let frameExtracted = false

    const extractFrame = () => {
      if (frameExtracted) return
      frameExtracted = true

      if (canvasRef.current) {
        const context = canvasRef.current.getContext("2d")
        if (context && tempVideo.videoWidth > 0 && tempVideo.videoHeight > 0) {
          canvasRef.current.width = tempVideo.videoWidth
          canvasRef.current.height = tempVideo.videoHeight
          context.drawImage(tempVideo, 0, 0)
          const imageData = canvasRef.current.toDataURL("image/jpeg")
          setCapturedImage(imageData)
          onImageCapture(imageData)
          setMode("preview")
        }
      }
      URL.revokeObjectURL(videoUrl)
    }

    tempVideo.onloadedmetadata = () => {
      const duration = tempVideo.duration
      console.log("[v0] Video duration:", duration)

      if (isFinite(duration) && duration > 0) {
        // Seek to middle of video for best frame
        tempVideo.currentTime = duration / 2
      } else {
        // If duration is invalid, try seeking to a small offset
        console.warn("[v0] Invalid duration, seeking to 0.5s")
        tempVideo.currentTime = 0.5
      }
    }

    tempVideo.onseeked = () => {
      console.log("[v0] Video seeked, extracting frame")
      extractFrame()
    }

    // Fallback: if seeking doesn't trigger onseeked, extract after a delay
    tempVideo.oncanplay = () => {
      if (!frameExtracted) {
        console.log("[v0] Video can play, scheduling frame extraction")
        setTimeout(() => {
          if (!frameExtracted) {
            console.log("[v0] Extracting frame via timeout")
            extractFrame()
          }
        }, 500)
      }
    }

    tempVideo.onerror = () => {
      console.error("[v0] Error loading video")
      alert("Error processing video. Please try again.")
      URL.revokeObjectURL(videoUrl)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith("video/")) {
        extractFrameFromVideo(file)
      } else {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = e.target?.result as string
          setCapturedImage(imageData)
          onImageCapture(imageData)
          setMode("preview")
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleReset = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
    setCapturedImage(null)
    setMode("select")
    setIsRecording(false)
  }

  const handleAnalyzeSkin = () => {
    onScanTypeSelected?.("skin")
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      {mode === "select" && (
        <Card className="p-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">Choose Input Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={initializeVideo}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white h-24 text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Record Video
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                variant="outline"
                className="h-24 text-lg"
              >
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Video/Image
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      )}

      {/* Video Recording */}
      {mode === "video" && (
        <Card className="p-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">Record Skin Video</h2>
            <p className="text-sm text-muted-foreground">
              {isRecording
                ? "Recording... Position your skin in the frame for best results"
                : "Click 'Start Recording' and position your skin in the frame"}
            </p>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-gray-900 aspect-video object-cover"
            />
            <div className="flex gap-4">
              {!isRecording ? (
                <>
                  <Button onClick={startRecording} size="lg" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                    Start Recording
                  </Button>
                  <Button onClick={handleReset} size="lg" variant="outline" className="flex-1 bg-transparent">
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={stopRecording} size="lg" className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="12" height="16" rx="1" />
                    </svg>
                    Stop Recording
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Preview */}
      {mode === "preview" && capturedImage && (
        <Card className="p-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">Frame Preview</h2>
            <Image
              src={capturedImage || "/placeholder.svg"}
              alt="Captured skin frame"
              className="w-full rounded-lg max-h-96 object-cover"
            />
            <div className="flex gap-4">
              <Link href="/results" className="flex-1" onClick={handleAnalyzeSkin}>
                <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Analyze Skin
                </Button>
              </Link>
              <Button onClick={handleReset} size="lg" variant="outline" className="flex-1 bg-transparent">
                Retake Video
              </Button>
            </div>
          </div>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
