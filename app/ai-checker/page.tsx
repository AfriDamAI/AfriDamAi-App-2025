/**
 * 🛡️ AFRIDAM INGREDIENT CHECKER
 * Version: 2026.1.1 (Hybrid Text & Photo Scan)
 * Focus: Helping mothers find safe skincare for their families.
 */

"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Loader2, 
  ChevronLeft,
  Activity,
  CheckCircle2,
  Zap,
  Camera,
  RotateCcw,
  AlertTriangle,
  Search,
  Upload,
  Baby,
  Info
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
  const [status, setStatus] = useState("Ready for Check");

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    setStatus("Starting camera...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("Camera is On");
    } catch (err) {
      setIsCapturing(false);
      setStatus("Camera Offline");
    }
  };

  const capture = () => {
    const canvas = document.createElement("canvas");
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      setImgSource(canvas.toDataURL("image/jpeg"));
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      setIsCapturing(false);
      setStatus("Photo Ready");
    }
  };

  const handleAnalyze = async () => {
    // Check if we have an image OR text to analyze
    const input = imgSource || manualText;
    if (!input) return;

    setIsAnalyzing(true);
    setStatus("Checking safety scores...");

    try {
      // 🚀 THE HANDSHAKE: Works for both manual text and image blobs
      const data = await analyzeIngredients(input);
      const payload = data.resultData || data;
      
      setResults({
        riskLevel: payload.riskLevel || "CHECK COMPLETE",
        safetyScore: payload.safetyScore || 100,
        flagged: payload.ingredients?.filter((ing: any) => ing.safety !== 'safe') || [],
        isChildSafe: payload.isChildSafe ?? true
      });

      setStatus("Analysis Finished");
    } catch (err) {
      setStatus("Check Failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading || !user) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#E1784F] gap-4">
       <Loader2 className="animate-spin w-10 h-10" />
       <p className="font-bold uppercase text-[10px] tracking-widest">Opening Safety Hub...</p>
    </div>
  );

  return (
    <main className="min-h-[100svh] bg-white text-foreground px-5 py-10 overflow-x-hidden relative">
      <div className="max-w-xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER */}
        <header className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-[#E1784F] active:scale-95 transition-all shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div className="text-left">
             <h1 className="text-3xl font-bold tracking-tight text-gray-900">
               Safety <span className="text-[#E1784F]">Check</span>
             </h1>
             <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status}</p>
          </div>
        </header>

        {!results ? (
          <div className="flex flex-col gap-8">
            
            {/* 📝 OPTION 1: MANUAL TEXT ENTRY */}
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">Paste Ingredient List</label>
              <textarea 
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="e.g. Aqua, Glycerin, Shea Butter..."
                className="w-full h-32 p-6 bg-gray-50 border border-gray-100 rounded-[2rem] text-sm focus:ring-2 focus:ring-[#E1784F]/20 outline-none transition-all resize-none"
              />
            </div>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[9px] font-bold text-gray-300 uppercase">OR SCAN LABEL</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* 📸 OPTION 2: CAMERA SECTION */}
            <div className="relative w-full aspect-[4/5] bg-gray-50 rounded-[3rem] border-4 border-white overflow-hidden shadow-lg group">
              <AnimatePresence mode="wait">
                {isCapturing ? (
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                ) : imgSource ? (
                  <img src={imgSource} className="w-full h-full object-cover" alt="Captured Label" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                      <Camera className="text-[#E1784F] w-8 h-8 opacity-30" />
                    </div>
                    <button onClick={startCamera} className="h-14 bg-white text-[#E1784F] border border-[#E1784F]/20 font-bold px-8 rounded-2xl tracking-widest text-[10px] uppercase shadow-sm">
                      Open AI Lens
                    </button>
                  </div>
                )}
              </AnimatePresence>

              {/* 🛡️ SCANNING LASER */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/60 z-50 flex flex-col items-center justify-center">
                   <motion.div 
                    initial={{ top: "0%" }} 
                    animate={{ top: "100%" }} 
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-1 bg-[#4DB6AC] shadow-[0_0_20px_#4DB6AC] z-40"
                  />
                  <Loader2 className="animate-spin text-white w-12 h-12 mb-4" />
                  <p className="text-white font-bold text-[10px] uppercase tracking-widest animate-pulse">Analyzing Ingredients...</p>
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3">
              {isCapturing ? (
                <button onClick={capture} className="w-20 h-20 mx-auto rounded-full border-4 border-[#E1784F] bg-white flex items-center justify-center active:scale-90 transition-all shadow-lg">
                  <div className="w-14 h-14 rounded-full bg-[#E1784F]" />
                </button>
              ) : (imgSource || manualText) && !isAnalyzing ? (
                <>
                  <button onClick={handleAnalyze} className="w-full h-16 bg-[#1A1A1A] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2 active:scale-95 shadow-lg">
                    Start Safety Check <Zap size={16} />
                  </button>
                  <button onClick={() => { setImgSource(null); setManualText(""); }} className="w-full h-16 bg-white text-gray-400 border border-gray-100 rounded-2xl font-bold uppercase text-[11px] tracking-widest">Clear Input</button>
                </>
              ) : !isAnalyzing && (
                <button onClick={() => fileInputRef.current?.click()} className="w-full h-16 bg-white text-gray-500 border border-gray-200 rounded-2xl font-bold uppercase text-[11px] tracking-widest flex items-center justify-center gap-2">
                    <Upload size={14} /> Upload from Phone
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
          /* RESULTS VIEW */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 pb-20">
            <div className="p-8 bg-white border border-gray-100 rounded-[3rem] shadow-sm text-center relative overflow-hidden">
              <div className="flex flex-col items-center gap-4 mb-8">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-sm ${results.safetyScore < 70 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                   {results.safetyScore < 70 ? <AlertTriangle size={36} /> : <CheckCircle2 size={36} />}
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Analysis Done</h2>
              </div>

              {results.isChildSafe && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-100 p-4 rounded-2xl text-green-700 mb-6 justify-center">
                   <Baby size={18} />
                   <span className="text-[10px] font-bold uppercase tracking-widest">Safe for your Baby</span>
                </div>
              )}

              <div className="p-6 bg-gray-50 rounded-3xl mb-8">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E1784F] mb-2">Safety Score</p>
                <div className="text-5xl font-bold text-gray-900 leading-tight">{results.safetyScore}<span className="text-sm">/100</span></div>
              </div>

              <div className="p-5 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3 items-start mb-8 text-left">
                 <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                 <p className="text-[10px] font-medium text-blue-800 leading-relaxed uppercase tracking-tight">
                   Disclaimer: This check is for wellness purposes. It is not a medical diagnosis.
                 </p>
              </div>

              <button onClick={() => router.push('/marketplace')} className="w-full h-16 bg-[#E1784F] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-md flex items-center justify-center gap-2">
                 SHOP SAFE CARE <ShoppingBag size={16} />
              </button>
            </div>
            
            <button onClick={() => setResults(null)} className="w-full h-16 bg-white border border-gray-200 rounded-2xl font-bold uppercase text-[11px] tracking-widest text-gray-400">
                NEW SCAN
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}