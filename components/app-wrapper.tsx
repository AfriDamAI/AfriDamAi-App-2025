"use client"

import type React from "react"


export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
