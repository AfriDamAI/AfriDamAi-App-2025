"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Store, 
  PackageSearch,
  ArrowLeft,
  Star,
  ShieldCheck
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

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
    }
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground p-6 lg:p-12 selection:bg-[#E1784F]/30 transition-colors duration-500">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-8 border-b border-border pb-12">
          <div className="flex items-center gap-8 w-full md:w-auto">
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-12 h-12 rounded-2xl bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-[#4DB6AC] transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="flex items-center gap-6">
               {/* LOGO IN TOP LEFT */}
               <img 
                 src="/logo.png" 
                 alt="AfriDam AI Logo" 
                 className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(225,120,79,0.3)]" 
               />
               <div className="h-10 w-[1px] bg-border hidden md:block" />
               <div className="space-y-1">
                  <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-none">
                    The <span className="text-[#E1784F]">Marketplace</span>
                  </h1>
                  <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.5em] flex items-center gap-2">
                    <ShieldCheck size={12} className="text-[#4DB6AC]" /> Vetted Skincare Products
                  </p>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                placeholder="Search premium solutions..." 
                className="w-full bg-muted border border-border rounded-3xl py-4 pl-14 pr-6 text-sm focus:border-[#E1784F] outline-none transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        </header>

        {/* MARKETPLACE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <Card key={product.id} className="group bg-card border border-border rounded-[3rem] overflow-hidden hover:border-[#E1784F]/40 transition-all duration-700 shadow-xl">
              <div className="aspect-[4/5] relative overflow-hidden">
                <img 
                  src={product.thumbnail} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                />
                <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-xl px-5 py-2 rounded-2xl border border-white/10">
                  <p className="text-[#E1784F] font-black text-sm">${product.price.toFixed(2)}</p>
                </div>
                <div className="absolute bottom-6 left-6 bg-[#4DB6AC] text-black px-3 py-1 rounded-lg flex items-center gap-1 shadow-xl">
                  <Star size={10} fill="currentColor" />
                  <span className="text-[10px] font-black">{product.rating}</span>
                </div>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#4DB6AC]">
                    <Store size={14} />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">{product.vendorName}</p>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tighter leading-tight">{product.name}</h3>
                </div>

                <Button className="w-full bg-muted hover:bg-[#E1784F] hover:text-white border border-border rounded-[1.5rem] py-8 transition-all duration-500 font-black uppercase tracking-widest text-[10px]">
                  <ShoppingBag className="w-4 h-4 mr-3" /> Add To Cart
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* TRUST BANNER - CLEARER FONTS */}
        <footer className="pt-20 border-t border-border flex flex-col items-center gap-6">
           <div className="flex flex-wrap justify-center gap-6 md:gap-12 items-center text-foreground font-black uppercase text-[10px] tracking-[0.4em]">
              <p>98% Satisfaction Rate</p>
              <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full hidden md:block" />
              <p>24/7 AI Support</p>
              <div className="w-1.5 h-1.5 bg-muted-foreground/30 rounded-full hidden md:block" />
              <p>100% Natural Ingredients</p>
           </div>
        </footer>
      </div>
    </main>
  );
}