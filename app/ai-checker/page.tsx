/**
 * 🛡️ AFRIDAM INGREDIENT CHECKER
 * Focus: Helping mothers find safe skincare for themselves and their children.
 * Simple, Relatable, and Professional.
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
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Baby,
  Upload,
  Heart
} from "lucide-react"
import { analyzeIngredients } from "@/lib/api-client"

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [status, setStatus] = useState("Ready to check ingredients");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    setErrorDetails(null);
    setStatus("Starting camera...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStatus("Camera is On");
    } catch (err) {
      setIsCapturing(false);
      setErrorDetails("Could not open camera. Please check your phone settings.");
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
      setStatus("Photo Saved");
    }
  };

  const handleAnalyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true);
    setStatus("Checking ingredients...");

    try {
      // 🚀 OGA FIX: Integrated with your api-client.ts
      // We pass the string for OCR analysis or the backend handles the image
      const data = await analyzeIngredients(imgSource);
      const payload = data.resultData || data;
      
      setResults({
        riskLevel: payload.riskLevel || "CHECK COMPLETE",
        safetyScore: payload.safetyScore || 100,
        flagged: payload.ingredients?.filter((ing: any) => ing.safety !== 'safe') || [],
        isChildSafe: payload.isChildSafe ?? true
      });

      setStatus("Analysis Finished");
    } catch (err) {
      setErrorDetails("Could not read text. Please try again with a clearer photo.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading || !user) return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-[#E1784F] gap-4">
       <Loader2 className="animate-spin w-10 h-10" />
       <p className="font-bold uppercase text-[10px] tracking-widest">Opening Hub...</p>
    </div>
  );

  return (
    <main className="min-h-[100svh] bg-[#FAFAFA] text-[#1A1A1A] px-5 py-8 md:p-12 overflow-x-hidden relative">
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* SIMPLE HEADER */}
        <header className="flex items-center gap-4">
          <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#E1784F] active:scale-95 transition-all shadow-sm">
            <ChevronLeft size={20} />
          </button>
          <div>
             <h1 className="text-3xl font-bold tracking-tight text-[#1A1A1A]">
               Ingredient <span className="text-[#E1784F]">Check</span>
             </h1>
             <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{status}</span>
             </div>
          </div>
        </header>

        <div className="flex flex-col gap-8">
          
          {/* CAMERA SECTION (MOBILE FIRST) */}
          <div className="relative w-full aspect-[4/5] bg-gray-100 rounded-[2.5rem] border-4 border-white overflow-hidden shadow-lg group">
            <AnimatePresence mode="wait">
              {isCapturing ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-[#E1784F]/30 rounded-3xl relative">
                       <motion.div animate={{ top: ["0%", "100%", "0%"] }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }} className="absolute left-0 right-0 h-0.5 bg-[#E1784F]" />
                    </div>
                  </div>
                  <button onClick={capture} className="absolute bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white bg-[#E1784F] shadow-xl active:scale-90" />
                </div>
              ) : imgSource ? (
                <div className="relative w-full h-full">
                  <img src={imgSource} className="w-full h-full object-cover" alt="Product Label" />
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm">
                    <Camera className="text-[#E1784F] w-8 h-8" />
                  </div>
                  <button onClick={startCamera} className="h-16 bg-[#E1784F] text-white font-bold px-10 rounded-2xl tracking-widest text-[11px] uppercase shadow-md active:scale-95">
                    Start AI Scan
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-bold uppercase text-gray-400 tracking-widest flex items-center gap-2">
                    <Upload size={14}/> or Upload Photo
                  </button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if(file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setImgSource(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }} />
                </div>
              )}
            </AnimatePresence>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-md flex flex-col items-center justify-center p-12 space-y-4 z-50">
                <Loader2 className="animate-spin text-[#E1784F] w-12 h-12" />
                <p className="text-[#E1784F] font-bold uppercase text-[10px] tracking-widest animate-pulse">Checking Ingredients...</p>
              </div>
            )}
          </div>

          {/* RESULTS PANEL */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
                  
                  {/* RELATABLE BADGE FOR MOTHERS */}
                  {results.isChildSafe && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-100 p-4 rounded-2xl text-green-700">
                       <Baby size={18} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Safe for your Baby</span>
                    </div>
                  )}

                  <div className={`p-8 rounded-[2.5rem] border ${results.safetyScore < 70 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                    <div className="flex justify-between items-start mb-8">
                       <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Analysis Result</p>
                          <h2 className="text-2xl font-bold text-gray-900 leading-none">{results.riskLevel}</h2>
                       </div>
                       <div className={`text-4xl font-bold ${results.safetyScore < 70 ? 'text-red-500' : 'text-green-600'}`}>
                           {results.safetyScore}<span className="text-sm">/100</span>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                      {results.flagged.length > 0 ? results.flagged.map((ing: any, i: number) => (
                        <div key={i} className="p-4 bg-white rounded-2xl border border-gray-100 flex gap-4 items-start shadow-sm">
                          <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-bold text-xs uppercase tracking-wide text-gray-900">{ing.name}</p>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed mt-1">{ing.description || 'Gentle caution advised'}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-6 bg-white rounded-2xl border border-gray-100 flex gap-4 items-center shadow-sm">
                            <CheckCircle2 size={20} className="text-green-600" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-green-600">This product is safe to use.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button onClick={handleAnalyze} className="h-16 bg-[#1A1A1A] text-white rounded-2xl font-bold uppercase text-[11px] tracking-widest shadow-md flex items-center justify-center gap-2">
                       Check Ingredients <Zap size={16} />
                    </button>
                    <button onClick={() => setResults(null)} className="h-16 bg-white text-gray-400 border border-gray-100 rounded-2xl font-bold uppercase text-[11px] tracking-widest">
                       New Scan
                    </button>
                  </div>
                </motion.div>
              ) : (
                 <div className="p-10 text-center space-y-4 bg-white rounded-3xl border border-gray-100">
                    <Activity size={32} className="mx-auto text-gray-200 animate-pulse" />
                    <p className="font-bold uppercase tracking-widest text-[10px] text-gray-400">Waiting for photo</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}