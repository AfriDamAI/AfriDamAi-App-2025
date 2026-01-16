"use client"
import Link from "next/link"
import ProductCard from "./product-card"
import { Sparkles, ArrowRight } from "lucide-react"

export interface Product {
    id: string
    name: string
    price: number
    unit: string
    thumbnail: string
    imageUrls?: string[]
    references?: string[]
}

// 🛡️ RE-ENFORCED: Clinical Mock Data (Aligned with AI Results)
export const mockedProducts: Product[] = [
    {
        id: "prod_001",
        name: "Melanin Vitality Serum",
        price: 45.0,
        unit: "50ml",
        thumbnail: "/product-4.jpg",
        imageUrls: ["https://picsum.photos/seed/vitality/600/400"],
        references: ["AFR-CLINIC-001"]
    },
    {
        id: "prod_002",
        name: "Hyperpigmentation Protocol",
        price: 62.99,
        unit: "100g",
        thumbnail: "/product-1.jpg",
        imageUrls: ["https://picsum.photos/seed/pigment/600/400"],
        references: ["AFR-CLINIC-002"]
    },
    {
        id: "prod_003",
        name: "Matcha & Marula Dermal Oil",
        price: 35.75,
        unit: "30ml",
        thumbnail: "/product-2.jpg",
        imageUrls: ["https://picsum.photos/seed/dermal/600/400"],
        references: ["AFR-CLINIC-003"]
    },
    {
        id: "prod_004",
        name: "Heritage Barrier Cream",
        price: 28.0,
        unit: "150ml",
        thumbnail: "/product-3.jpg",
        imageUrls: ["https://picsum.photos/seed/barrier/600/400"],
        references: ["AFR-CLINIC-004"]
    },
]

export function OurProductsSection() {
    return (
        <section className="py-24 md:py-32 bg-background transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">

                {/* 🏷️ SECTION HEADER: BOLD CLINICAL STYLE */}
                <div className="text-left mb-20 border-l-4 border-[#E1784F] pl-8">
                    <div className="inline-flex items-center gap-3 bg-[#E1784F]/10 text-[#E1784F] px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Neural Marketplace</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-foreground mb-6">
                        The Clinical <span className="text-[#E1784F]">Collection.</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl leading-relaxed uppercase tracking-tight">
                        Vetted protocols crafted with nourishing African botanicals, optimized by AI for melanin-rich skin.
                    </p>
                </div>

                {/* Featured Products */}
                <div className="relative">
                    <ProductCard products={mockedProducts} />
                </div>

                {/* 🕹️ ACTION FOOTER: FIXED PATHING */}
                <div className="text-center mt-20">
                    <Link
                        href="/marketplace"
                        className="group inline-flex items-center gap-4 bg-[#E1784F] text-white px-12 py-6 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-[#E1784F]/20"
                    >
                        Explore All Supplies
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                    <p className="mt-8 text-[8px] font-bold text-muted-foreground uppercase tracking-[0.5em] opacity-40">
                        Vetted for Safety • Built for Africa
                    </p>
                </div>
            </div>
        </section>
    )
}