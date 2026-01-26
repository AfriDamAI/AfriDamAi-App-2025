"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Trash2, Eye, Clock, ChevronLeft, Loader2,
  Sparkles, Heart, Activity, Search, ShieldAlert,
  CalendarDays, Zap, ArrowRight
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import apiClient, { getScanHistory } from "@/lib/api-client"

/**
 * 🛡️ AFRIDAM CLINICAL DIARY: HISTORY (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: High-Precision Backend Handshake & Mobile-First Dermal Records.
 */

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  const [history, setHistory] = useState<any[]>([])
  const [filter, setFilter] = useState<"all" | "skin" | "ingredient">("all")
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null)

  useEffect(() => {
    if (!authLoading && !user) router.push("/")
    if (user) fetchUserHistory()
  }, [user, authLoading, router])

  const fetchUserHistory = async () => {
    setLoading(true)
    try {
      /**
       * 🚀 THE HISTORY HANDSHAKE
       * Fetching scan results from backend using userId
       */
      const response = await getScanHistory(user?.id || '')
      const results = Array.isArray(response) ? response : response?.data || response?.resultData || []
      setHistory(results)
    } catch (err) {
      console.log("Cloud diary sync pending...")
      setHistory([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      // Optimistic Update
      const previousHistory = [...history]
      setHistory(history.filter((r) => r.id !== id))

      await apiClient.delete(`/history/${id}`)
    } catch (err) {
      console.log("Purge failed - rolling back diary state")
      fetchUserHistory() // Rollback
    }
  }

  const handleDownload = () => {
    window.print();
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E1784F] w-10 h-10" />
      </div>
    )
  }

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 text-left relative pb-20">

      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-20 relative z-10 space-y-16">

        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back home
            </button>
            <div className="space-y-4">
              <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8]">
                Skin <br /> <span className="text-[#E1784F]">Diary</span>
              </h1>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Clinical History Node • {user.firstName}</p>
            </div>
          </div>

          {/* MOBILE-SCROLLABLE FILTERS */}
          <div className="flex bg-gray-50 dark:bg-white/5 p-2 rounded-[2rem] border border-black/5 dark:border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar">
            {(['all', 'skin', 'ingredient'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-8 py-4 rounded-[1.5rem] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === t
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-lg"
                  : "opacity-40 hover:opacity-100"
                  }`}
              >
                {t}
              </button>
            ))}
          </div>
        </header>

        {/* DIARY LISTING */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4 animate-pulse">
              <Loader2 className="animate-spin text-[#E1784F] w-8 h-8" />
              <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Accessing Cloud Diary</p>
            </div>
          ) : history.length === 0 ? (
            <div className="py-32 flex flex-col items-center justify-center text-center space-y-8 border-2 border-dashed border-black/5 dark:border-white/5 rounded-[3rem]">
              <CalendarDays size={32} className="opacity-10" />
              <div className="space-y-2 px-6">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">Diary is Empty</h3>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-20">Your journey begins with your first dermal scan.</p>
              </div>
              <button
                onClick={() => router.push('/scanner')}
                className="px-10 py-5 bg-[#E1784F] text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all"
              >
                Start New Scan
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence mode="popLayout">
                {history.filter(r => filter === 'all' || r.type === filter).map((record, i) => (
                  <motion.div
                    key={record.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 flex flex-col md:flex-row justify-between items-center gap-6"
                  >
                    <div className="flex items-center gap-6 w-full">
                      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-3xl flex items-center justify-center shrink-0 ${record.type === "skin" ? "bg-[#E1784F]/10 text-[#E1784F]" : "bg-[#4DB6AC]/10 text-[#4DB6AC]"
                        }`}>
                        {record.type === "skin" ? <Activity size={28} /> : <Zap size={28} />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-3 opacity-30">
                          <span className="text-[8px] font-black uppercase tracking-widest">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-widest italic">• {record.id.slice(0, 8)}</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-none">
                          {record.title || 'Diagnostic Review'}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="flex-1 md:flex-none h-16 px-8 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[9px] tracking-widest shadow-lg transition-all active:scale-95"
                      >
                        Open Report
                      </button>
                      <button
                        onClick={() => handleDelete(record.id)}
                        className="w-16 h-16 rounded-2xl bg-red-500/5 text-red-500/20 hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* MODAL: CLINICAL FINDINGS */}
        <AnimatePresence>
          {selectedRecord && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-6 z-[100] overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="print:shadow-none print:border-none w-full max-w-2xl bg-white dark:bg-[#0A0A0A] rounded-[2.5rem] overflow-hidden relative shadow-2xl border border-black/5 dark:border-white/10"
              >
                {/* REPORT HEADER / IMAGE */}
                <div className="relative h-40 md:h-56 bg-gray-900">
                  {selectedRecord.imageUrl && (
                    <img
                      src={`/${selectedRecord.imageUrl}`} // Adjust path based on your API/Public folder
                      alt="Clinical Scan"
                      className="w-full h-full object-cover opacity-60"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                  <div className="absolute bottom-6 left-8">
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                      Diagnostic <span className="text-[#E1784F]">Report</span>
                    </h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">
                      ID: {selectedRecord.id.slice(0, 13)} • {new Date(selectedRecord.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-8 md:p-12 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar print:max-h-none">
                  {/* MAIN DIAGNOSIS PARSING */}
                  <section className="space-y-4">
                    {selectedRecord.description ? (
                      selectedRecord.description.split('\n').map((line: string, i: number) => {
                        const cleanLine = line.replace(/\*/g, '').trim();
                        if (!cleanLine) return null;

                        // Style headings (1., 2., 3., etc)
                        if (cleanLine.match(/^\d\./)) {
                          return (
                            <h4 key={i} className="text-[#E1784F] text-[10px] font-black uppercase tracking-widest pt-4 border-t border-black/5 dark:border-white/10">
                              {cleanLine}
                            </h4>
                          );
                        }
                        return (
                          <p key={i} className="text-xs md:text-sm font-medium leading-relaxed opacity-70">
                            {cleanLine}
                          </p>
                        );
                      })
                    ) : (
                      <p className="opacity-30 italic text-center">No detailed clinical description available.</p>
                    )}
                  </section>

                  {/* CONFIDENCE SCORES / PREDICTIONS */}
                  <section className="bg-gray-50 dark:bg-white/5 rounded-3xl p-6 space-y-4">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-40">AI Confidence Matrix</p>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(selectedRecord.predictions || {}).slice(0, 3).map(([key, value]: any) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-[10px] font-bold uppercase truncate max-w-[70%]">
                            {key.replace(/[\[\]']/g, '')}
                          </span>
                          <span className="text-[10px] font-black text-[#E1784F]">
                            {(value * 100).toFixed(2)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* ACTIONS */}
                <div className="p-8 grid grid-cols-2 gap-4 print:hidden">
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black h-16 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:opacity-90 transition-all"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="bg-[#E1784F] text-white h-16 rounded-2xl font-black uppercase text-[9px] tracking-widest hover:shadow-lg transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}