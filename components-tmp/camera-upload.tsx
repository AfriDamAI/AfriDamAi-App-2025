"use client"

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { 
  Camera, 
  RefreshCcw, 
  CheckCircle, 
  X, 
  Upload, 
  Zap, 
  FlipHorizontal,
  ChevronLeft
} from 'lucide-react'
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface CameraUploadProps {
  onImageCapture: (imageData: string) => void;
  onScanTypeSelected?: (type: "skin" | "ingredient") => void;
}

export default function CameraUpload({ onImageCapture, onScanTypeSelected }: CameraUploadProps) {
  const [mode, setMode] = useState<"select" | "camera" | "preview">("select");
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
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

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user");
    setIsLoading(true);
  };

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const setupStream = async () => {
      if (mode === "camera") {
        try {
          // Stop any existing tracks before switching
          if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(t => t.stop());
          }

          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 }
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
          console.error("Camera Access Denied:", err);
          setError("Permissions Denied. Please enable camera access in App Settings.");
          setIsLoading(false);
        }
      }
    };

    setupStream();

    return () => {
      if (activeStream) activeStream.getTracks().forEach((track) => track.stop());
    };
  }, [mode, facingMode]);

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const width = video.videoWidth;
      const height = video.videoHeight;

      if (context && width && height) {
        canvas.width = width;
        canvas.height = height;

        // Only mirror if using front camera
        if (facingMode === "user") {
          context.translate(width, 0);
          context.scale(-1, 1);
        }

        context.drawImage(video, 0, 0, width, height);
        const imageData = canvas.toDataURL("image/jpeg", 0.9);
        setCapturedImage(imageData);
        onImageCapture(imageData);
        setMode("preview");
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result as string;
        setCapturedImage(data);
        onImageCapture(data);
        setMode("preview");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        
        {/* 1. SELECTION MODE */}
        {mode === "select" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Card className="p-10 bg-[#1C1A19] border-white/5 rounded-[3rem] shadow-2xl">
              <div className="space-y-10 text-center">
                <div className="space-y-2">
                  <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.4em]">Clinical Input</span>
                  <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Capture Sample</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button
                    onClick={startCameraMode}
                    className="h-48 rounded-[2rem] bg-white text-black font-black uppercase text-[11px] tracking-widest flex flex-col items-center justify-center gap-4 hover:bg-[#E1784F] hover:text-white transition-all group"
                  >
                    <div className="p-4 bg-black/5 rounded-2xl group-hover:bg-white/20 transition-colors">
                      <Camera size={32} />
                    </div>
                    Open Neural Cam
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-48 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black uppercase text-[11px] tracking-widest flex flex-col items-center justify-center gap-4 hover:border-[#E1784F]/50 transition-all group"
                  >
                    <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-[#E1784F]/20 transition-colors">
                      <Upload size={32} />
                    </div>
                    Upload from Gallery
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* 2. CAMERA MODE */}
        {mode === "camera" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="bg-black border-white/10 rounded-[3rem] overflow-hidden relative">
              <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-center">
                 <button onClick={() => setMode("select")} className="p-4 bg-black/40 backdrop-blur-md rounded-2xl text-white">
                    <ChevronLeft size={24} />
                 </button>
                 <button onClick={toggleCamera} className="p-4 bg-white text-black rounded-2xl shadow-xl">
                    <FlipHorizontal size={24} />
                 </button>
              </div>

              <div className="relative aspect-[3/4] md:aspect-video bg-neutral-900">
                {isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white space-y-4">
                    <RefreshCcw className="animate-spin text-[#E1784F]" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Waking Neural Sensors...</p>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${facingMode === "user" ? 'scale-x-[-1]' : ''}`}
                />

                {/* Clinical Crosshair Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <div className="w-64 h-64 border-2 border-[#E1784F]/40 rounded-full border-dashed animate-[spin_10s_linear_infinite]" />
                   <div className="absolute w-full h-[1px] bg-[#E1784F]/20" />
                   <div className="absolute h-full w-[1px] bg-[#E1784F]/20" />
                </div>
              </div>

              <div className="p-10 bg-[#1C1A19]">
                <button
                  onClick={capturePhoto}
                  disabled={isLoading}
                  className="w-full h-20 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-2xl flex items-center justify-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  Analyze Dermal Area
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 3. PREVIEW MODE */}
        {mode === "preview" && capturedImage && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="p-10 bg-[#1C1A19] border-white/5 rounded-[3.5rem] space-y-10">
              <div className="space-y-2">
                <span className="text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.4em]">Audit Pending</span>
                <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter">Confirm Image</h2>
              </div>

              <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-inner">
                <Image src={capturedImage} alt="Preview" fill className="object-cover" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleAnalyzeSkin}
                  className="h-20 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-xl active:scale-95"
                >
                  <Zap size={18} fill="white" /> Run Full Scan
                </button>
                <button
                  onClick={handleRetake}
                  className="h-20 bg-white/5 text-white/40 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 hover:text-white transition-all"
                >
                  <RefreshCcw size={18} /> Retake Sample
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}