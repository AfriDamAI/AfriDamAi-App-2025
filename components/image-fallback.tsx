"use client"

import React, { useState, useEffect } from 'react'

// 🛡️ RE-ENFORCED: Clinical-style Base64 Placeholder (Dark Mode Optimized)
const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjRTE3ODRGIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMiIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const [didError, setDidError] = useState(false)
    const { src, alt, style, className, ...rest } = props

    // Reset error state if the src changes (crucial for dynamic lists)
    useEffect(() => {
        setDidError(false)
    }, [src])

    const handleError = () => {
        setDidError(true)
        console.warn(`Clinical Asset Failed to Load: ${src}`)
    }

    if (didError || !src) {
        return (
            <div
                className={`inline-block bg-muted/20 border border-border/50 rounded-2xl overflow-hidden ${className ?? ''}`}
                style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    minHeight: '100px', // Prevent collapse
                    ...style 
                }}
            >
                <div className="flex flex-col items-center justify-center gap-2 p-4">
                    <img 
                        src={ERROR_IMG_SRC} 
                        alt="Asset Unavailable" 
                        className="w-12 h-12 opacity-40 grayscale" 
                        {...rest} 
                    />
                    <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground opacity-30">
                        Asset Unavailable
                    </span>
                </div>
            </div>
        )
    }

    return (
        <img 
            src={src} 
            alt={alt} 
            className={`${className} transition-opacity duration-500`} 
            style={style} 
            {...rest} 
            onError={handleError} 
            // 🛡️ Play Store Optimization: Lazy load non-critical assets
            loading="lazy"
        />
    )
}