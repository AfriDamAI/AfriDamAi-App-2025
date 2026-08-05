"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ShoppingBag, Search, ShieldCheck, ChevronLeft, ChevronUp, ChevronDown,
  Sparkles, Heart, PackageOpen, SlidersHorizontal, X, AlertCircle, Plus
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
        setIsSearchEmpty(filtered.length === 0 && (term.length >= 2 || !!selectedCategory));
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
      await fetchCart(user.id);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Marketplace add-to-cart failed:", error);
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
    !!selectedCategory || minPrice !== "" || maxPrice !== "" || searchQuery.trim().length > 0;

  const activeFilterCount = [!!selectedCategory, minPrice !== "", maxPrice !== ""].filter(Boolean).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col items-center justify-center space-y-5">
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-14 h-14 bg-[#E1784F] rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shadow-[#E1784F]/30"
        >
          A
        </motion.div>
        <p className="text-black/20 dark:text-white/20 text-[8px] font-black tracking-[0.5em] uppercase">
          Opening the Care Shop
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 pb-16 selection:bg-[#E1784F]/30 text-left">

      {/* Ambient background glow */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_50%_-10%,rgba(225,120,79,0.10),transparent_65%)] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle_at_100%_100%,rgba(77,182,172,0.05),transparent_60%)] pointer-events-none z-0" />

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-10 relative z-10 space-y-10">

        {/* ── HEADER ── */}
        <header className="space-y-8">

          {/* Top bar */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="group flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-[#E1784F] hover:gap-3 transition-all"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              <span>Back home</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#4DB6AC]/8 border border-[#4DB6AC]/20 rounded-full">
                <ShieldCheck size={10} className="text-[#4DB6AC]" />
                <span className="text-[7px] font-black tracking-widest text-[#4DB6AC]/70">Hand-Picked</span>
              </div>
              <Button
                onClick={() => router.push("/cart")}
                className="relative h-10 w-10 p-0 bg-black dark:bg-white text-white dark:text-black rounded-xl shadow-lg shadow-black/20 dark:shadow-white/10 transition-all active:scale-95 hover:bg-[#E1784F] hover:shadow-[#E1784F]/30"
              >
                <ShoppingBag size={15} />
                {cart && cart.items.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#E1784F] text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#050505] shadow-sm">
                    {cart.items.length}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Hero title */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-1 h-10 bg-[#E1784F] rounded-full" />
              <div>
                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-[0.85] text-black dark:text-white">
                  Care <span className="text-[#E1784F]">Market</span>
                </h1>
              </div>
            </div>
            <p className="text-[9px] font-black tracking-[0.35em] opacity-35 max-w-sm leading-relaxed uppercase pl-4">
              Supporting your skin journey with products that feel like home.
            </p>
          </div>

          {/* ── SEARCH + FILTER ── */}
          <div className="space-y-4">
            <div className="flex gap-3 w-full max-w-xl">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-25 w-4 h-4" />
                {isSearching && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.7, ease: "linear" }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-[#E1784F] border-t-transparent rounded-full"
                  />
                )}
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-gray-50/80 dark:bg-white/[0.04] border border-gray-200/80 dark:border-white/[0.07] rounded-2xl py-4 pl-11 pr-11 text-[11px] font-bold tracking-wider focus:border-[#E1784F] focus:bg-white dark:focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(225,120,79,0.08)] outline-none transition-all placeholder:opacity-30"
                />
              </div>

              {/* Filter toggle */}
              <button
                onClick={() => setShowFilters((v) => !v)}
                className={`relative h-[54px] px-4 flex items-center gap-1.5 rounded-2xl border font-black text-[9px] tracking-widest transition-all ${
                  showFilters || activeFilterCount > 0
                    ? "bg-[#E1784F] border-[#E1784F] text-white shadow-lg shadow-[#E1784F]/25"
                    : "bg-gray-50/80 dark:bg-white/[0.04] border-gray-200/80 dark:border-white/[0.07] text-black/40 dark:text-white/40 hover:border-[#E1784F]/40"
                }`}
              >
                <SlidersHorizontal size={13} />
                <span className="hidden sm:inline">Filters</span>
                {showFilters ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                {activeFilterCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 w-[18px] h-[18px] bg-black dark:bg-white text-white dark:text-black text-[7px] font-black rounded-full flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-5 rounded-2xl bg-gray-50/60 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] space-y-5">
                    {categories.length > 0 && (
                      <div className="space-y-2.5">
                        <p className="text-[8px] font-black tracking-[0.35em] opacity-35 uppercase">Category</p>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((cat) => (
                            <button
                              key={cat.id}
                              onClick={() => setSelectedCategory(selectedCategory?.id === cat.id ? null : cat)}
                              className={`px-3.5 py-1.5 rounded-xl text-[9px] font-black tracking-wider transition-all ${
                                selectedCategory?.id === cat.id
                                  ? "bg-[#E1784F] text-white shadow-sm shadow-[#E1784F]/20"
                                  : "bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-black/50 dark:text-white/50 hover:border-[#E1784F]/40 hover:text-[#E1784F]"
                              }`}
                            >
                              {cat.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2.5">
                      <p className="text-[8px] font-black tracking-[0.35em] opacity-35 uppercase">Price Range (₦)</p>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="Min"
                          min={0}
                          className="bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-[10px] font-bold tracking-wider focus:border-[#E1784F] outline-none transition-all w-28 placeholder:opacity-30"
                        />
                        <div className="w-4 h-px bg-gray-300 dark:bg-white/20" />
                        <input
                          type="number"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="Max"
                          min={0}
                          className="bg-white dark:bg-white/[0.05] border border-gray-200 dark:border-white/10 rounded-xl py-2.5 px-4 text-[10px] font-bold tracking-wider focus:border-[#E1784F] outline-none transition-all w-28 placeholder:opacity-30"
                        />
                      </div>
                    </div>

                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-[9px] font-black tracking-wider text-[#E1784F] hover:opacity-70 transition-opacity"
                      >
                        <X size={10} />
                        Clear all filters
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active filter badges */}
            {!showFilters && (selectedCategory || minPrice !== "" || maxPrice !== "") && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap gap-2"
              >
                {selectedCategory && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20 rounded-xl text-[8px] font-black tracking-wider">
                    {selectedCategory.name}
                    <button onClick={() => setSelectedCategory(null)} className="hover:opacity-60 transition-opacity">
                      <X size={8} />
                    </button>
                  </span>
                )}
                {minPrice !== "" && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20 rounded-xl text-[8px] font-black tracking-wider">
                    From ₦{Number(minPrice).toLocaleString()}
                    <button onClick={() => setMinPrice("")} className="hover:opacity-60 transition-opacity">
                      <X size={8} />
                    </button>
                  </span>
                )}
                {maxPrice !== "" && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20 rounded-xl text-[8px] font-black tracking-wider">
                    Under ₦{Number(maxPrice).toLocaleString()}
                    <button onClick={() => setMaxPrice("")} className="hover:opacity-60 transition-opacity">
                      <X size={8} />
                    </button>
                  </span>
                )}
              </motion.div>
            )}
          </div>
        </header>

        {/* ── PRODUCT GRID / STATES ── */}
        {isError ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-5 border border-dashed border-red-200 dark:border-red-900/20 rounded-3xl bg-red-50/30 dark:bg-red-900/5">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertCircle size={20} className="text-red-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black italic tracking-tighter">Shop Unavailable</h3>
              <p className="text-[8px] font-black tracking-widest opacity-25">Could not load products. Please try again.</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-[#E1784F] text-white text-[9px] font-black tracking-widest"
            >
              Retry
            </button>
          </div>

        ) : displayedProducts.length > 0 ? (
          <>
            {/* Product count */}
            <div className="flex items-center justify-between">
              <p className="text-[8px] font-black tracking-[0.3em] opacity-30 uppercase">
                {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""}
              </p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-[8px] font-black tracking-wider text-[#E1784F] flex items-center gap-1">
                  <X size={8} /> Clear filters
                </button>
              )}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 w-full">
              {displayedProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, ease: "easeOut" }}
                  className="group flex flex-col h-full text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(0,0,0,0.08)]"
                >
                  {/* Image container */}
                  <div className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-white/[0.04] aspect-[3/4]">
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06] group-hover:blur-sm"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

                    {/* Price tag — top right */}
                    <div className="absolute top-3 right-3 bg-black/75 dark:bg-black/85 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight shadow-lg">
                      ₦{product.price.toLocaleString()}
                    </div>

                    {/* Out of stock overlay */}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center rounded-2xl">
                        <span className="bg-white/10 border border-white/20 text-white text-[8px] font-black tracking-widest px-3 py-1.5 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Quick-add button — always visible on desktop, slides up on hover on mobile-like devices */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 md:translate-y-0 transition-transform duration-300 ease-out">
                      <motion.button
                        type="button"
                        onClick={() => addToCart(product)}
                        disabled={isAddingToCart === product.id || !product.inStock}
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#E1784F] text-white rounded-xl py-3 text-[9px] font-black tracking-widest flex items-center justify-center gap-2 shadow-[0_18px_35px_rgba(225,120,79,0.18)] transition-all duration-300 ease-out hover:shadow-[0_24px_60px_rgba(225,120,79,0.28)] hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1784F]/20 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isAddingToCart === product.id ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                            className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                          />
                        ) : (
                          <>
                            <Plus size={10} strokeWidth={3} />
                            Add to Cart
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Product info below image */}
                  <div className="pt-3.5 pb-1 px-0.5 space-y-1.5 flex-1 flex flex-col">
                    <p className="text-[7px] font-black tracking-[0.25em] text-[#E1784F] uppercase leading-none">
                      {product.vendorName}
                    </p>
                    <h3 className="text-[13px] font-black italic tracking-tight leading-snug line-clamp-2 text-black dark:text-white flex-1">
                      {product.name}
                    </h3>

                    {/* Mobile-only add button (visible when hover isn't possible) */}
                    <button
                      onClick={() => addToCart(product)}
                      disabled={isAddingToCart === product.id || !product.inStock}
                      className="sm:hidden w-full mt-2 bg-[#E1784F] text-white rounded-xl py-3 text-[9px] font-black tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all hover:bg-[#ff985c] disabled:opacity-50"
                    >
                      {isAddingToCart === product.id ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                          className="w-3 h-3 border-2 border-current border-t-transparent rounded-full"
                        />
                      ) : (
                        <>
                          <Plus size={10} strokeWidth={3} />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>

        ) : isSearchEmpty ? (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-5 border border-dashed border-gray-200 dark:border-white/[0.06] rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <Search size={18} className="opacity-30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black italic tracking-tighter">No matches found</h3>
              <p className="text-[8px] font-black tracking-widest opacity-25">Try different keywords or adjust your filters.</p>
            </div>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-[9px] font-black tracking-widest text-[#E1784F] px-4 py-2 rounded-xl bg-[#E1784F]/10 hover:bg-[#E1784F]/20 transition-colors">
                Clear filters
              </button>
            )}
          </div>

        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-5 border border-dashed border-gray-200 dark:border-white/[0.06] rounded-3xl">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center">
              <PackageOpen size={18} className="opacity-30" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black italic tracking-tighter">Restocking...</h3>
              <p className="text-[8px] font-black tracking-widest opacity-25">New solutions coming soon.</p>
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <footer className="pt-12 border-t border-gray-100 dark:border-white/[0.06] flex flex-col items-center gap-5">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {[
              { label: "Proven Care", icon: ShieldCheck },
              { label: "African Glow", icon: Sparkles },
              { label: "Family Safe", icon: Heart },
            ].map((trust, i) => (
              <div key={i} className="flex items-center gap-2 font-black text-[7px] tracking-[0.25em] opacity-20 uppercase">
                <trust.icon size={11} className="text-[#E1784F]" />
                <span>{trust.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[7px] font-black tracking-[0.5em] opacity-15 italic">© 2026 AfriDam AI</p>
        </footer>

      </div>
    </main>
  );
}