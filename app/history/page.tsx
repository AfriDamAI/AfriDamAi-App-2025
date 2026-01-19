/**
 * 🛡️ AFRIDAM CLINICAL DIARY: HISTORY
 * Version: 2026.1.2 (Permanent Profile Sync)
 * Handshake: Fully synced with lib/api-client.ts
 * Focus: Editorial UI, Database-First, Profile Persistence.
 */

"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Trash2, Eye, Clock, ChevronLeft, Loader2, 
  Sparkles, Heart, Activity, Search, ShieldAlert,
  CalendarDays, Zap
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import apiClient from "@/lib/api-client" // 🛡️ DIRECT BACKEND SYNC

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  const [history, setHistory] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "skin" | "ingredient">("all")
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  // 🛡️ RULE 6: PRECISE AUTH GUARD
  useEffect(() => {
    if (!authLoading && !user) router.push("/")
    if (user) fetchUserHistory()
  }, [user, authLoading, router])

  const fetchUserHistory = async () => {
    setLoading(true)
    try {
      /**
       * 🚀 OGA SYNC: Fetching real clinical history from the database.
       * Pointing to your Render Backend.
       */
      const response = await apiClient.get(`/v1/history/${user?.id}`)
      setHistory(response.data || [])
    } catch (err) {
      console.error("Diary sync failed. Moving to offline mode.")
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("PURGE RECORD: Are you sure you want to delete this scan?")) {
      try {
        await apiClient.delete(`/v1/history/${id}`)
        setHistory(history.filter((r) => r.id !== id))
      } catch (err) {
        alert("Failed to delete record from the engine room.")
      }
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E1784F] w-12 h-12" />
      </div>
    )
  }

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 overflow-x-hidden selection:bg-[#E1784F]/30 relative">
      
      {/* --- CINEMATIC AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-20 relative z-10 space-y-16">
        
        {/* WORLD-CLASS HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-8">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F] transition-all"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
              Back to Hub
            </button>
            <div className="space-y-4">
                <h1 className="text-6xl md:text-9xl font-black italic tracking-[-0.05em] uppercase leading-[0.8]">
                  Skin <br /> <span className="text-[#E1784F]">Diary</span>
                </h1>
                <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] opacity-40">Clinical Timeline for {user.firstName || 'Chief'}</p>
            </div>
          </div>
          
          {/* FILTER SYSTEM */}
          <div className="flex bg-gray-100 dark:bg-white/5 backdrop-blur-3xl p-2 rounded-[2rem] border border-gray-200 dark:border-white/10">
            {(['all', 'skin', 'ingredient'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t 
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-2xl" 
                  : "opacity-40 hover:opacity-100"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* DIARY LISTING */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
               <Loader2 className="animate-spin text-[#E1784F] w-10 h-10" strokeWidth={3} />
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Retrieving Cloud Records</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[4rem]">
              <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center opacity-20">
                 <CalendarDays size={40} strokeWidth={1} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter">History is Empty</h3>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Your clinical journey begins with your first scan.</p>
              </div>
              <button 
                onClick={() => router.push('/ai-scanner')}
                className="px-12 py-5 bg-[#E1784F] text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[11px] shadow-2xl hover:scale-105 transition-all"
              >
                New AI Scan
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {history.filter(r => filter === 'all' || r.type === filter).map((record, i) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 flex flex-col md:flex-row justify-between items-center gap-8 hover:border-[#E1784F]/30 transition-all shadow-sm hover:shadow-2xl"
                  >
                    <div className="flex items-center gap-8 w-full">
                      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shrink-0 ${
                        record.type === "skin" ? "bg-[#E1784F]/10 text-[#E1784F]" : "bg-[#4DB6AC]/10 text-[#4DB6AC]"
                      }`}>
                        {record.type === "skin" ? <Activity size={32} /> : <Zap size={32} />}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-4 opacity-40">
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-current" />
                          <span className="text-[10px] font-black uppercase tracking-widest">
                            Ref: {record.id.slice(0, 8).toUpperCase()}
                          </span>
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">
                          {record.title || (record.type === 'skin' ? 'Dermal Analysis' : 'Ingredient Review')}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="flex-1 md:flex-none px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all hover:bg-[#E1784F] hover:text-white"
                      >
                        Open Report
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* --- MODAL: CLINICAL REPORT --- */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 z-[100]">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-[4rem] overflow-hidden border border-white/10 relative shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
            >
              <div className="p-12 md:p-16 space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Report Findings</p>
                    <h2 className="text-4xl font-black italic uppercase tracking-tighter leading-none">Diagnostic <br /> <span className="text-[#4DB6AC]">Summary</span></h2>
                  </div>
                  <button 
                    onClick={() => setSelectedRecord(null)} 
                    className="w-14 h-14 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-all"
                  >✕</button>
                </div>

                <div className="space-y-10">
                  <div className="p-10 bg-gray-50 dark:bg-white/5 rounded-[3rem] border border-gray-100 dark:border-white/10 text-center space-y-6">
                      <p className="text-[12px] font-bold uppercase leading-relaxed opacity-60 tracking-tight italic">
                        "{selectedRecord.summary || "Health indicators within stable range for profile type."}"
                      </p>
                      {selectedRecord.score && (
                        <div className="pt-6 border-t border-white/5">
                           <p className="text-[5rem] font-black italic tracking-tighter leading-none">{selectedRecord.score}<span className="text-sm opacity-20 ml-2">PTS</span></p>
                           <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mt-4 text-[#4DB6AC]">Global Safety Rating</p>
                        </div>
                      )}
                  </div>

                  <div className="flex items-center gap-4 p-6 bg-[#E1784F]/5 rounded-3xl border border-[#E1784F]/10">
                    <ShieldAlert size={20} className="text-[#E1784F]" />
                    <p className="text-[9px] font-black uppercase tracking-widest leading-relaxed opacity-60">
                      Diary entries are clinical references. Always verify with a dermatologist.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRecord(null)}
                  className="w-full bg-black dark:bg-white text-white dark:text-black h-20 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all"
                >
                  Dismiss Report
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </main>
  )
}