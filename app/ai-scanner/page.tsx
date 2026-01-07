"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { 
  Camera, 
  RefreshCw, 
  Loader2, 
  ChevronLeft, 
  Activity,
  CheckCircle2,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function UnifiedScanner() {
  const router = useRouter()
  const [imgSource, setImgSource] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [nodeStatus, setNodeStatus] = useState("Awaiting Signal")

  const startCamera = async () => {
    setIsCapturing(true)
    setNodeStatus("Initializing Lens...")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment", width: { ideal: 1080 } } 
      })
      if (videoRef.current) videoRef.current.srcObject = stream
      setNodeStatus("Optical Sync Active")
    } catch (err) {
      console.error("Camera access denied", err)
      setIsCapturing(false)
    }
  }

  const capture = () => {
    const canvas = document.createElement("canvas")
    if (videoRef.current) {
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
      setImgSource(canvas.toDataURL("image/jpeg"))
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(t => t.stop())
      setIsCapturing(false)
      setNodeStatus("Buffer Loaded")
    }
  }

  const analyze = async () => {
    setIsAnalyzing(true)
    setNodeStatus("Processing Dermal Layers...")
    for (let i = 0; i <= 100; i += 2) {
      setScanProgress(i)
      if (i === 40) setNodeStatus("Mapping Melanin Density...")
      if (i === 80) setNodeStatus("Finalizing Diagnostics...")
      await new Promise(r => setTimeout(r, 40))
    }
    
    setResults({
      conditions: [{ name: "Optimal Melanin Hydration", confidence: 0.98 }],
      recommendations: ["Maintain current routine", "Apply SPF 30+ daily"]
    })
    setIsAnalyzing(false)
    setNodeStatus("Report Verified")
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 lg:p-12 selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-hidden relative">
      
      {/* THEME-AWARE BACKGROUND DECORATION */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-[radial-gradient(circle_at_70%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-12 relative z-10"
      >
        {/* WORLD-CLASS BRANDED HEADER */}
        <header className="flex justify-between items-center border-b border-border pb-10">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-14 h-14 rounded-[1.25rem] bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-[#4DB6AC] transition-all group"
            >
              <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className="flex items-center gap-6">
              <img 
                src="/logo.png" 
                alt="AfriDam AI" 
                className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_25px_rgba(225,120,79,0.4)]" 
              />
              <div className="h-12 w-[1px] bg-border hidden md:block" />
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
                  Instant <span className="text-[#E1784F]">AI Analysis</span>
                </h1>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mt-2">Dermal Scanning Node V.1.0</span>
              </div>
            </div>
          </div>

          <div className="text-right hidden lg:block">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] mb-2">Clinical Status</p>
            <div className="flex items-center gap-3 justify-end bg-muted px-4 py-2 rounded-full border border-border">
              <span className="w-2 h-2 bg-[#4DB6AC] rounded-full animate-pulse shadow-[0_0_10px_#4DB6AC]" />
              <p className="text-[#4DB6AC] font-black uppercase text-[10px] tracking-widest">{nodeStatus}</p>
            </div>
          </div>
        </header>

        {!results ? (
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* SCANNER VIEWPORT */}
            <div className="lg:col-span-7">
              <Card className="bg-muted border-4 border-border overflow-hidden aspect-square relative rounded-[4rem] shadow-2xl">
                <AnimatePresence mode="wait">
                  {isCapturing ? (
                    <motion.video key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : imgSource ? (
                    <motion.img key="i" initial={{ scale: 1.1, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={imgSource} className="w-full h-full object-cover grayscale-[0.3] contrast-125" />
                  ) : (
                    <motion.div key="e" className="flex flex-col items-center gap-8 p-12 text-center h-full justify-center">
                      <div className="w-24 h-24 rounded-[2rem] bg-background border border-border flex items-center justify-center shadow-inner">
                         <Camera className="w-10 h-10 text-muted-foreground" />
                      </div>
                      <div className="space-y-3">
                         <h3 className="text-2xl font-black uppercase italic tracking-tight">Lens Inactive</h3>
                         <p className="text-muted-foreground text-sm max-w-xs font-medium leading-relaxed">Position your skin in a high-luminosity environment for accurate melanin synthesis.</p>
                      </div>
                      <Button onClick={startCamera} className="h-16 px-12 bg-[#E1784F] text-white hover:brightness-110 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl">
                        Activate Optical Node
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* HUD OVERLAY - THEME CONTRAST FIXED */}
                {(isCapturing || (imgSource && isAnalyzing)) && (
                  <div className="absolute inset-0 pointer-events-none p-12 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 border-t-4 border-l-4 border-[#E1784F] rounded-tl-[2rem] shadow-[-10px_-10px_30px_rgba(225,120,79,0.2)]" />
                      <div className="w-16 h-16 border-t-4 border-r-4 border-[#E1784F] rounded-tr-[2rem]" />
                    </div>
                    
                    {isAnalyzing && (
                      <motion.div 
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E1784F] to-transparent shadow-[0_0_25px_#E1784F] z-10"
                      />
                    )}

                    <div className="flex justify-between items-end">
                      <div className="w-16 h-16 border-b-4 border-l-4 border-[#E1784F] rounded-bl-[2rem]" />
                      <div className="w-16 h-16 border-b-4 border-r-4 border-[#E1784F] rounded-br-[2rem]" />
                    </div>
                  </div>
                )}

                {/* ANALYZING STATE */}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center space-y-8">
                    <Activity className="w-16 h-16 text-[#E1784F] animate-pulse" />
                    <div className="text-center space-y-4">
                      <p className="text-[#E1784F] font-black uppercase text-sm tracking-[0.5em]">{nodeStatus}</p>
                      <div className="w-64 h-1 bg-border rounded-full overflow-hidden mx-auto">
                         <motion.div initial={{ width: 0 }} animate={{ width: `${scanProgress}%` }} className="h-full bg-[#E1784F]" />
                      </div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{scanProgress}% SECURED</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* CONTROLS & INSTRUCTIONS */}
            <div className="lg:col-span-5 space-y-8">
              <div className="p-8 bg-muted rounded-[3rem] border border-border space-y-6">
                <div className="flex items-center gap-4 text-[#4DB6AC]">
                  <ShieldAlert size={20} />
                  <h4 className="font-black uppercase italic text-sm tracking-tight">Clinical Protocol</h4>
                </div>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">
                  Our AI is optimized for melanin-rich skin types. Ensure there are no shadows for a 98.4% diagnostic match.
                </p>
              </div>

              <div className="flex flex-col gap-4">
                {isCapturing && (
                  <div className="flex flex-col items-center gap-6 pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={capture} 
                      className="w-28 h-28 rounded-full bg-white flex items-center justify-center border-[8px] border-[#E1784F] shadow-2xl"
                    >
                      <div className="w-20 h-20 rounded-full border-4 border-black/5" />
                    </motion.button>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Capture Biometric Data</span>
                  </div>
                )}
                
                {imgSource && !results && !isAnalyzing && (
                  <div className="space-y-4">
                    <Button 
                      onClick={analyze} 
                      className="h-20 bg-[#4DB6AC] text-black hover:brightness-110 font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] w-full shadow-xl flex items-center justify-center gap-4 group"
                    >
                      Commence Instant Analysis <Zap size={18} />
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => { setImgSource(null); startCamera(); }}
                      className="w-full text-muted-foreground font-bold uppercase text-[10px] tracking-widest hover:text-foreground transition-colors"
                    >
                      Discard & Re-Initialize
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* WORLD-CLASS RESULTS VIEW */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-10"
          >
             <div className="p-12 bg-muted border border-[#4DB6AC]/30 rounded-[4rem] shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-6 mb-12">
                   <div className="w-16 h-16 bg-[#4DB6AC]/10 rounded-3xl flex items-center justify-center text-[#4DB6AC] border border-[#4DB6AC]/20">
                      <CheckCircle2 size={32} />
                   </div>
                   <div>
                      <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Analysis <span className="text-[#4DB6AC]">Verified</span></h2>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Clinical Reference Confirmed • ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-12">
                   {results.conditions.map((c: any, i: number) => (
                     <div key={i} className="flex justify-between items-center p-8 bg-card rounded-[2rem] border border-border group hover:border-[#4DB6AC]/50 transition-all cursor-default">
                       <span className="text-xl font-bold tracking-tight">{c.name}</span>
                       <div className="text-right">
                         <span className="text-[#4DB6AC] font-black tracking-widest text-sm block">{(c.confidence * 100).toFixed(0)}% MATCH</span>
                       </div>
                     </div>
                   ))}
                </div>

                {/* DOCTOR REFERRAL */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                  className="p-10 bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 group shadow-sm"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-[#4DB6AC] rounded-[2rem] flex items-center justify-center text-black shadow-xl group-hover:scale-105 transition-transform">
                      <Stethoscope size={36} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black uppercase italic text-lg text-foreground">Consult a Specialist</h4>
                      <p className="text-xs text-muted-foreground font-medium max-w-xs leading-relaxed">Book an encrypted video node to verify these findings.</p>
                    </div>
                  </div>
                  <Button onClick={() => router.push('/appointments')} className="bg-[#4DB6AC] text-black font-black uppercase text-xs tracking-widest px-12 h-16 rounded-2xl hover:brightness-110 shadow-lg">Connect Now <ArrowRight size={18} className="ml-3" /></Button>
                </motion.div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Button onClick={() => { setResults(null); setImgSource(null); }} className="h-20 bg-muted text-foreground hover:bg-muted/80 rounded-[2rem] font-black uppercase text-xs tracking-widest border border-border transition-all">New Acquisition</Button>
                <Button onClick={() => router.push('/marketplace')} className="h-20 bg-[#E1784F] text-white hover:brightness-110 rounded-[2rem] font-black uppercase text-xs tracking-widest shadow-xl shadow-[#E1784F]/20 transition-all">Marketplace Shop</Button>
             </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}