"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none active:scale-95 uppercase font-black tracking-widest text-[10px]",
  {
    variants: {
      variant: {
        // 🛡️ RE-ENFORCED: AfriDam Primary Orange
        default: "bg-[#E1784F] text-white shadow-xl shadow-[#E1784F]/20 hover:bg-[#C55A32] italic",
        // 🛡️ RE-ENFORCED: Clinical Teal
        clinical: "bg-[#4DB6AC] text-white shadow-xl shadow-[#4DB6AC]/20 hover:bg-[#3d9189] italic",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline:
          "border-2 border-border bg-transparent hover:bg-foreground/5 text-foreground",
        secondary:
          "bg-muted/50 text-foreground hover:bg-muted border border-border",
        ghost:
          "hover:bg-accent hover:text-accent-foreground",
        link: "text-[#E1784F] underline-offset-4 hover:underline",
      },
      size: {
        // 🛡️ RE-ENFORCED: Mobile-First Sizing (Bigger Hit Areas)
        default: "h-14 px-8 rounded-2xl",
        sm: "h-10 px-4 rounded-xl text-[9px]",
        lg: "h-18 px-10 rounded-[1.5rem] text-[11px]",
        xl: "h-20 px-12 rounded-[2rem] text-[12px]",
        icon: "size-12 rounded-2xl",
        pill: "h-12 px-6 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }