/**
 * 🛡️ AFRIDAM NEURAL LENS: CAMERA & UPLOAD
 * Version: 2026.1.3 (World-Class Clinical Refactor)
 * Focus: High-Precision Feedback, Mobile-First, Theme-Adaptive.
 */

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
  ChevronLeft,
  Scan,
  ShieldCheck
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
          setError("Permissions Denied. Please enable camera access.");
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
    <div className="w-full max-w-2xl mx-auto px-4 md:px-0">
      <AnimatePresence mode="wait">
        
        {/* 1. SELECTION MODE */}
        {mode === "select" && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="p-10 bg-white dark:bg-[#0A0A0A] border-gray-100 dark:border-white/5 rounded-[4rem] shadow-2xl relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/5 blur-3xl rounded-full" />
              
              <div className="space-y-12 text-center relative z-10">
                <div className="space-y-4">
                  <span className="text-[#E1784F] text-[10px] font-black uppercase tracking-[0.6em]">Diagnostic Input</span>
                  <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">Capture <br /> <span className="text-[#4DB6AC]">Sample</span></h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button
                    onClick={startCameraMode}
                    className="h-56 rounded-[3rem] bg-black dark:bg-white text-white dark:text-black font-black uppercase text-[12px] tracking-[0.3em] flex flex-col items-center justify-center gap-6 shadow-2xl transition-all hover:bg-[#E1784F] hover:text-white group active:scale-95"
                  >
                    <div className="w-16 h-16 bg-white/10 dark:bg-black/5 rounded-2xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Camera size={32} strokeWidth={1.5} />
                    </div>
                    Open Neural Cam
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-56 rounded-[3rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 text-black dark:text-white font-black uppercase text-[12px] tracking-[0.3em] flex flex-col items-center justify-center gap-6 transition-all hover:border-[#E1784F] group active:scale-95"
                  >
                    <div className="w-16 h-16 bg-black/5 dark:bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#E1784F]/10 transition-colors">
                      <Upload size={32} strokeWidth={1.5} />
                    </div>
                    Cloud Gallery
                  </button>
                </div>
                
                <div className="flex items-center justify-center gap-3 opacity-30 pt-4">
                  <ShieldCheck size={14} className="text-[#4DB6AC]" />
                  <p className="text-[9px] font-black uppercase tracking-widest">Secure AES-256 Upload Node</p>
                </div>
                
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </div>
            </Card>
          </motion.div>
        )}

        {/* 2. CAMERA MODE */}
        {mode === "camera" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[600] md:relative md:z-auto">
            <Card className="h-full md:h-auto bg-black border-none md:border-white/10 md:rounded-[4rem] overflow-hidden relative flex flex-col">
              
              {/* TOP UI */}
              <div className="absolute top-10 md:top-8 left-8 right-8 z-50 flex justify-between items-center">
                 <button onClick={() => setMode("select")} className="p-5 bg-black/50 backdrop-blur-3xl rounded-3xl text-white border border-white/10">
                    <ChevronLeft size={28} />
                 </button>
                 <button onClick={toggleCamera} className="p-5 bg-white text-black rounded-3xl shadow-2xl active:rotate-180 transition-transform duration-500">
                    <FlipHorizontal size={28} />
                 </button>
              </div>

              {/* LENS PORTAL */}
              <div className="relative flex-1 md:aspect-[3/4] bg-[#0A0A0A] overflow-hidden">
                {isLoading && (
                  <div className="absolute inset-0 z-40 flex flex-col items-center justify-center text-white space-y-6">
                    <Loader2 className="animate-spin text-[#E1784F]" size={60} strokeWidth={3} />
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-[#E1784F]">Initializing Neural Sensors</p>
                  </div>
                )}
                
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'} ${facingMode === "user" ? 'scale-x-[-1]' : ''}`}
                />

                {/* Clinical Crosshair Overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                   <div className="w-80 h-80 border-[3px] border-[#E1784F]/30 rounded-[4rem] border-dashed animate-[spin_15s_linear_infinite]" />
                   <div className="absolute w-[20%] h-[1px] bg-[#E1784F]/60" />
                   <div className="absolute h-[20%] w-[1px] bg-[#E1784F]/60" />
                </div>
              </div>

              {/* ACTION FOOTER */}
              <div className="p-10 md:p-12 bg-black border-t border-white/5">
                <button
                  onClick={capturePhoto}
                  disabled={isLoading}
                  className="w-full h-24 bg-[#E1784F] text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] shadow-[0_30px_60px_rgba(225,120,79,0.3)] flex items-center justify-center gap-6 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <Scan size={24} className="animate-pulse" />
                  Lock Target & Scan
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* 3. PREVIEW MODE */}
        {mode === "preview" && capturedImage && (
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <Card className="p-10 bg-white dark:bg-[#0A0A0A] border-gray-100 dark:border-white/5 rounded-[4rem] space-y-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DB6AC]/5 blur-3xl rounded-full" />
              
              <div className="space-y-4">
                <span className="text-[#4DB6AC] text-[10px] font-black uppercase tracking-[0.6em]">Sample Verified</span>
                <h2 className="text-5xl md:text-7xl font-black italic uppercase text-black dark:text-white tracking-tighter leading-none">Confirm <br /> <span className="text-[#4DB6AC]">Data</span></h2>
              </div>

              <div className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden border-[10px] border-white dark:border-[#1A1A1A] shadow-2xl">
                <Image src={capturedImage} alt="Preview" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <button
                  onClick={() => { /* Handled by parent */ }}
                  className="h-24 bg-black dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl transition-all hover:bg-[#E1784F] hover:text-white active:scale-95"
                >
                  <Zap size={20} fill="currentColor" /> Run Neural Scan
                </button>
                <button
                  onClick={() => { setCapturedImage(null); setMode("camera"); }}
                  className="h-24 bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:text-[#E1784F] transition-all border border-gray-100 dark:border-white/10"
                >
                  <RefreshCcw size={20} /> Re-Sample
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