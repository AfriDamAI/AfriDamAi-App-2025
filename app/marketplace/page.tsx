"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingBag, Search, ShieldCheck, ChevronLeft, ChevronUp, ChevronDown,
  Sparkles, Heart, PackageOpen, SlidersHorizontal, X, AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { getProducts, searchProducts, getProductsByCategory, getCategories } from "@/lib/api-client"
import { useAuth } from "@/providers/auth-provider"
import { useCart } from "@/hooks/use-cart"
import { CartItem } from "@/lib/types"
import { toast } from "sonner"

interface Product {
  id: string;
  name: string;
  price: number;
  vendorName: string;
  thumbnail: string;
  category: string;
  categoryId: string;
  rating: number;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
}

function mapProducts(data: any[]): Product[] {
  return data.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.basePrice || 0,
    vendorName: p.vendor?.companyName || "Verified Shop",
    thumbnail: p.imageUrl || "/placeholder-product.jpg",
    category: p.primaryCategory?.name || "Care Solution",
    categoryId: p.primaryCategory?.id || "",
    rating: p.rating || 5,
    inStock: p.stock > 0,
  }));
}

export default function MarketplacePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cart, fetchCart, addToCart: addItemToCart } = useCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSearchEmpty, setIsSearchEmpty] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState<string | null>(null);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const latestTermRef = useRef("");

  useEffect(() => {
    if (user) fetchCart(user.id);
  }, [user, fetchCart]);

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        const mapped = mapProducts(Array.isArray(productsData) ? productsData : []);
        setAllProducts(mapped);
        setDisplayedProducts(mapped);
        setCategories(
          Array.isArray(categoriesData)
            ? categoriesData.map((c: any) => ({ id: c.id, name: c.name }))
            : []
        );
      } catch {
        setIsError(true);
        setAllProducts([]);
        setDisplayedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const applyClientFilters = useCallback(
    (base: Product[]) => {
      let filtered = base;
      if (minPrice !== "" && !isNaN(Number(minPrice))) {
        filtered = filtered.filter((p) => p.price >= Number(minPrice));
      }
      if (maxPrice !== "" && !isNaN(Number(maxPrice))) {
        filtered = filtered.filter((p) => p.price <= Number(maxPrice));
      }
      return filtered;
    },
    [minPrice, maxPrice]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const term = searchQuery.trim();
    latestTermRef.current = term;

    const execute = async () => {
      if (latestTermRef.current !== term) return;

      setIsSearchEmpty(false);

      try {
        let base: Product[];

        if (term.length >= 2) {
          setIsSearching(true);
          const data = await searchProducts(term);
          if (latestTermRef.current !== term) return;
          base = mapProducts(Array.isArray(data) ? data : []);
          setIsSearching(false);
        } else if (selectedCategory) {
          const data = await getProductsByCategory(selectedCategory.id);
          base = mapProducts(Array.isArray(data) ? data : []);
        } else {
          base = allProducts;
        }

        const filtered = applyClientFilters(base);
        setDisplayedProducts(filtered);
        setIsSearchEmpty(
          filtered.length === 0 && (term.length >= 2 || !!selectedCategory)
        );
      } catch {
        setIsSearching(false);
        setDisplayedProducts([]);
        setIsSearchEmpty(true);
      }
    };

    if (term.length >= 2) {
      debounceRef.current = setTimeout(execute, 400);
    } else {
      execute();
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedCategory, minPrice, maxPrice, allProducts, applyClientFilters]);

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
        price: product.price,
      };
      await addItemToCart(user.id, cartItem);
      toast.success(`${product.name} added to cart!`);
    } catch {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAddingToCart(null);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
    setIsSearchEmpty(false);
  };

  const hasActiveFilters =
    !!selectedCategory ||
    minPrice !== "" ||
    maxPrice !== "" ||
    searchQuery.trim().length > 0;

  const activeFilterCount = [
    !!selectedCategory,
    minPrice !== "",
    maxPrice !== "",
  ].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center space-y-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-12 h-12 bg-[#E1784F] rounded-xl flex items-center justify-center font-black text-2xl text-white shadow-lg"
        >
          A
        </motion.div>
        <p className="text-black/20 dark:text-white/20 text-[8px] font-black tracking-[0.4em]">
          Opening the Care Shop
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 pb-12 selection:bg-[#E1784F]/30 text-left">
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 py-6 lg:py-10 relative z-10 space-y-8">

        <header className="space-y-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push("/dashboard")}
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
              <Button
                onClick={() => router.push("/cart")}
                className="relative h-10 px-4 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-lg transition-all active:scale-95"
              >
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

          {/* Search bar + filter toggle */}
          <div className="flex gap-2 w-full max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 w-4 h-4" />
              {isSearching && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 border-2 border-[#E1784F] border-t-transparent rounded-full"
                />
              )}
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-4 pl-10 pr-10 text-[10px] font-bold tracking-widest focus:border-[#E1784F] outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`relative h-[52px] w-[52px] flex items-center justify-center rounded-xl border transition-all ${
                showFilters || activeFilterCount > 0
                  ? "bg-[#E1784F] border-[#E1784F] text-white"
                  : "bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-black/40 dark:text-white/40"
              }`}
            >
              <SlidersHorizontal size={14} />
              {showFilters ? <ChevronUp size={10} className="ml-0.5" /> : <ChevronDown size={10} className="ml-0.5" />}
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-black dark:bg-white text-white dark:text-black text-[7px] font-black rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-5 pt-2 pb-5 border-b border-gray-100 dark:border-white/10">

                  {categories.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[8px] font-black tracking-[0.3em] opacity-40">CATEGORY</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() =>
                              setSelectedCategory(
                                selectedCategory?.id === cat.id ? null : cat
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wider transition-all ${
                              selectedCategory?.id === cat.id
                                ? "bg-[#E1784F] text-white"
                                : "bg-gray-100 dark:bg-white/10 text-black/60 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/20"
                            }`}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <p className="text-[8px] font-black tracking-[0.3em] opacity-40">PRICE RANGE (₦)</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) =>
                          setMinPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="Min"
                        min={0}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2 px-4 text-[10px] font-bold tracking-widest focus:border-[#E1784F] outline-none transition-all w-28"
                      />
                      <span className="text-[9px] font-black opacity-30">—</span>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) =>
                          setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
                        }
                        placeholder="Max"
                        min={0}
                        className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl py-2 px-4 text-[10px] font-bold tracking-widest focus:border-[#E1784F] outline-none transition-all w-28"
                      />
                    </div>
                  </div>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-[9px] font-black tracking-wider text-[#E1784F]"
                    >
                      <X size={10} />
                      Clear all filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter badges (collapsed state) */}
          {!showFilters && (selectedCategory || minPrice !== "" || maxPrice !== "") && (
            <div className="flex flex-wrap gap-2">
              {selectedCategory && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-[#E1784F]/10 text-[#E1784F] rounded-lg text-[8px] font-black tracking-wider">
                  {selectedCategory.name}
                  <button onClick={() => setSelectedCategory(null)} className="ml-0.5">
                    <X size={8} />
                  </button>
                </span>
              )}
              {minPrice !== "" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-[#E1784F]/10 text-[#E1784F] rounded-lg text-[8px] font-black tracking-wider">
                  From ₦{Number(minPrice).toLocaleString()}
                  <button onClick={() => setMinPrice("")} className="ml-0.5">
                    <X size={8} />
                  </button>
                </span>
              )}
              {maxPrice !== "" && (
                <span className="flex items-center gap-1 px-2.5 py-1 bg-[#E1784F]/10 text-[#E1784F] rounded-lg text-[8px] font-black tracking-wider">
                  Under ₦{Number(maxPrice).toLocaleString()}
                  <button onClick={() => setMaxPrice("")} className="ml-0.5">
                    <X size={8} />
                  </button>
                </span>
              )}
            </div>
          )}
        </header>

        {/* Product grid / empty states */}
        {isError ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-red-100 dark:border-red-900/20 rounded-xl">
            <AlertCircle size={24} className="text-red-400 opacity-60" />
            <div className="space-y-0.5">
              <h3 className="text-lg font-black italic tracking-tighter leading-none">Shop Unavailable</h3>
              <p className="text-[7px] font-black tracking-widest opacity-20">
                Could not load products. Please try again.
              </p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-[8px] font-black tracking-widest text-[#E1784F] mt-1"
            >
              Retry
            </button>
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {displayedProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="group flex flex-col h-full text-left">
                  <div className="aspect-[1/1.2] relative overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5 shadow-[0_8px_30px_rgba(0,0,0,0.10)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.4)] transition-shadow duration-300 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.65)]">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 "
                    />
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight">
                      ₦{product.price.toLocaleString()}
                    </div>
                  </div>

                  <div className="py-4 space-y-3">
                    <div className="space-y-0.5">
                      <p className="text-[7px] font-black tracking-widest text-[#E1784F]">
                        {product.vendorName}
                      </p>
                      <h3 className="text-base font-black italic tracking-tighter leading-tight">
                        {product.name}
                      </h3>
                    </div>
                    <Button
                      onClick={() => addToCart(product)}
                      disabled={isAddingToCart === product.id}
                      className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg h-10 font-black tracking-widest text-[8px] shadow-md active:scale-95 transition-all"
                    >
                      {isAddingToCart === product.id ? "Adding..." : "Add To Cart"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : isSearchEmpty ? (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-xl">
            <Search size={24} className="opacity-10" />
            <div className="space-y-0.5">
              <h3 className="text-lg font-black italic tracking-tighter leading-none">No matches found</h3>
              <p className="text-[7px] font-black tracking-widest opacity-20">
                Try different keywords or adjust your filters.
              </p>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-[8px] font-black tracking-widest text-[#E1784F]"
              >
                Clear filters
              </button>
            )}
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
              { label: "Family Safe", icon: Heart },
            ].map((trust, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-black dark:text-white font-black text-[7px] tracking-[0.2em]"
              >
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
