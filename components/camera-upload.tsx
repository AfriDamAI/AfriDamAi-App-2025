import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Camera, Upload, RefreshCcw, Image as ImageIcon, CheckCircle, X } from "lucide-react";

interface CameraUploadProps {
  onImageCapture: (imageData: string) => void;
  onScanTypeSelected?: (type: "skin" | "ingredient") => void;
}

export default function CameraUpload({ onImageCapture, onScanTypeSelected }: CameraUploadProps) {
  const [mode, setMode] = useState<"select" | "camera" | "preview">("select");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const startCameraMode = () => {
    setError(null);
    setMode("camera");
    setIsLoading(true);
  };

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const setupStream = async () => {
      if (mode === "camera" && videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: "user",
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
          });

          activeStream = stream;
          mediaStreamRef.current = stream;

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              setIsLoading(false);
              videoRef.current?.play().catch(e => console.error("Play error:", e));
            };
          }
        } catch (err) {
          console.error("Error accessing camera:", err);
          setError("Unable to access camera. Please check permissions or try a different browser.");
          setIsLoading(false);
        }
      }
    };

    if (mode === "camera") {
      setupStream();
    }


    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [mode]);

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (video.readyState !== video.HAVE_ENOUGH_DATA) {
        alert("Camera is still loading, please wait...");
        return;
      }

      const width = video.videoWidth;
      const height = video.videoHeight;

      if (width === 0 || height === 0) return;

      if (context) {
        canvas.width = width;
        canvas.height = height;
        // Flip horizontally if using user-facing camera for natural mirror effect
        context.translate(width, 0);
        context.scale(-1, 1);
        context.drawImage(video, 0, 0, width, height);

        context.setTransform(1, 0, 0, 1, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg", 0.95);
        setCapturedImage(imageData);
        onImageCapture(imageData);

        stopStream();
        setMode("preview");
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setCapturedImage(imageData);
        onImageCapture(imageData);
        setMode("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  const stopStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleReset = () => {
    stopStream();
    setCapturedImage(null);
    setMode("select");
    setError(null);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCameraMode();
  };

  const handleAnalyzeSkin = () => {
    onScanTypeSelected?.("skin");
  };

  return (
    <div className="w-full">
      {/* Mode Selection */}
      {mode === "select" && (
        <Card className="p-8">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Choose Input Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button
                onClick={startCameraMode}
                className="h-32 text-lg flex flex-col gap-3 bg-orange-600 hover:bg-orange-700 transition-all shadow-md hover:shadow-lg"
              >
                <Camera className="w-8 h-8" />
                <span>Take Photo</span>
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="h-32 text-lg flex flex-col gap-3 hover:bg-gray-50 transition-all border-dashed border-2"
              >
                <Upload className="w-8 h-8" />
                <span>Upload Image</span>
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </Card>
      )}

      {/* Camera View */}
      {mode === "camera" && (
        <Card className="p-6 relative overflow-hidden">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Take Skin Photo</h2>
              <button onClick={handleReset} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p>Initializing Camera...</p>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400 z-10 p-4 text-center bg-gray-900">
                  <p className="mb-4">{error}</p>
                  <Button onClick={startCameraMode} size="sm" variant="outline" className="border-red-400 text-red-400 hover:bg-red-900/20">Try Again</Button>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              />

              {/* Overlay guidelines */}
              {!isLoading && !error && (
                <div className="absolute inset-0 pointer-events-none border-2 border-white/20 m-8 rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-500 -mt-1 -ml-1 rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-orange-500 -mt-1 -mr-1 rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-orange-500 -mb-1 -ml-1 rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500 -mb-1 -mr-1 rounded-br-lg"></div>
                </div>
              )}
            </div>

            <div className="flex gap-4 mt-2">
              <Button
                onClick={capturePhoto}
                size="lg"
                disabled={isLoading || !!error}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-12 text-lg shadow-md"
              >
                <div className="w-4 h-4 rounded-full bg-white mr-2 animate-pulse"></div>
                Capture
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Preview View */}
      {mode === "preview" && capturedImage && (
        <Card className="p-6">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-gray-900">Review Photo</h2>

            <div className="w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
              <img
                src={capturedImage}
                alt="Captured skin"
                className="w-full max-h-[500px] object-contain mx-auto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleAnalyzeSkin}
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white shadow-md group"
              >
                <CheckCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Analyze Skin
              </Button>
              <Button onClick={handleRetake} size="lg" variant="outline" className="text-gray-600">
                <RefreshCcw className="w-5 h-5 mr-2" />
                Retake
              </Button>
            </div>

            <Button onClick={handleReset} variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
              Start Over
            </Button>
          </div>
        </Card>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}