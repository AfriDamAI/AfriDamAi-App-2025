"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ShoppingBag, 
  Search, 
  Store, 
  ArrowLeft,
  Star,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Heart
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface Product {
  id: string;
  name: string;
  price: number;
  vendorName: string;
  thumbnail: string;
  category: string;
  rating: number;
}

export default function MarketplacePage() {
  const router = useRouter();
  
  const [products] = useState<Product[]>([
    {
      id: "p1",
      name: "Organic Shea Body Butter",
      price: 25.00,
      vendorName: "AfriGlow Naturals",
      thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
      category: "Skin",
      rating: 4.8
    },
    {
      id: "p2",
      name: "Melanin-Safe Mineral SPF",
      price: 18.50,
      vendorName: "EcoDerm Kigali",
      thumbnail: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=400&auto=format&fit=crop",
      category: "Sun Protection",
      rating: 4.9
    },
    {
      id: "p3",
      name: "Radiant Vitamin C Serum",
      price: 32.00,
      vendorName: "Lagos Derma",
      thumbnail: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&auto=format&fit=crop",
      category: "Face",
      rating: 5.0
    },
    {
      id: "p4",
      name: "Baobab Repair Oil",
      price: 22.50,
      vendorName: "Heritage Essentials",
      thumbnail: "https://images.unsplash.com/photo-1601049541289-9b1b7abe71a9?q=80&w=400&auto=format&fit=crop",
      category: "Repair",
      rating: 4.7
    }
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-hidden relative">
      
      {/* --- RADIANT BACKGROUND GLOW --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.06),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10 space-y-16">
        
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-border pb-16">
          <div className="space-y-8 w-full lg:w-auto">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F] hover:opacity-80 transition-all"
            >
              <div className="w-8 h-8 rounded-lg bg-[#E1784F]/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform">
                <ChevronLeft size={16} /> 
              </div>
              Back to Home
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center gap-8">
               <img 
                 src="/logo.png" 
                 alt="AfriDam AI" 
                 className="h-14 w-auto object-contain drop-shadow-[0_0_15px_rgba(225,120,79,0.2)]" 
               />
               <div className="hidden md:block w-[1px] h-12 bg-border opacity-50" />
               <div className="space-y-2">
                  <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none text-foreground">
                    The Care <span className="text-[#E1784F]">Shop</span>
                  </h1>
                  <div className="flex items-center gap-3">
                    <ShieldCheck size={14} className="text-[#4DB6AC]" />
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">Expert Vetted Solutions</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                placeholder="Find my routine..." 
                className="w-full bg-muted/50 backdrop-blur-md border border-border rounded-2xl py-5 pl-14 pr-6 text-[11px] font-bold uppercase tracking-widest focus:border-[#E1784F] outline-none transition-all"
              />
            </div>
            <Button className="w-full sm:w-auto h-16 px-8 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl flex items-center gap-3 shadow-xl">
               <ShoppingBag size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">Cart (0)</span>
            </Button>
          </div>
        </header>

        {/* MARKETPLACE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group bg-card border-border rounded-[2.5rem] overflow-hidden hover:border-[#E1784F]/30 transition-all duration-500 shadow-sm hover:shadow-2xl">
                <div className="aspect-[4/5] relative overflow-hidden">
                  <img 
                    src={product.thumbnail} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                  <div className="absolute top-5 right-5 bg-background/90 backdrop-blur-md px-4 py-2 rounded-xl border border-border">
                    <p className="text-[#E1784F] font-black text-sm tracking-tighter">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="absolute bottom-5 left-5 bg-[#4DB6AC] text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                    <Star size={10} fill="currentColor" />
                    <span className="text-[9px] font-black uppercase">{product.rating}</span>
                  </div>
                </div>
                
                <div className="p-8 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#4DB6AC]">
                      <Store size={12} />
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-70">{product.vendorName}</p>
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tight text-foreground leading-tight group-hover:text-[#E1784F] transition-colors">{product.name}</h3>
                  </div>

                  <Button className="w-full bg-muted text-foreground hover:bg-[#E1784F] hover:text-white rounded-xl h-14 transition-all duration-300 font-black uppercase tracking-widest text-[9px]">
                    Add To Cart
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* TRUST BANNER */}
        <footer className="pt-20 border-t border-border flex flex-col items-center gap-10">
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
              {[
                { label: "Vetted Pure", icon: ShieldCheck },
                { label: "African Owned", icon: Sparkles },
                { label: "Safe For All", icon: Heart }
              ].map((trust, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground font-black uppercase text-[9px] tracking-[0.3em] opacity-50">
                  <trust.icon size={14} className="text-[#4DB6AC]" />
                  <span>{trust.label}</span>
                </div>
              ))}
           </div>
           <p className="text-[8px] font-black uppercase tracking-[0.6em] opacity-30">© 2026 AfriDam AI. Curating Excellence in Care.</p>
        </footer>
      </div>
    </main>
  );
}