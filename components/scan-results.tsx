"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface ScanResultsProps {
  result: any
  onNewScan: () => void
}

export default function ScanResults({ result, onNewScan }: ScanResultsProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Your Skin Analysis Results</h1>
        <p className="text-muted-foreground">Detailed insights about your skin condition</p>
      </div>

      {result.image && (
        <Card className="p-6">
          <img src={result.image || "/placeholder.svg"} alt="Analyzed" className="w-full rounded-lg mb-4" />
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {result.conditions && result.conditions.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Detected Conditions</h2>
            <div className="space-y-3">
              {result.conditions.map((condition: any, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">{condition.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {(condition.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {result.recommendations && result.recommendations.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recommendations</h2>
            <div className="space-y-3">
              {result.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-600 mt-2 flex-shrink-0" />
                  <p className="text-sm text-foreground">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="flex gap-4">
        <Button onClick={onNewScan} className="flex-1 bg-orange-600 hover:bg-orange-700">
          New Scan
        </Button>
        <Button variant="outline" className="flex-1 bg-transparent">
          Save Results
        </Button>
      </div>
    </div>
  )
}
