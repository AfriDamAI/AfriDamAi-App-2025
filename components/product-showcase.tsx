"use client"

import { ArrowRight, Sparkles, ShoppingCart, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "./image-fallback";
import { motion } from "framer-motion";

const products = [
    {
        id: 1,
        name: "AI Melanin Serum",
        category: "Clinical Serums",
        description: "Advanced hydration protocol calibrated for melanin-rich skin types.",
        image: "https://images.unsplash.com/photo-1643379850623-7eb6442cd262?q=80&w=1080",
        price: "$89",
        tag: "High Match"
    },
    {
        id: 2,
        name: "Radiance Protection",
        category: "Barrier Care",
        description: "Organic ceramide complex to reinforce the African skin barrier.",
        image: "https://images.unsplash.com/photo-1609357912334-e96886c0212b?q=80&w=1080",
        price: "$65",
        tag: "AI Choice"
    },
    {
        id: 3,
        name: "Glow Boost Therapy",
        category: "Treatments",
        description: "Intensive therapy for hyperpigmentation and uneven tones.",
        image: "https://images.unsplash.com/photo-1629051192950-d251e96ab1b0?q=80&w=1080",
        price: "$75",
        tag: "Clinical"
    },
    {
        id: 4,
        name: "The Heritage Set",
        category: "Protocols",
        description: "Complete 4-step routine curated for your specific AI profile.",
        image: "https://images.unsplash.com/photo-1760614034530-a0d34463e03d?q=80&w=1080",
        price: "$199",
        tag: "Premium"
    }
];

export function ProductShowcase() {
    return (
        <div id="products" className="bg-background py-24 lg:py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* 🏷️ HEADER SECTION */}
                <div className="text-left mb-20 border-l-4 border-[#E1784F] pl-8">
                    <div className="inline-flex items-center gap-3 bg-[#E1784F]/10 text-[#E1784F] px-4 py-2 rounded-full mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Neural Recommendation Engine</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter text-foreground mb-6">
                        The Care <span className="text-[#E1784F]">Market.</span>
                    </h2>
                    <p className="text-muted-foreground text-sm font-medium uppercase tracking-tight max-w-2xl leading-relaxed">
                        Explore clinical-grade products vetted for the safety of African skin. Every selection is matched to your AI scan profile.
                    </p>
                </div>

                {/* 🛍️ PRODUCT GRID */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-card rounded-[2.5rem] border border-border overflow-hidden hover:border-[#E1784F]/30 transition-all duration-500 group"
                        >
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                                />
                                <div className="absolute top-6 right-6 bg-[#E1784F] text-white text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl">
                                    {product.tag}
                                </div>
                            </div>
                            
                            <div className="p-8 space-y-4">
                                <div>
                                    <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.2em] mb-2">{product.category}</p>
                                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">{product.name}</h3>
                                </div>
                                <p className="text-muted-foreground text-[11px] font-medium leading-relaxed line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <span className="text-lg font-black italic text-foreground">{product.price}</span>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#E1784F] hover:gap-3 transition-all">
                                        View Clinicals <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 🧬 CONVERSION BOX */}
                <div className="bg-muted/30 rounded-[3.5rem] p-10 lg:p-16 border border-border overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-5">
                         <ShieldCheck size={200} />
                    </div>
                    <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="space-y-8">
                            <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-foreground">
                                Sync Your <span className="text-[#4DB6AC]">Routine.</span>
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed uppercase tracking-tight">
                                Our AI creates a customized clinical routine based on your scan. Stop guessing and start using products vetted for your phenotype.
                            </p>
                            <button 
                                onClick={() => window.location.href = '/ai-scanner'}
                                className="bg-[#E1784F] hover:bg-[#ff8e5e] text-white px-10 py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl transition-all flex items-center gap-3"
                            >
                                <Sparkles className="w-5 h-5" />
                                Start AI Analysis
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { val: "98%", label: "Accuracy Rate", color: "bg-[#4DB6AC]/10 text-[#4DB6AC]" },
                                { val: "50K+", label: "African Users", color: "bg-[#E1784F]/10 text-[#E1784F]" },
                                { val: "100%", label: "Vetted Safe", color: "bg-[#4DB6AC]/10 text-[#4DB6AC]" },
                                { val: "24/7", label: "Expert Hub", color: "bg-[#E1784F]/10 text-[#E1784F]" }
                            ].map((stat, i) => (
                                <div key={i} className={`${stat.color} rounded-[2rem] p-8 text-center border border-current/5`}>
                                    <div className="text-3xl font-black italic tracking-tighter mb-1">{stat.val}</div>
                                    <p className="text-[8px] font-black uppercase tracking-widest opacity-60">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}