"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHistory, deleteHistoryRecord, type ScanRecord } from "@/lib/history-manager"
import { Trash2, Eye, Clock, ChevronLeft, Loader2, Sparkles, Heart, Activity, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import { motion, AnimatePresence } from "framer-motion"

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanRecord[]>([])
  const [filter, setFilter] = useState<"all" | "skin" | "ingredient">("all")
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null)
  const { user, isLoading: authLoading } = useAuth()
  const { theme } = useTheme()
  const router = useRouter()
  const isDark = theme === "dark"

  // 🛡️ Route Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const records = getHistory()
    setHistory(records)
    setLoading(false)
  }, [])

  const filteredHistory = history.filter((record) => {
    if (filter === "all") return true
    return record.type === filter
  })

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this scan from your diary?")) {
      deleteHistoryRecord(id)
      setHistory(history.filter((r) => r.id !== id))
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E1784F] w-10 h-10" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden relative">
      
      {/* --- RADIANT BACKGROUND GLOW --- */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 py-12 lg:py-20 relative z-10 space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F] hover:opacity-80 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E1784F]/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <ChevronLeft size={16} /> 
              </div>
              Back to Home
            </button>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-foreground">
              My Skin <span className="text-[#E1784F]">Diary</span>
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground opacity-70">A timeline of your radiant progress</p>
          </div>
          
          <div className="flex bg-muted/50 backdrop-blur-md p-1.5 rounded-[1.5rem] border border-border shadow-sm">
            {(['all', 'skin', 'ingredient'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  filter === t 
                  ? "bg-[#E1784F] text-white shadow-lg" 
                  : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === 'ingredient' ? 'Products' : t}
              </button>
            ))}
          </div>
        </div>

        {/* Diary List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-24">
               <Loader2 className="animate-spin text-[#4DB6AC] w-12 h-12" />
            </div>
          ) : filteredHistory.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-dashed border-border rounded-[3rem] p-20 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                 <Clock className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-black uppercase tracking-widest text-xs italic">Your diary is empty. Start your journey today.</p>
              <Button 
                onClick={() => router.push('/ai-scanner')}
                className="bg-[#E1784F] hover:brightness-110 text-white px-12 h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl"
              >
                Scan My Skin
              </Button>
            </motion.div>
          ) : (
            <div className="grid gap-5">
              <AnimatePresence>
                {filteredHistory.map((record, i) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="bg-card border-border hover:border-[#E1784F]/30 transition-all rounded-[2.5rem] overflow-hidden group shadow-sm">
                      <CardContent className="p-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                              record.type === "skin" ? "bg-blue-500/10 text-blue-500" : "bg-[#4DB6AC]/10 text-[#4DB6AC]"
                            }`}>
                              {record.type === "skin" ? <Activity size={24} /> : <Search size={24} />}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-40">
                                  {new Date(record.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#E1784F]">
                                  {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <h3 className="text-xl font-black italic uppercase tracking-tight text-foreground">
                                {record.results.conditions?.[0]?.name || (record.type === 'skin' ? 'Skin Glow Check' : 'Safety Analysis')}
                              </h3>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 ml-20 md:ml-0">
                            <Button
                              variant="ghost"
                              onClick={() => setSelectedRecord(record)}
                              className="h-12 px-6 rounded-xl bg-muted/50 text-foreground font-black uppercase text-[9px] tracking-widest hover:bg-[#E1784F] hover:text-white transition-all gap-2"
                            >
                              <Eye size={14} /> View Report
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDelete(record.id)}
                              className="h-12 w-12 rounded-xl bg-muted/50 text-muted-foreground hover:bg-red-500 hover:text-white transition-all"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Modal for Details (Optimized for Beauty/Clinical Feel) */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 z-[100]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-xl"
            >
              <Card className="bg-background border border-border rounded-[3.5rem] overflow-hidden shadow-2xl relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E1784F]/5 blur-3xl rounded-full" />
                
                <CardContent className="p-10 md:p-14 space-y-10">
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Clinical Insight</p>
                      <h2 className="text-3xl font-black italic uppercase tracking-tighter">Your <span className="text-[#4DB6AC]">Report</span></h2>
                    </div>
                    <button 
                      onClick={() => setSelectedRecord(null)} 
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                    >✕</button>
                  </div>

                  <div className="space-y-8">
                    {selectedRecord.results.conditions && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Sparkles size={14} className="text-[#E1784F]" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Observations</p>
                        </div>
                        {selectedRecord.results.conditions.map((c, idx) => (
                          <div key={idx} className="p-6 bg-muted/50 rounded-2xl border border-border flex justify-between items-center group hover:border-[#E1784F]/30 transition-all">
                            <span className="font-black italic uppercase tracking-tight text-sm">{c.name}</span>
                            <span className="text-[#4DB6AC] font-mono text-xs font-bold">{c.confidence}% Match</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedRecord.results.safetyScore !== undefined && (
                      <div className="space-y-5">
                        <div className="flex items-center gap-3">
                          <Heart size={14} className="text-[#4DB6AC]" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Safety Analysis</p>
                        </div>
                        <div className="p-8 bg-muted rounded-[2rem] border border-border text-center space-y-4">
                          <div className="relative w-full h-3 bg-background rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${selectedRecord.results.safetyScore}%` }}
                              className="h-full bg-gradient-to-r from-[#E1784F] to-[#4DB6AC]" 
                            />
                          </div>
                          <p className="text-5xl font-black italic tracking-tighter text-foreground">{selectedRecord.results.safetyScore}%</p>
                          <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Overall Safety Rating</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => setSelectedRecord(null)}
                    className="w-full bg-[#1C1A19] text-white dark:bg-white dark:text-black h-16 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all"
                  >
                    Done Reading
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}