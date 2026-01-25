"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  ShoppingBag, Search, ShieldCheck, ChevronLeft,
  Sparkles, Heart, PackageOpen
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { getProducts } from "@/lib/api-client" 

/**
 * 🛡️ AFRIDAM CARE SHOP: MARKETPLACE (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: High-Precision Product Handshake & Mobile-First Commerce.
 */

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
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendorProducts = async () => {
      setIsLoading(true);
      try {
        /**
         * 🚀 THE COMMERCE HANDSHAKE
         * Pulling from Render Backend.
         */
        const data = await getProducts(); 
        
        /**
         * 🛡️ OGA PRECISION MAPPING
         * Aligned with NestJS Product Entity and Vendor relation.
         */
        const mappedProducts = (Array.isArray(data) ? data : []).map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.basePrice || 0,
          vendorName: p.vendor?.companyName || "Verified Shop",
          thumbnail: p.imageUrl || "/placeholder-product.jpg",
          category: p.primaryCategory?.name || "Care Solution",
          rating: p.rating || 5,
          inStock: p.stock > 0
        }));

        setProducts(mappedProducts);
      } catch (err) {
        console.log("Shop update pending check...");
        setProducts([]); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendorProducts();
  }, []);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-[#E1784F] rounded-[1.5rem] flex items-center justify-center font-black text-3xl text-white shadow-2xl"
        >A</motion.div>
        <p className="text-black/20 dark:text-white/20 text-[9px] font-black uppercase tracking-[0.5em]">Opening the Care Shop</p>
      </div>
    )
  }

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 pb-20 selection:bg-[#E1784F]/30 text-left">
      
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-20 relative z-10 space-y-16">
        
        <header className="space-y-10">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F]"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              <span>Back home</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full">
                <ShieldCheck size={12} className="text-[#4DB6AC]" />
                <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Hand-Picked</span>
              </div>
              <Button onClick={() => router.push('/cart')} className="relative h-14 px-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl transition-all active:scale-95">
                 <ShoppingBag size={18} />
                 {cartCount > 0 && (
                   <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#E1784F] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#050505]">
                     {cartCount}
                   </span>
                 )}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] text-black dark:text-white">
                Care <br /> <span className="text-[#E1784F]">Market</span>
              </h1>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 max-w-lg leading-relaxed">
                Supporting your skin journey with products that feel like home.
              </p>
          </div>

          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..." 
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl py-6 pl-14 pr-6 text-[11px] font-bold uppercase tracking-widest focus:border-[#E1784F] outline-none transition-all"
            />
          </div>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group bg-transparent border-none shadow-none flex flex-col h-full text-left">
                  <div className="aspect-[1/1.2] relative overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-white/5">
                    <img 
                      src={product.thumbnail} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
                    />
                    <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[11px] font-black tracking-tight">
                      ${product.price}
                    </div>
                  </div>
                  
                  <div className="py-6 space-y-4">
                    <div className="space-y-1">
                      <p className="text-[8px] font-black uppercase tracking-widest text-[#E1784F]">{product.vendorName}</p>
                      <h3 className="text-xl font-black italic uppercase tracking-tighter leading-tight">{product.name}</h3>
                    </div>

                    <Button 
                      onClick={addToCart}
                      className="w-full bg-black dark:bg-white text-white dark:text-black rounded-xl h-14 font-black uppercase tracking-widest text-[9px] shadow-lg active:scale-95 transition-all"
                    >
                      Add To Cart
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[3rem]">
            <PackageOpen size={32} className="opacity-10" />
            <div className="space-y-1">
               <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Restocking...</h3>
               <p className="text-[8px] font-black uppercase tracking-widest opacity-20">New solutions coming soon.</p>
            </div>
          </div>
        )}

        <footer className="pt-20 border-t border-gray-100 dark:border-white/10 flex flex-col items-center gap-8">
           <div className="flex flex-wrap justify-center gap-10 items-center opacity-30">
              {[
                { label: "Proven Care", icon: ShieldCheck },
                { label: "African Glow", icon: Sparkles },
                { label: "Family Safe", icon: Heart }
              ].map((trust, i) => (
                <div key={i} className="flex items-center gap-3 text-black dark:text-white font-black uppercase text-[8px] tracking-[0.3em]">
                  <trust.icon size={16} className="text-[#E1784F]" />
                  <span>{trust.label}</span>
                </div>
              ))}
           </div>
           <p className="text-[8px] font-black uppercase tracking-[0.6em] opacity-20 italic">© 2026 AfriDam AI</p>
        </footer>
      </div>
    </main>
  );
}