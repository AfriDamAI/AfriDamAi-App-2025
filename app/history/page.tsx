"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHistory, deleteHistoryRecord, type ScanRecord } from "@/lib/history-manager"
import Link from "next/link"
import { Trash2, Eye } from "lucide-react"

export default function History() {
  const [history, setHistory] = useState<ScanRecord[]>([])
  const [filter, setFilter] = useState<"all" | "skin" | "ingredient">("all")
  const [loading, setLoading] = useState(true)
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null)

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
    if (confirm("Are you sure you want to delete this record?")) {
      deleteHistoryRecord(id)
      setHistory(history.filter((r) => r.id !== id))
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading history...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Scan History</h1>
          <p className="text-muted-foreground">View and manage all your previous scans and analyses</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-8">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
          >
            All ({history.length})
          </Button>
          <Button
            variant={filter === "skin" ? "default" : "outline"}
            onClick={() => setFilter("skin")}
            className={filter === "skin" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
          >
            Skin Scans ({history.filter((r) => r.type === "skin").length})
          </Button>
          <Button
            variant={filter === "ingredient" ? "default" : "outline"}
            onClick={() => setFilter("ingredient")}
            className={filter === "ingredient" ? "bg-orange-600 hover:bg-orange-700 text-white" : ""}
          >
            Ingredient Analyses ({history.filter((r) => r.type === "ingredient").length})
          </Button>
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No {filter !== "all" ? filter : ""} records found</p>
              <Link href="/scan">
                <Button className="bg-orange-600 hover:bg-orange-700 text-white">Start Your First Scan</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredHistory.map((record) => (
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            record.type === "skin"
                              ? "bg-blue-100 dark:bg-orange-900 text-orange-700 dark:text-blue-200"
                              : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200"
                          }`}
                        >
                          {record.type === "skin" ? "Skin Scan" : "Ingredient Analysis"}
                        </span>
                        {record.results.safetyScore && (
                          <span className="text-sm font-medium text-foreground">
                            Safety Score: {record.results.safetyScore}%
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.timestamp).toLocaleDateString()} at{" "}
                        {new Date(record.timestamp).toLocaleTimeString()}
                      </p>
                      {record.notes && <p className="text-sm text-foreground mt-2">{record.notes}</p>}
                      {record.results.conditions && record.results.conditions.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {record.results.conditions.map((condition, idx) => (
                            <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                              {condition.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRecord(record)}
                        className="gap-2 bg-transparent"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal to view full result details */}
        {selectedRecord && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">
                    {selectedRecord.type === "skin" ? "Skin Scan" : "Ingredient Analysis"} Details
                  </h2>
                  <button
                    onClick={() => setSelectedRecord(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedRecord.timestamp).toLocaleDateString()} at{" "}
                      {new Date(selectedRecord.timestamp).toLocaleTimeString()}
                    </p>
                  </div>

                  {selectedRecord.results.conditions && selectedRecord.results.conditions.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Detected Conditions</h3>
                      <div className="space-y-2">
                        {selectedRecord.results.conditions.map((condition, idx) => (
                          <div key={idx} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-foreground">{condition.name}</span>
                              <span className="text-xs text-muted-foreground">Confidence: {condition.confidence}%</span>
                            </div>
                            <p className="text-sm text-muted-foreground capitalize">Severity: {condition.severity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedRecord.results.safetyScore && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Safety Score</h3>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${selectedRecord.results.safetyScore}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{selectedRecord.results.safetyScore}%</p>
                    </div>
                  )}

                  <Button
                    onClick={() => setSelectedRecord(null)}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white mt-6"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  )
}
