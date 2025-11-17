"use client"

import { getTreatmentRoutine } from "@/lib/treatment-data"
import { Clock, Droplets } from 'lucide-react'

export function TreatmentRoutine() {
  const routine = getTreatmentRoutine()

  return (
    <div className="space-y-6">
      {/* Morning Routine */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Morning Routine</h4>
        <div className="space-y-2">
          {routine.morning.map((step, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-200 dark:bg-blue-800">
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{idx + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{step.name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {step.duration}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evening Routine */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Evening Routine</h4>
        <div className="space-y-2">
          {routine.evening.map((step, idx) => (
            <div key={idx} className="flex gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-200 dark:bg-purple-800">
                  <span className="text-sm font-bold text-purple-700 dark:text-purple-300">{idx + 1}</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground text-sm">{step.name}</p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {step.duration}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Types */}
      <div>
        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4" />
          Recommended Products
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {routine.products.map((product, idx) => (
            <div key={idx} className="p-3 bg-muted rounded-lg">
              <p className="text-xs font-medium text-foreground">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{product.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
