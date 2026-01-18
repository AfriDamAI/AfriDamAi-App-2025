/**
 * 🛡️ AFRIDAM INGREDIENT CHECKER
 * Version: 2026.1.2 (Sleek Mobile-First Refactor)
 * Handshake: Fully synced with archived api-client.ts
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, ChevronLeft, Activity, CheckCircle2, Zap, Camera,
  RotateCcw, AlertTriangle, Upload, Baby, Info, ShoppingBag
} from "lucide-react"
import { analyzeIngredients } from "@/lib/api-client"

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [manualText, setManualText] = useState("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [status, setStatus] = useState("Ready");

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    setStatus("Opening Lens");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: 500, height: 500 } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setIsCapturing(false);
      setStatus("Camera Error");
    }
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      setImgSource(canvas.toDataURL("image/jpeg", 0.8));
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      setIsCapturing(false);
      setStatus("Label Captured");
    }
  };

  const handleAnalyze = async () => {
    const input = imgSource || manualText;
    if (!input) return;

    setIsAnalyzing(true);
    setStatus("Analyzing...");

    try {
      // 🛡️ REFERENCE: Using archived api-client.ts
      const data = await analyzeIngredients(input);
      
      // Robust mapping to catch Tobi's backend data
      const payload = data?.resultData || data;
      
      setResults({
        riskLevel: payload?.riskLevel || "Balanced",
        safetyScore: payload?.safetyScore || 100,
        isChildSafe: payload?.isChildSafe ?? true,
        summary: payload?.description || "This product appears safe for regular use."
      });

      setStatus("Complete");
    } catch (err) {
      setStatus("Connection Error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <main className="min-h-[100svh] bg-white px-6 py-8 relative">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* HEADER */}
        <header className="flex items-center justify-between">
          <button onClick={() => router.push('/dashboard')} className="p-2 text-gray-400"><ChevronLeft /></button>
          <div className="text-center">
             <h1 className="text-xl font-black uppercase tracking-widest italic">Safety <span className="text-[#E1784F]">Check</span></h1>
             <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em]">{status}</p>
          </div>
          <div className="w-8" />
        </header>

        {!results ? (
          <div className="space-y-6">
            
            {/* MANUAL ENTRY - Shrunk for Mobile */}
            <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-300 uppercase tracking-widest px-2">Paste Ingredients</label>
              <textarea 
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Aqua, Glycerin..."
                className="w-full h-24 p-5 bg-gray-50 border border-gray-100 rounded-2xl text-xs focus:ring-1 focus:ring-[#E1784F] outline-none transition-all resize-none"
              />
            </div>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="mx-4 text-[7px] font-black text-gray-200 uppercase tracking-widest">Or Use Camera</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* AI LENS - Compact Square */}
            <div className="relative aspect-square w-full max-w-[280px] mx-auto overflow-hidden rounded-[2.5rem] border-[6px] border-gray-50 shadow-2xl bg-gray-50">
              <AnimatePresence mode="wait">
                {isCapturing ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : imgSource ? (
                  <div className="relative w-full h-full">
                    <img src={imgSource} className={`w-full h-full object-cover transition-all duration-700 ${isAnalyzing ? 'blur-md grayscale' : ''}`} alt="Label" />
                    {isAnalyzing && (
                       <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                          <motion.div 
                            animate={{ top: ["0%", "100%", "0%"] }} 
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute left-0 right-0 h-1 bg-[#4DB6AC] shadow-[0_0_15px_#4DB6AC] z-50"
                          />
                          <Loader2 className="animate-spin text-white w-8 h-8" />
                       </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-200 gap-4">
                    <Camera size={32} strokeWidth={1} />
                    <button onClick={startCamera} className="text-[8px] font-black uppercase tracking-widest bg-white px-4 py-2 rounded-full text-gray-400 border border-gray-100">Open Lens</button>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* ACTIONS */}
            <div className="grid gap-3 pt-4">
              {isCapturing ? (
                <button onClick={capture} className="w-16 h-16 mx-auto rounded-full border-4 border-[#E1784F] bg-white flex items-center justify-center shadow-xl">
                  <div className="w-10 h-10 rounded-full bg-[#E1784F]" />
                </button>
              ) : (imgSource || manualText) && !isAnalyzing ? (
                <button onClick={handleAnalyze} className="w-full py-5 bg-[#1A1A1A] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-xl">
                  Analyze Safety <Zap size={14} fill="currentColor" />
                </button>
              ) : !isAnalyzing && (
                <button onClick={() => fileInputRef.current?.click()} className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Upload size={12} /> Upload Photo
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if(file) {
                  const reader = new FileReader();
                  reader.onloadend = () => setImgSource(reader.result as string);
                  reader.readAsDataURL(file);
                }
              }} />
            </div>
          </div>
        ) : (
          /* RESULTS VIEW - Soft & Standard */
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className="p-8 bg-gray-50 rounded-[3rem] text-center border border-gray-100 shadow-sm">
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${results.safetyScore < 70 ? 'bg-red-50 text-red-500' : 'bg-[#4DB6AC]/10 text-[#4DB6AC]'}`}>
                   {results.safetyScore < 70 ? <AlertTriangle size={28} /> : <CheckCircle2 size={28} />}
                </div>
                <h2 className="text-xl font-black italic uppercase tracking-tighter">Family Safety Score</h2>
              </div>

              {results.isChildSafe && (
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full text-[#4DB6AC] border border-[#4DB6AC]/10 mb-6">
                   <Baby size={14} />
                   <span className="text-[8px] font-black uppercase tracking-widest">Safe for Children</span>
                </div>
              )}

              <div className="mb-8">
                <p className="text-[4rem] font-black text-gray-900 leading-none tracking-tighter">{results.safetyScore}<span className="text-xs opacity-20 ml-1">/100</span></p>
                <p className="text-[9px] font-bold text-gray-400 mt-2 uppercase tracking-widest italic">{results.summary}</p>
              </div>

              <button onClick={() => router.push('/marketplace')} className="w-full py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-2">
                 SHOP SAFE CARE <ShoppingBag size={14} />
              </button>
            </div>
            
            <button onClick={() => {setResults(null); setImgSource(null); setManualText("");}} className="w-full text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                <RotateCcw size={12} /> New Analysis
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}