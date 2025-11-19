"use client"
import Link from "next/link"
import ProductCard from "./product-card"

export interface Product {
    id: string
    name: string
    price: number
    unit: string
    thumbnail: string
    imageUrls?: string[]
    references?: string[]
}
export const mockedProducts: Product[] = [
    {
        id: "prod_001",
        name: "Beard Grooming Kit",
        price: 12.5,
        unit: "200g",
        thumbnail: "/product-4.jpg",
        imageUrls: [
            "https://picsum.photos/seed/shea1/600/400",
            "https://picsum.photos/seed/shea2/600/400"
        ],
        references: ["AFR-SHEA-001"]
    },
    {
        id: "prod_002",
        name: "Gift Box",
        price: 9.99,
        unit: "150g",
        thumbnail: "/product-1.jpg",
        imageUrls: [
            "https://picsum.photos/seed/blacksoap1/600/400",
            "https://picsum.photos/seed/blacksoap2/600/400"
        ],
        references: ["AFR-BLACKSOAP-150"]
    },
    {
        id: "prod_003",
        name: "Matcha & Marula Oil Shea Butter",
        price: 18.75,
        unit: "50ml",
        thumbnail: "/product-2.jpg",
        imageUrls: [
            "https://picsum.photos/seed/baobab1/600/400",
            "https://picsum.photos/seed/baobab2/600/400"
        ],
        references: ["AFR-BAOBAB-50"]
    },
    {
        id: "prod_004",
        name: "Rum Butter Lip Balm",
        price: 21.0,
        unit: "30ml",
        thumbnail: "/product-3.jpg",
        imageUrls: [
            "https://picsum.photos/seed/moringa1/600/400",
            "https://picsum.photos/seed/moringa2/600/400"
        ],
        references: ["AFR-MORINGA-030"]
    },


]

export function OurProductsSection() {


    return (
        <>
            <section className="py-20 bg-gray-50 dark:bg-[#0e0e0e] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold  text-black dark:text-white mb-6">
                            Our <span className="text-primary">Skincare Collection</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Discover our collection of natural African skincare products, crafted with nourishing botanicals to help you glow with confidence.
                        </p>
                    </div>

                    {/* Featured Products */}
                    <ProductCard products={mockedProducts} />

                    {/* View All Products Button */}
                    <div className="text-center">
                        <Link
                            href="/ecommerce"
                            className="inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            View All Products
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
