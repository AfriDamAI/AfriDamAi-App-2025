"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ShoppingBag, 
  Search, 
  Store, 
  Star,
  ShieldCheck,
  ChevronLeft,
  Sparkles,
  Heart,
  Filter,
  ArrowRight,
  Zap
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

// 🛡️ SYNC: This interface should eventually match your Backend Prisma Product model
interface Product {
  id: string;
  name: string;
  price: number;
  vendorName: string;
  thumbnail: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  
  // 🛡️ PRODUCTION DATA: Replacing static placeholders with potential API integration
  const [products, setProducts] = useState<Product[]>([
    {
      id: "p1",
      name: "Organic Shea Body Butter",
      price: 25.00,
      vendorName: "AfriGlow Naturals",
      thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop",
      category: "Skin",
      rating: 4.8,
      inStock: true
    },
    {
      id: "p2",
      name: "Melanin-Safe Mineral SPF",
      price: 18.50,
      vendorName: "EcoDerm Kigali",
      thumbnail: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?q=80&w=400&auto=format&fit=crop",
      category: "Sun Protection",
      rating: 4.9,
      inStock: true
    },
    {
      id: "p3",
      name: "Radiant Vitamin C Serum",
      price: 32.00,
      vendorName: "Lagos Derma",
      thumbnail: "https://images.unsplash.com/photo-1612817288484-6f916006741a?q=80&w=400&auto=format&fit=crop",
      category: "Face",
      rating: 5.0,
      inStock: true
    },
    {
      id: "p4",
      name: "Baobab Repair Oil",
      price: 22.50,
      vendorName: "Heritage Essentials",
      thumbnail: "https://images.unsplash.com/photo-1601049541289-9b1b7abe71a9?q=80&w=400&auto=format&fit=crop",
      category: "Repair",
      rating: 4.7,
      inStock: true
    }
  ]);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <main className="min-h-[100svh] bg-background text-foreground transition-colors duration-500 overflow-x-hidden relative pb-20">
      
      {/* --- RADIANT BACKGROUND GLOW --- */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-16 relative z-10 space-y-12">
        
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col gap-10">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-[#E1784F]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#E1784F]/10 flex items-center justify-center group-hover:-translate-x-1 transition-transform border border-[#E1784F]/20">
                <ChevronLeft size={18} /> 
              </div>
              <span className="hidden sm:inline">Back to Clinic</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 rounded-full">
                <ShieldCheck size={14} className="text-[#4DB6AC]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-[#4DB6AC]">Clinician Verified</span>
              </div>
              <Button onClick={() => router.push('/cart')} className="relative h-14 w-14 sm:w-auto sm:px-8 bg-foreground text-background dark:bg-white dark:text-black rounded-2xl flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95">
                 <ShoppingBag size={20} />
                 <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">Cart</span>
                 {cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E1784F] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg animate-bounce">
                     {cartCount}
                   </span>
                 )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85] text-foreground">
                The Care <span className="text-[#E1784F]">Shop</span>
              </h1>
              <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.4em] text-muted-foreground max-w-md">
                Solutions curated specifically for <span className="text-[#E1784F]">melanin-rich</span> skin types.
              </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <div className="relative w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, brands, or concerns..." 
                className="w-full bg-card border border-border rounded-2xl py-6 pl-16 pr-6 text-[11px] font-bold uppercase tracking-widest focus:border-[#E1784F] outline-none transition-all shadow-inner"
              />
            </div>
            <Button className="w-full sm:w-auto h-16 px-8 bg-card border border-border text-foreground rounded-2xl flex items-center justify-center gap-3 hover:border-[#E1784F] transition-all">
               <Filter size={18} />
               <span className="text-[10px] font-black uppercase tracking-widest">Filters</span>
            </Button>
          </div>
        </header>

        {/* MARKETPLACE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="group bg-card/40 backdrop-blur-sm border-border rounded-[2.5rem] overflow-hidden hover:border-[#E1784F]/30 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col h-full">
                <div className="aspect-[1/1.2] relative overflow-hidden">
                  <img 
                    src={product.thumbnail} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
                  />
                  <div className="absolute top-6 right-6 bg-background/90 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/5 shadow-2xl">
                    <p className="text-[#E1784F] font-black text-sm tracking-tighter">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="absolute bottom-6 left-6 bg-[#4DB6AC] text-black px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl">
                    <Star size={10} fill="black" />
                    <span className="text-[9px] font-black uppercase">{product.rating}</span>
                  </div>
                </div>
                
                <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#4DB6AC]">
                      <Store size={14} />
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-80">{product.vendorName}</p>
                    </div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground leading-[1.1] group-hover:text-[#E1784F] transition-colors">{product.name}</h3>
                  </div>

                  <Button 
                    onClick={addToCart}
                    className="w-full bg-white text-black hover:bg-[#E1784F] hover:text-white rounded-2xl h-16 transition-all duration-300 font-black uppercase tracking-widest text-[9px] shadow-xl active:scale-95"
                  >
                    Add To Cart <ArrowRight size={14} className="ml-2" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* PROMO BANNER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="p-10 bg-[#1C1A19] dark:bg-card border border-[#E1784F]/20 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E1784F]/10 blur-[80px] rounded-full" />
          <div className="flex items-center gap-6 relative z-10 text-white">
            <div className="w-16 h-16 bg-[#E1784F] rounded-2xl flex items-center justify-center shadow-2xl animate-pulse">
              <Zap size={28} fill="white" />
            </div>
            <div>
              <h4 className="text-2xl font-black italic uppercase tracking-tighter">Clinical Bundles</h4>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]">Save 15% on Doctor-Approved Sets</p>
            </div>
          </div>
          <Button className="w-full md:w-auto px-10 h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:scale-105 transition-all">Explore Sets</Button>
        </motion.div>

        {/* TRUST BANNER */}
        <footer className="pt-20 border-t border-border flex flex-col items-center gap-10">
           <div className="flex flex-wrap justify-center gap-8 md:gap-16 items-center">
              {[
                { label: "Vetted Pure", icon: ShieldCheck },
                { label: "African Owned", icon: Sparkles },
                { label: "Safe For All", icon: Heart }
              ].map((trust, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground font-black uppercase text-[9px] tracking-[0.4em] opacity-40">
                  <trust.icon size={16} className="text-[#4DB6AC]" />
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