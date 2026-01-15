"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Camera, 
  ChevronLeft, 
  Activity,
  CheckCircle2,
  Stethoscope,
  Zap,
  RotateCcw,
  ShoppingBag,
  ShieldCheck,
  Scan,
  Lock,
  Loader2,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/providers/auth-provider"

export default function UnifiedScanner() {
  const router = useRouter()
  const { user } = useAuth()
  
  const [imgSource, setImgSource] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [status, setStatus] = useState("System Ready")
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const startCamera = async () => {
    setErrorDetails(null)
    setIsCapturing(true)
    setStatus("Syncing...")
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
        audio: false
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setStatus("Lens Active")
      }
    } catch (err: any) {
      setIsCapturing(false)
      setErrorDetails("Camera access denied. Check permissions.")
      setStatus("Hardware Error")
    }
  }

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.translate(canvas.width, 0)
        ctx.scale(-1, 1)
        ctx.drawImage(videoRef.current, 0, 0)
      }
      setImgSource(canvas.toDataURL("image/jpeg"))
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCapturing(false)
      setStatus("Captured")
    }
  }

  const analyze = async () => {
    if (!imgSource) return;
    setIsAnalyzing(true)
    setScanProgress(10)
    try {
      const response = await fetch(imgSource);
      const blob = await response.blob();
      const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
      const formData = new FormData();
      formData.append('file', file);

      const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyzer/scan`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` },
        body: formData,
      });

      const data = await apiResponse.json();
      setResults({ finding: data.description || "Analysis Complete", predictions: data.predictions });
      setStatus("Complete")
    } catch (err: any) {
      setErrorDetails("AI Node busy. Try again.");
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-[100svh] bg-[#0A0A0A] text-white p-4 md:p-10 relative overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-10%,rgba(225,120,79,0.1),transparent_70%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* HEADER - COMPACT */}
        <header className="flex justify-between items-center bg-white/[0.03] backdrop-blur-3xl p-4 md:p-6 rounded-[2rem] border border-white/10">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <ChevronLeft size={20} />
            </button>
            <div className="text-left">
              <h1 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">AI <span className="text-[#E1784F]">Scanner</span></h1>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#E1784F]">Clinical Grade</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${errorDetails ? 'bg-red-500/10 border-red-500/20' : 'bg-[#4DB6AC]/10 border-[#4DB6AC]/20'}`}>
            <ShieldCheck size={12} className={errorDetails ? "text-red-500" : "text-[#4DB6AC]"} />
            <span className="text-[8px] font-black uppercase tracking-widest">{status}</span>
          </div>
        </header>

        {!results ? (
          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 items-start">
            
            {/* MODERATE CAMERA VIEWPORT */}
            <div className="w-full lg:col-span-7 relative group">
              <Card className="bg-black border border-white/10 overflow-hidden aspect-square relative rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
                  ) : imgSource ? (
                    <img src={imgSource} className="w-full h-full object-cover" alt="Captured" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
                      <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center">
                        <Scan className="w-10 h-10 text-white/20" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">Clinical View</h3>
                        <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">Awaiting Lens Activation</p>
                      </div>
                      <div className="flex flex-col gap-3 w-full max-w-xs">
                        <Button onClick={startCamera} className="h-14 bg-[#E1784F] text-white rounded-xl font-black uppercase text-[10px] tracking-widest">Open Camera</Button>
                        <Button onClick={() => fileInputRef.current?.click()} className="h-14 bg-white/5 text-white border border-white/10 rounded-xl font-black uppercase text-[10px] tracking-widest">Upload</Button>
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
                  )}
                </AnimatePresence>

                {isAnalyzing && (
                  <motion.div 
                    initial={{ top: "0%" }} animate={{ top: "100%" }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-[#4DB6AC] shadow-[0_0_20px_#4DB6AC] z-30"
                  />
                )}
              </Card>

              {isCapturing && (
                <button onClick={capture} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full bg-white p-1 shadow-2xl">
                  <div className="w-full h-full rounded-full border-4 border-[#E1784F] bg-white flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-[#E1784F] animate-pulse" />
                  </div>
                </button>
              )}
            </div>

            {/* INFO PANEL */}
            <div className="w-full lg:col-span-5 space-y-6">
              <div className="p-6 md:p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8 backdrop-blur-3xl text-left">
                <div className="flex items-center gap-3 text-[#E1784F]">
                  <Activity size={18} />
                  <h4 className="font-black uppercase italic text-xs tracking-tight">Protocol</h4>
                </div>
                <div className="space-y-6">
                  {[
                    { t: "AI Synthesis", d: "Analysis by 4 melanin-specific networks." },
                    { t: "Safe Storage", d: "Clinical data is encrypted and private." }
                  ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="text-[#4DB6AC] font-black text-[10px] mt-1">0{i+1}</span>
                      <div className="space-y-0.5">
                         <p className="text-[9px] font-black uppercase tracking-widest text-white/80">{item.t}</p>
                         <p className="text-[10px] font-bold text-white/30 leading-relaxed">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {imgSource && !isAnalyzing && (
                  <Button onClick={analyze} className="w-full h-16 bg-white text-black rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-[#E1784F] hover:text-white transition-all">
                    Analyze Sample <Zap size={14} className="ml-2 fill-current" />
                  </Button>
                )}
                {isAnalyzing && (
                  <div className="w-full py-4 flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-[#4DB6AC]" size={24} />
                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Decoding Scan...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* RESULTS VIEW */
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 pb-20">
            <div className="p-6 md:p-12 bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[4rem] backdrop-blur-3xl text-left">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-14 h-14 bg-[#4DB6AC]/10 rounded-2xl border border-[#4DB6AC]/20 flex items-center justify-center text-[#4DB6AC]">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h2 className="text-2xl md:text-4xl font-black italic uppercase tracking-tighter text-white">Analysis <span className="text-[#4DB6AC]">Live</span></h2>
                  <p className="text-white/20 text-[8px] font-black uppercase tracking-[0.2em]">Verified Result</p>
                </div>
              </div>

              <div className="p-6 md:p-10 bg-white/5 rounded-[2rem] border border-white/5 space-y-4 mb-8">
                <p className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]">AI Finding</p>
                <h4 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter leading-tight text-white">{results.finding}</h4>
                <div className="flex flex-wrap gap-2">
                  {results.predictions && Object.entries(results.predictions).map(([name, score]: any) => (
                    <div key={name} className="px-3 py-1.5 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 text-[#4DB6AC] font-black text-[8px] uppercase rounded-lg">
                      {name}: {(score * 100).toFixed(1)}%
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 md:p-10 bg-[#E1784F] text-white rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
                 <div className="flex items-center gap-4 text-left">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center"><Stethoscope size={24}/></div>
                    <div>
                       <p className="text-xl font-black italic uppercase leading-none">Consult Expert</p>
                       <p className="text-[8px] font-bold uppercase opacity-80 tracking-widest mt-1">Review this result with a doctor for $15.</p>
                    </div>
                 </div>
                 <Button onClick={() => router.push('/appointment')} className="w-full md:w-auto bg-black text-white px-8 h-14 rounded-xl font-black uppercase text-[9px] tracking-widest">Book Session</Button>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={() => setResults(null)} className="flex-1 h-14 bg-white/5 border border-white/10 rounded-xl font-black uppercase text-[9px] tracking-widest text-white/40">New Scan</Button>
              <Button onClick={() => router.push('/ecommerce')} className="flex-1 h-14 bg-white text-black rounded-xl font-black uppercase text-[9px] tracking-widest">Find Care</Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}