/**
 * 🛡️ AFRIDAM CARE SHOP: MARKETPLACE (Rule 7 Sync)
 * Version: 2026.1.3 (Vendor Handshake Fixed)
 */

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
         * 🚀 THE COMMERCE HANDSHAKE (Rule 7)
         * We call the newly exported getProducts function.
         */
        const response = await getProducts(); 
        
        // Rule 7 Sync: Data extraction from the resultData wrapper
        const data = response?.resultData || response;
        
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Marketplace sync failed:", err);
        setProducts([]); // Fallback to empty state
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
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center space-y-6">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 bg-[#E1784F] rounded-3xl flex items-center justify-center font-black text-3xl text-white"
        >A</motion.div>
        <p className="text-white/20 text-[9px] font-black uppercase tracking-[0.6em]">Syncing Inventory</p>
      </div>
    )
  }

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 overflow-x-hidden relative pb-20 selection:bg-[#E1784F]/30">
      
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-20 relative z-10 space-y-20">
        
        <header className="space-y-12">
          <div className="flex justify-between items-center">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
              <span>Back to Clinic</span>
            </button>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full">
                <ShieldCheck size={14} className="text-[#E1784F]" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">Verified Vendors Only</span>
              </div>
              <Button onClick={() => router.push('/cart')} className="relative h-16 px-8 bg-black dark:bg-white text-white dark:text-black rounded-3xl shadow-2xl transition-all active:scale-95">
                 <ShoppingBag size={20} />
                 {cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#E1784F] text-white text-[11px] font-black rounded-full flex items-center justify-center border-4 border-white dark:border-[#050505]">
                     {cartCount}
                   </span>
                 )}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
              <h1 className="text-6xl md:text-9xl font-black italic tracking-[-0.05em] uppercase leading-[0.8] text-black dark:text-white">
                The Care <br /> <span className="text-[#E1784F]">Shop</span>
              </h1>
              <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] opacity-40 max-w-lg leading-relaxed">
                Curated Clinical Solutions for <span className="text-[#E1784F]">African</span> Skin Profiles.
              </p>
          </div>

          <div className="relative w-full">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20 w-5 h-5" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="SEARCH INVENTORY..." 
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl py-8 pl-20 pr-10 text-[12px] font-black uppercase tracking-widest focus:border-[#E1784F] outline-none transition-all"
            />
          </div>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="group bg-transparent border-none shadow-none flex flex-col h-full">
                  <div className="aspect-[1/1.3] relative overflow-hidden rounded-[3rem] bg-gray-100 dark:bg-white/5">
                    <img 
                      src={product.thumbnail || "/placeholder-product.jpg"} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out" 
                    />
                    <div className="absolute top-8 right-8 bg-black text-white px-4 py-2 rounded-2xl text-[12px] font-black tracking-tighter">
                      ${product.price}
                    </div>
                  </div>
                  
                  <div className="py-8 px-2 space-y-6">
                    <div className="space-y-2">
                      <p className="text-[9px] font-black uppercase tracking-[0.3em] text-[#E1784F]">{product.vendorName || "Verified Vendor"}</p>
                      <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">{product.name}</h3>
                    </div>

                    <Button 
                      onClick={addToCart}
                      className="w-full bg-black dark:bg-white text-white dark:text-black rounded-2xl h-16 transition-all duration-300 font-black uppercase tracking-widest text-[10px] hover:bg-[#E1784F] hover:text-white"
                    >
                      Add To Cart
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-40 flex flex-col items-center justify-center text-center space-y-8 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-[4rem]">
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center opacity-20">
              <PackageOpen size={40} strokeWidth={1} />
            </div>
            <div className="space-y-2">
               <h3 className="text-3xl font-black italic uppercase tracking-tighter">Inventory Syncing</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Authenticating Global Vendors...</p>
            </div>
            <Button onClick={() => router.push('/dashboard')} className="px-10 h-14 border border-black dark:border-white rounded-full text-[10px] font-black uppercase tracking-widest bg-transparent hover:bg-black hover:text-white transition-all">
              Return to Dashboard
            </Button>
          </div>
        )}

        <footer className="pt-20 border-t border-gray-100 dark:border-white/10 flex flex-col items-center gap-10">
           <div className="flex flex-wrap justify-center gap-12 md:gap-24 items-center opacity-30">
              {[
                { label: "Clinical Purity", icon: ShieldCheck },
                { label: "African Sourced", icon: Sparkles },
                { label: "Family Safe", icon: Heart }
              ].map((trust, i) => (
                <div key={i} className="flex items-center gap-4 text-black dark:text-white font-black uppercase text-[10px] tracking-[0.4em]">
                  <trust.icon size={18} className="text-[#E1784F]" />
                  <span>{trust.label}</span>
                </div>
              ))}
           </div>
           <p className="text-[9px] font-black uppercase tracking-[0.6em] opacity-20">© 2026 AfriDam AI. Secure Commerce Protocol.</p>
        </footer>
      </div>
    </main>
  );
}