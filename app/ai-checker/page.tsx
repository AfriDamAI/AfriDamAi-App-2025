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
  Heart,
  RotateCcw,
  AlertTriangle,
  ShieldCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    setErrorDetails(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      setIsCapturing(false);
      setErrorDetails("CAMERA HARDWARE UNREACHABLE.");
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
    }
  };

  const handleAnalyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true);
    setScanProgress(20);

    try {
      const response = await fetch(imgSource);
      const blob = await response.blob();
      const file = new File([blob], "label.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('flag', 'ingredient_analysis');

      setScanProgress(50);

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyzer/process-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });

      if (!apiResponse.ok) throw new Error("AI Node Busy");

      const data = await apiResponse.json();
      
      setResults({
        riskLevel: data.safetyRating || "ANALYSIS COMPLETE",
        safetyScore: data.score || 100,
        flagged: data.flaggedIngredients || [] 
      });

      setScanProgress(100);
    } catch (err) {
      setErrorDetails("NEURAL LINK FAILED. RETRY WITH CLEARER TEXT.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading || !user) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-[#E1784F]">
       <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <main className="min-h-[100svh] bg-background text-foreground p-4 md:p-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-12">
        
        {/* HEADER - COMPACT FOR MOBILE */}
        <header className="flex justify-between items-center border-b border-white/5 pb-6 md:pb-10">
          <div className="flex items-center gap-4 md:gap-8">
            <button onClick={() => router.push('/dashboard')} className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
              <ChevronLeft size={18} />
            </button>
            <div className="flex flex-col text-left">
               <h1 className="text-xl md:text-5xl font-black italic tracking-tighter uppercase leading-none text-white">
                 Safety <span className="text-[#E1784F]">Check</span>
               </h1>
               <span className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mt-1 italic">Ingredient Analysis</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 opacity-50 text-[#4DB6AC]">
             <ShieldCheck size={14} />
             <span className="text-[9px] font-black uppercase tracking-widest">Vetted Protocol</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* CAMERA / IMAGE CONTAINER */}
          <div className="relative w-full aspect-square md:aspect-[4/5] bg-[#0A0A0A] rounded-[2rem] md:rounded-[3.5rem] border-4 md:border-8 border-white/5 overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              {isCapturing ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-[20px] border-black/40 pointer-events-none">
                    <div className="w-full h-full border-2 border-dashed border-[#E1784F]/50 rounded-lg" />
                  </div>
                  <button onClick={capture} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full border-4 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-[#E1784F]" />
                  </button>
                </div>
              ) : imgSource ? (
                <motion.img key="img" initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={imgSource} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                    <Camera className="text-white/20 w-6 h-6" />
                  </div>
                  <p className="text-white font-black uppercase italic text-lg">Scan Label</p>
                  <Button onClick={startCamera} className="bg-[#E1784F] text-white font-black px-8 h-12 rounded-xl tracking-widest text-[9px] uppercase shadow-xl">
                    Open Lens
                  </Button>
                </div>
              )}
            </AnimatePresence>

            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 space-y-4 z-50">
                <Loader2 className="animate-spin text-[#4DB6AC] w-12 h-12" />
                <p className="text-[#4DB6AC] font-black uppercase text-[9px] tracking-[0.3em] animate-pulse">Decoding: {scanProgress}%</p>
              </div>
            )}
          </div>

          {/* RESULTS PANEL */}
          <div className="space-y-6">
            {errorDetails && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[9px] font-black uppercase tracking-widest text-center">
                    {errorDetails}
                </div>
            )}

            <AnimatePresence>
              {results ? (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-6">
                  <div className={`p-6 md:p-10 rounded-[2.5rem] border ${results.safetyScore < 60 ? 'bg-red-500/5 border-red-500/20' : 'bg-[#4DB6AC]/5 border-[#4DB6AC]/20'}`}>
                    <div className="flex justify-between items-start mb-6 md:mb-10 text-left">
                       <div className="space-y-1">
                          <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-white">{results.riskLevel}</h2>
                          <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">Safety Rating</p>
                       </div>
                       <div className={`text-4xl md:text-5xl font-black italic tracking-tighter ${results.safetyScore < 60 ? 'text-red-500' : 'text-[#4DB6AC]'}`}>
                           {results.safetyScore}<span className="text-xs">/100</span>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                      {results.flagged.length > 0 ? results.flagged.map((ing: any, i: number) => (
                        <div key={i} className="p-4 md:p-6 bg-white/5 rounded-2xl border border-white/5 flex gap-3 text-left">
                          <AlertTriangle className="text-[#E1784F] shrink-0" size={16} />
                          <div>
                            <p className="font-black text-[10px] md:text-xs uppercase tracking-widest text-white">{ing.name}</p>
                            <p className="text-[9px] md:text-xs text-white/40 font-medium leading-relaxed mt-1">{ing.note}</p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-5 bg-[#4DB6AC]/10 rounded-2xl border border-[#4DB6AC]/20 flex gap-3 items-center text-left">
                            <CheckCircle2 className="text-[#4DB6AC]" size={16} />
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#4DB6AC]">Melanin-Safe Formulation.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={() => setResults(null)} className="h-14 bg-white/5 text-white/40 border border-white/10 rounded-xl font-black uppercase text-[9px] tracking-widest">
                       <RotateCcw size={12} className="mr-1" /> Reset
                    </Button>
                    <Button onClick={() => router.push('/marketplace')} className="h-14 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[9px] tracking-widest">
                      Shop Alternatives
                    </Button>
                  </div>
                </motion.div>
              ) : imgSource && !isAnalyzing ? (
                <div className="space-y-4 pt-4">
                  <Button onClick={handleAnalyze} className="w-full bg-white text-black font-black h-16 md:h-20 rounded-2xl md:rounded-[2rem] text-[10px] md:text-xs tracking-[0.3em] uppercase shadow-2xl active:scale-95 transition-all">
                    Analyze Ingredients <Zap size={14} className="ml-1" />
                  </Button>
                  <Button onClick={() => setImgSource(null)} className="w-full text-white/20 font-black uppercase text-[9px] tracking-widest">
                    Retake Photo
                  </Button>
                </div>
              ) : (
                 <div className="pt-10 md:pt-20 text-center opacity-20">
                    <Heart size={48} className="mx-auto mb-4 text-white animate-pulse" />
                    <p className="font-black uppercase tracking-[0.3em] text-[9px] text-white">Awaiting Product Scan</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}