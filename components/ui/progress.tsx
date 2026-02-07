"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

// 🛡️ RE-ENFORCED: Adding indicatorClassName to allow clinical color shifts
interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  indicatorClassName?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-3 w-full overflow-hidden rounded-full bg-muted/20 border border-white/5",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all duration-500 ease-in-out",
        // 🛡️ Defaulting to AfriDam Orange if no class is provided
        indicatorClassName || "bg-[#E1784F]"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    >
      {/* 🚀 Visual Polish: Subtle lead-edge glow */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/20 blur-md" />
    </ProgressPrimitive.Indicator>
  </ProgressPrimitive.Root>
))

Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }