/**
 * 🛡️ AFRIDAM ASSET RECOVERY (Rule 7 Sync)
 * Version: 2026.1.4 (Clinical Fallback Alignment)
 * Focus: High-Contrast Resilience for Vendor & Scan Assets.
 */

"use client"

import React, { useState, useEffect } from 'react'

/** * 🛡️ THE FALLBACK ICON: 
 * Optimized for Dark Mode with AfriDam Orange accents.
 */
const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjRTE3ODRGIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const [didError, setDidError] = useState(false)
    const { src, alt, style, className, ...rest } = props

    // Rule 7: Reset error state if the source changes (critical for Marketplace/History lists)
    useEffect(() => {
        setDidError(false)
    }, [src])

    const handleError = () => {
        setDidError(true)
        // Rule 3: Maintain silent internal logging
        console.warn(`Clinical Asset Handshake Failed: ${src}`)
    }

    if (didError || !src) {
        return (
            <div
                className={`inline-block bg-muted/20 border border-border/50 rounded-2xl overflow-hidden ${className ?? ''}`}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '120px', // Rule 6: Prevent layout shifting
                    ...style 
                }}
            >
                <div className="flex flex-col items-center justify-center gap-3 p-4">
                    <img 
                        src={ERROR_IMG_SRC} 
                        alt="Asset Sync Failed" 
                        className="w-14 h-14 opacity-50 grayscale" 
                        {...rest} 
                    />
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-30 text-center">
                        Sync Interrupted
                    </span>
                </div>
            </div>
        )
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={`${className} transition-all duration-700 ease-in-out`} 
            style={style} 
            {...rest} 
            onError={handleError} 
            // 🛡️ Play Store Optimization: Performance & Data efficiency
            loading="lazy"
            decoding="async"
        />
    )
}