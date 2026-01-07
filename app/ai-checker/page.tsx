"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Search, 
  Loader2, 
  RefreshCw, 
  ChevronLeft,
  Skull,
  Activity,
  CheckCircle2,
  Stethoscope,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function IngredientCheckerPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [imgSource, setImgSource] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push("/");
  }, [user, authLoading, router]);

  const startCamera = async () => {
    setIsCapturing(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera Error:", err);
      setIsCapturing(false);
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
    setIsAnalyzing(true);
    for (let i = 0; i <= 100; i += 4) {
      setScanProgress(i);
      await new Promise(r => setTimeout(r, 60));
    }
    setResults({
      riskLevel: "CRITICAL RISK DETECTED",
      safetyScore: 12,
      flagged: [
        { name: "Hydroquinone", risk: "Extreme", note: "Banned bleaching agent. Known to cause exogenous ochronosis." },
        { name: "Clobetasol Propionate", risk: "High", note: "Strong steroid. Not for cosmetic use without prescription." }
      ]
    });
    setIsAnalyzing(false);
  };

  if (authLoading || !user) return (
    <div className="min-h-screen bg-background flex items-center justify-center text-[#E1784F]">
       <Loader2 className="animate-spin w-10 h-10" />
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground p-6 lg:p-12 selection:bg-[#E1784F]/30 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* WORLD-CLASS BRANDED HEADER */}
        <header className="flex justify-between items-center border-b border-border pb-10">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.push('/dashboard')} 
              className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-[#4DB6AC] transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-6">
               <img 
                 src="/logo.png" 
                 alt="AfriDam AI Logo" 
                 className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(225,120,79,0.3)]" 
               />
               <div className="h-10 w-[1px] bg-border hidden md:block" />
               <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                 Ingredient <span className="text-[#4DB6AC]">Checker</span>
               </h1>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* CAMERA CARD */}
          <Card className="aspect-[4/5] bg-muted rounded-[4rem] border border-border overflow-hidden relative shadow-2xl">
            <AnimatePresence mode="wait">
              {isCapturing ? (
                <motion.video key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : imgSource ? (
                <motion.img key="i" initial={{ scale: 1.1 }} animate={{ scale: 1 }} src={imgSource} className="w-full h-full object-cover grayscale-[0.5] contrast-125" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-24 h-24 bg-background rounded-full flex items-center justify-center border border-border shadow-inner">
                    <Search className="text-muted-foreground w-10 h-10" />
                  </div>
                  <Button onClick={startCamera} className="bg-[#4DB6AC] text-black font-black px-12 h-16 rounded-[1.5rem] tracking-widest text-[10px] uppercase shadow-lg">
                    Initialize Lens
                  </Button>
                </div>
              )}
            </AnimatePresence>

            {/* SCANNING HUD */}
            {(isCapturing || (imgSource && isAnalyzing)) && (
              <div className="absolute inset-0 pointer-events-none p-10">
                <motion.div 
                  initial={{ y: "0%" }} animate={{ y: "100%" }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-[2px] bg-[#4DB6AC] shadow-[0_0_20px_#4DB6AC] z-20"
                />
              </div>
            )}

            {isAnalyzing && (
              <div className="absolute inset-0 bg-background/90 backdrop-blur-md flex flex-col items-center justify-center p-12 space-y-6">
                <Loader2 className="animate-spin text-[#4DB6AC] w-16 h-16" />
                <p className="text-[#4DB6AC] font-black uppercase text-xs tracking-[0.4em]">{scanProgress}% ANALYZED</p>
              </div>
            )}
          </Card>

          {/* RESULTS PANEL */}
          <div className="space-y-8">
            <AnimatePresence>
              {results ? (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-8">
                  <div className={`p-10 rounded-[3rem] border-2 ${results.safetyScore < 40 ? 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-500' : 'bg-[#4DB6AC]/10 border-[#4DB6AC]/30 text-[#4DB6AC]'}`}>
                    <div className="flex justify-between items-start mb-10">
                       <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none">{results.riskLevel}</h2>
                       <div className="text-6xl font-black italic tracking-tighter">{results.safetyScore}<span className="text-sm">/100</span></div>
                    </div>
                    <div className="space-y-4">
                      {results.flagged.map((ing: any, i: number) => (
                        <div key={i} className="p-6 bg-card rounded-[2rem] border border-border flex gap-4">
                          <Skull className="text-red-500 shrink-0" size={18} />
                          <div>
                            <p className="font-black text-xs uppercase tracking-widest text-foreground">{ing.name}</p>
                            <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-1">{ing.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CLINICAL HAND-OFF */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="p-8 bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#4DB6AC] rounded-2xl flex items-center justify-center text-black">
                        <Stethoscope size={28} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-black uppercase italic text-sm text-foreground">Clinical Follow-up</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Speak to a specialist about these findings.</p>
                      </div>
                    </div>
                    <Button onClick={() => router.push('/appointments')} className="bg-[#4DB6AC] text-black font-black uppercase text-[10px] tracking-widest px-10 h-14 rounded-2xl shadow-lg hover:brightness-110">
                      Talk to a Doctor
                    </Button>
                  </motion.div>

                  <div className="flex gap-4">
                    <Button onClick={() => setResults(null)} className="flex-1 h-16 bg-muted border border-border rounded-2xl font-black uppercase text-[10px] tracking-widest text-foreground hover:bg-muted/80">
                       New Scan
                    </Button>
                    <Button onClick={() => router.push('/marketplace')} className="flex-1 h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-[#E1784F]/20">
                      Safe Alternatives
                    </Button>
                  </div>
                </motion.div>
              ) : imgSource && !isAnalyzing ? (
                <div className="space-y-6 pt-10">
                  <Button onClick={handleAnalyze} className="w-full bg-[#E1784F] text-white font-black h-20 rounded-[2rem] text-xs tracking-[0.4em] uppercase shadow-2xl shadow-[#E1784F]/20">
                    Commence Instant AI Analysis
                  </Button>
                  <Button variant="ghost" onClick={() => setImgSource(null)} className="w-full text-muted-foreground font-bold uppercase text-[10px] tracking-widest hover:text-foreground transition-all">
                    Discard and Restart
                  </Button>
                </div>
              ) : (
                 <div className="pt-20 text-center opacity-30">
                    <Search size={64} className="mx-auto mb-6 text-muted-foreground" />
                    <p className="font-black uppercase tracking-[0.4em] text-xs text-muted-foreground">Awaiting Label Acquisition</p>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}