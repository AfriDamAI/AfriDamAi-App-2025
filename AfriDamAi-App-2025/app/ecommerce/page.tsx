"use client";

import ProductCard from "@/components/product-card";
import HeroCarousel from "@/components/ui/hero-corousel";
import { Shirt, ShoppingBasket, Diamond, TrendingUp } from "lucide-react";
import React from "react";
import { Product } from '../../components/our-product-section';
import { useRouter } from "next/navigation";
import { useTheme } from "@/providers/theme-provider";


export default function EcommercePage() {

    const router = useRouter();
    const { theme } = useTheme();

    const categories = [
        { name: "Men", icon: <Shirt className="w-8 h-8 text-gray-600 dark:text-gray-400" /> },
        { name: "Women", icon: <ShoppingBasket className="w-8 h-8 text-gray-600 dark:text-gray-400" /> },
        { name: "Accessories", icon: <Diamond className="w-8 h-8 text-gray-600 dark:text-gray-400" /> },
        { name: "Trending", icon: <TrendingUp className="w-8 h-8 text-gray-600 dark:text-gray-400" /> },
    ];

    const Products: Product[] = [
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
    ];

    return (
        <div className="w-full min-h-screen bg-linear-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center py-12 transition-colors duration-300">

            {/* HERO SECTION */}
            <HeroCarousel />

            {/* CATEGORY GRID */}
            <section className="w-11/12 max-w-7xl mb-16">
                <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-10 tracking-tight">
                    Shop by Category
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center hover:-translate-y-1"
                        >
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center group-hover:bg-gray-200 dark:group-hover:bg-gray-600 transition-colors">
                                {cat.icon}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">{cat.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="w-11/12 max-w-7xl mb-16">
                <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white mb-10 tracking-tight">
                    Featured Products
                </h2>
                <ProductCard onClick={
                    (product) => {
                        console.log("Clicked product:", product);
                        router.push(`/ecommerce/product-details-page`);
                    }
                } products={Products} />
            </section>


            {/* NEWSLETTER */}
            <section className="w-11/12 max-w-7xl mb-24 text-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-10">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 tracking-tight">
                    Stay Updated
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-8">
                    Join our newsletter to receive exclusive offers, trends, and updates.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl w-full sm:w-80 text-gray-700 dark:text-white dark:bg-gray-700 dark:placeholder-gray-400 focus:border-orange-500 focus:ring focus:ring-orange-200 dark:focus:ring-orange-900 outline-none transition-all"
                    />
                    <button className="px-7 py-3 bg-orange-500 text-white rounded-xl text-sm font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all">
                        Subscribe
                    </button>
                </div>
            </section>
        </div>
    );
}
