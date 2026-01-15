"use client"

import React, { useEffect, useState } from 'react'
import Image from "next/image"
import { type Product } from './our-product-section'

function ProductCard({ products, onClick }: { products: Product[]; onClick?: (product: Product) => void }) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 1000)
    }, [])

    if (loading) {
        return (
            <section className="py-20 bg-gray-50 dark:bg-[#0e0e0e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-[#0b0b0b] rounded-2xl shadow-lg overflow-hidden animate-pulse">
                                <div className="bg-gray-200 aspect-square"></div>
                                <div className="p-6">
                                    <div className="h-4 bg-gray-200 dark:bg-[#0b0b0b] rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded mb-3 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {products.map((product) => (
                <div
                    key={product.id}
                    className={`bg-white dark:bg-[#0b0b0b] dark:border-b rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
                    {...(onClick && { onClick: () => onClick(product) })}
                >
                    {/* Product Image */}
                    <div className="relative bg-gray-100 aspect-square overflow-hidden">
                        <Image
                            src={product.thumbnail || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>

                    {/* Product Info */}
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                            {product.name}
                        </h3>

                        {/* Unit */}
                        <div className="flex items-center mb-3">
                            <span className="text-sm text-gray-500">Unit: {product.unit}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary">{product.price.toLocaleString()} $</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ProductCard