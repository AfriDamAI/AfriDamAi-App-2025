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
import { getProducts, apiClient } from "@/lib/api-client"
import { useAuth } from "@/providers/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/lib/types"
import { toast } from "sonner"


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
  const { user } = useAuth();
  const { cart, fetchCart, addToCart: addItemToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    }
  }, [user, fetchCart]);



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

  const addToCart = async (product: Product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      router.push("/login");
      return;
    }

    setIsAddingToCart(product.id);
    try {
      const cartItem: CartItem = {
        productId: product.id,
        productName: product.name,
        productImage: product.thumbnail,
        quantity: 1,
        price: product.price
      };
      await addItemToCart(user.id, cartItem);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 bg-[#E1784F] rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
        >A</motion.div>
        <p className="text-black/20 dark:text-white/20 text-[8px] font-black tracking-[0.4em]">Opening the Care Shop</p>
      </div>
    )
  }

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 pb-12 selection:bg-[#E1784F]/30 text-left">

      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 py-6 lg:py-10 relative z-10 space-y-8">

        <header className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-[#E1784F]"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back home</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full">
                <ShieldCheck size={10} className="text-[#4DB6AC]" />
                <span className="text-[7px] font-black tracking-widest opacity-60">Hand-Picked</span>
              </div>
              <Button onClick={() => router.push('/cart')} className="relative h-10 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-lg transition-all active:scale-95">
                <ShoppingBag size={16} />
                {cart && cart.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E1784F] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#050505]">
                    {cart.items.length}
                  </span>
                )}
              </Button>

            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.8] text-black dark:text-white">
              Care <br /> <span className="text-[#E1784F]">Market</span>
            </h1>
            <p className="text-[9px] font-black tracking-[0.3em] opacity-40 max-w-lg leading-relaxed">
              Supporting your skin journey with products that feel like home.
            </p>
          </div>

          <div className="relative w-full max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-4 pl-10 pr-4 text-[10px] font-bold tracking-widest focus:border-[#E1784F] outline-none transition-all"
            />
          </div>
        </header>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group bg-transparent border-none shadow-none flex flex-col h-full text-left">
                  <div className="aspect-[1/1.2] relative overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight">
                      ₦{product.price}
                    </div>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[7px] font-black tracking-widest text-[#E1784F]">{product.vendorName}</p>
                      <h3 className="text-base font-black italic tracking-tighter leading-tight">{product.name}</h3>
                    </div>

                    <Button
                      onClick={() => addToCart(product)}
                      disabled={isAddingToCart === product.id}
                      className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg h-10 font-black tracking-widest text-[8px] shadow-md active:scale-95 transition-all"
                    >
                      {isAddingToCart === product.id ? "Adding..." : "Add To Cart"}
                    </Button>

                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-xl">
            <PackageOpen size={24} className="opacity-10" />
            <div className="space-y-0.5">
              <h3 className="text-lg font-black italic tracking-tighter leading-none">Restocking...</h3>
              <p className="text-[7px] font-black tracking-widest opacity-20">New solutions coming soon.</p>
            </div>
          </div>
        )}

        <footer className="pt-10 border-t border-gray-100 dark:border-white/10 flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-6 items-center opacity-30">
            {[
              { label: "Proven Care", icon: ShieldCheck },
              { label: "African Glow", icon: Sparkles },
              { label: "Family Safe", icon: Heart }
            ].map((trust, i) => (
              <div key={i} className="flex items-center gap-2 text-black dark:text-white font-black text-[7px] tracking-[0.2em]">
                <trust.icon size={12} className="text-[#E1784F]" />
                <span>{trust.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[7px] font-black tracking-[0.4em] opacity-20 italic">© 2026 AfriDam AI</p>
        </footer>
      </div>
    </main>
  );
}
