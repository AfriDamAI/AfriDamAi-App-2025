"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getHistory, getHistoryStats, clearHistory } from "@/lib/history-manager"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
interface HistoryStats {
  totalScans: number
  skinScans: number
  ingredientAnalyses: number
  lastScan: number | null
}

interface ScanRecord {
  id: string
  type: string
  timestamp: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<HistoryStats | null>(null)
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([])
  const [loading, setLoading] = useState(true)
   const { user } = useAuth()
   const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  useEffect(() => {
    setStats(getHistoryStats())
    const history = getHistory()
    setRecentScans(history.slice(0, 5))
    setLoading(false)
  }, [])

  const chartData = [
    { name: "Skin Scans", value: stats?.skinScans || 0 },
    { name: "Ingredient Analysis", value: stats?.ingredientAnalyses || 0 },
  ]

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all history? This cannot be undone.")) {
      clearHistory()
      setStats(getHistoryStats())
      setRecentScans([])
    }
  }


  if (!user) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Authentication Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access the dashboard</p>
          <Button onClick={() => router.push("/")}>Go to Home</Button>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your skin health journey and analysis history</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stats?.totalScans || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All-time scans and analyses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Skin Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{stats?.skinScans || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Dermatology analyses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ingredient Analyses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats?.ingredientAnalyses || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Product analyses</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Activity Overview</CardTitle>
              <CardDescription>Distribution of your scans and analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  value: {
                    label: "Count",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Start a new analysis or view your history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/scan" className="block">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">Start Skin Scan</Button>
              </Link>
              <Link href="/ingredients" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Analyze Ingredients
                </Button>
              </Link>
              <Link href="/history" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  View Full History
                </Button>
              </Link>
              <Button variant="destructive" className="w-full" onClick={handleClearHistory}>
                Clear History
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest scans and analyses</CardDescription>
          </CardHeader>
          <CardContent>
            {recentScans.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No scans yet. Start your first analysis!</p>
                <Link href="/scan">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white">Start Scanning</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground capitalize">
                        {scan.type === "skin" ? "Skin Scan" : "Ingredient Analysis"}
                      </p>
                      <p className="text-sm text-muted-foreground">{formatDateTime(scan.timestamp)}</p>
                    </div>
                    <Link href={`/results?id=${scan.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`
}
