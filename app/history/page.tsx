"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHistory, deleteHistoryRecord, type ScanRecord } from "@/lib/history-manager"
import { Trash2, Eye, Clock, ChevronLeft, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"

export default function HistoryPage() {
  const [history, setHistory] = useState<ScanRecord[]>([])
  const [filter, setFilter] = useState<"all" | "skin" | "ingredient">("all")
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

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
    if (confirm("Are you sure you want to delete this clinical record?")) {
      deleteHistoryRecord(id)
      setHistory(history.filter((r) => r.id !== id))
    }
  }

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#1C1A19] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#E1784F] w-10 h-10" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#1C1A19] text-[#F7F3EE] p-6 lg:p-12">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-[#4DB6AC] text-xs font-black uppercase tracking-widest mb-4 hover:brightness-110 transition-all"
            >
              <ChevronLeft size={16} /> Back to Portal
            </button>
            <h1 className="text-5xl font-black italic tracking-tighter uppercase">Scan <span className="text-[#E1784F]">History</span></h1>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            {(['all', 'skin', 'ingredient'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === t ? "bg-[#E1784F] text-white shadow-lg" : "text-gray-500 hover:text-white"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="flex justify-center py-20">
             <Loader2 className="animate-spin text-[#4DB6AC]" />
          </div>
        ) : filteredHistory.length === 0 ? (
          <Card className="bg-white/5 border-white/5 rounded-[3rem] p-20 text-center">
            <Clock className="w-16 h-16 text-gray-700 mx-auto mb-6" />
            <p className="text-gray-500 font-bold mb-8 italic text-lg">Your clinical timeline is empty.</p>
            <Button 
              onClick={() => router.push('/ai-scanner')}
              className="bg-[#E1784F] hover:brightness-110 text-white px-10 h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
            >
              Start First Scan
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredHistory.map((record) => (
              <Card key={record.id} className="bg-white/5 border-white/5 hover:border-white/10 transition-all rounded-[2rem] overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${
                          record.type === "skin" ? "bg-blue-500/10 text-blue-400" : "bg-[#4DB6AC]/10 text-[#4DB6AC]"
                        }`}>
                          {record.type === "skin" ? "Dermal Scan" : "Chemical Analysis"}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                          {new Date(record.timestamp).toLocaleDateString()} • {new Date(record.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold italic tracking-tight">
                        {record.results.conditions?.[0]?.name || (record.type === 'skin' ? 'Skin Assessment' : 'Product Check')}
                      </h3>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                        className="h-12 w-12 rounded-xl bg-white/5 border-white/10 hover:bg-[#4DB6AC] hover:text-black transition-all"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="h-12 w-12 rounded-xl bg-white/5 border-white/10 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal for Details */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 z-[100]">
            <Card className="w-full max-w-2xl bg-[#1C1A19] border border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <CardContent className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter">
                    Clinical <span className="text-[#4DB6AC]">Report</span>
                  </h2>
                  <button onClick={() => setSelectedRecord(null)} className="text-gray-500 hover:text-white transition-colors">✕</button>
                </div>

                <div className="space-y-6">
                  {selectedRecord.results.conditions && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#E1784F]">Detected Conditions</p>
                      {selectedRecord.results.conditions.map((c, idx) => (
                        <div key={idx} className="p-5 bg-white/5 rounded-2xl border border-white/5 flex justify-between">
                          <span className="font-bold">{c.name}</span>
                          <span className="text-[#4DB6AC] font-mono">{c.confidence}% Match</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedRecord.results.safetyScore && (
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC]">Safety Rating</p>
                      <div className="h-4 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-red-500 to-[#4DB6AC]" 
                          style={{ width: `${selectedRecord.results.safetyScore}%` }}
                        />
                      </div>
                      <p className="text-4xl font-black italic">{selectedRecord.results.safetyScore}%</p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setSelectedRecord(null)}
                  className="w-full bg-white/5 border border-white/10 h-16 rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                >
                  Close Report
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}