"use client"

import React, { useEffect, useState } from 'react'
import Image from "next/image"
import { type Product } from './our-product-section'
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ShoppingCart } from "lucide-react"

function ProductCard({ products, onClick }: { products: Product[]; onClick?: (product: Product) => void }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 🛡️ RE-ENFORCED: Simulation for dev, but ready for real data sync
        const timer = setTimeout(() => {
            setLoading(false)
        }, 800)
        return () => clearTimeout(timer)
    }, [])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-muted/30 rounded-[2.5rem] border border-border overflow-hidden animate-pulse">
                        <div className="bg-muted aspect-square"></div>
                        <div className="p-8 space-y-4">
                            <div className="h-4 bg-muted rounded-full w-3/4"></div>
                            <div className="h-3 bg-muted rounded-full w-1/2 opacity-50"></div>
                            <div className="h-6 bg-muted rounded-xl w-1/3"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {products.map((product, index) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={product.id}
                    className={`bg-card border border-border rounded-[2.5rem] hover:border-[#E1784F]/40 transition-all duration-500 overflow-hidden group shadow-sm hover:shadow-2xl ${onClick ? 'cursor-pointer' : ''}`}
                    {...(onClick && { onClick: () => onClick(product) })}
                >
                    {/* 🛡️ RE-ENFORCED: Product Image with Clinical Overlay */}
                    <div className="relative bg-muted aspect-square overflow-hidden">
                        <Image
                            src={product.thumbnail || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute top-4 left-4 bg-[#4DB6AC]/10 backdrop-blur-md border border-[#4DB6AC]/20 text-[#4DB6AC] px-3 py-1.5 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Sparkles size={10} />
                            <span className="text-[8px] font-black uppercase tracking-widest">AI Match</span>
                        </div>
                    </div>

                    {/* 🛡️ RE-ENFORCED: Bold Clinical Typography */}
                    <div className="p-8 space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-black italic uppercase tracking-tighter text-foreground leading-tight group-hover:text-[#E1784F] transition-colors">
                                {product.name}
                            </h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#4DB6AC]">
                                Clinical Supply • {product.unit}
                            </p>
                        </div>

                        {/* Price & Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                            <div className="flex flex-col">
                                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Price</span>
                                <span className="text-xl font-black italic text-foreground">
                                    ₦{product.price.toLocaleString()}
                                </span>
                            </div>

                            <div className="w-12 h-12 bg-[#E1784F]/10 text-[#E1784F] group-hover:bg-[#E1784F] group-hover:text-white rounded-2xl flex items-center justify-center transition-all shadow-lg">
                                <ShoppingCart size={18} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

export default ProductCard