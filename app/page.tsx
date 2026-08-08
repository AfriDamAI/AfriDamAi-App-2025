/**
 * 🛡️ AFRIDAM WELLNESS HUB: ELEGANT UNIFIED EDITION (Rule 6 Synergy)
 * Version: 2026.6.4 (Marketplace Preview Section Added)
 * Focus: Sophisticated Scaling, (auth) Group Alignment, Rule 6 Compliance.
 */

"use client"

import React, { useEffect, useState } from "react"
import {
  Camera, ArrowRight, Heart, ShieldCheck, Activity, Sparkles, Aperture, UsersRound, MessageCircle,
  ShoppingCart, BadgeCheck
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import TeamMemberSection from "@/components/team-member-section"
import CareHubSection from "@/components/care-hub-section"
import PedigreeSection from "@/components/pedigree-section"
import { getProducts, getImageUrl } from "@/lib/api-client"
import { useCart } from "@/hooks/use-cart"
import Image from "next/image";
import FaqChatbot from "@/components/FaqChatbot"

// -----------------------------------------------------------------------
// 🛒 MARKETPLACE PREVIEW
// Field names confirmed against your cart page (app/cart/page.tsx):
//   product.id, product.name, product.imageUrl, product.basePrice
// `verifiedShop` is NOT confirmed on the product object — treated as
// optional so the badge only renders if your API actually sends it.
// -----------------------------------------------------------------------
type MarketplaceProduct = {
  id: string
  name: string
  basePrice: number
  imageUrl?: string
  verifiedShop?: boolean
}

const MAX_PREVIEW_ITEMS = 4

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`
}

export default function LandingPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { addToCart } = useCart();

  /**
   * 🛡️ RULE 6 SYNERGY: 
   * High-speed redirection to dedicated auth nodes.
   */
  const navigateToAuth = (type: "login" | "register") => {
    router.push(`/${type}`);
  };

  const handleFeatureAccess = (path: string) => {
    if (user) router.push(path);
    else navigateToAuth("register");
  };

  // 🛒 MARKETPLACE PREVIEW: live product fetch
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        const list = Array.isArray(data) ? data : [];
        setProducts(list.slice(0, MAX_PREVIEW_ITEMS));
      } catch (err) {
        console.error("Failed to load marketplace preview products", err);
      } finally {
        setProductsLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async (product: MarketplaceProduct) => {
    if (!user) {
      navigateToAuth("register");
      return;
    }
    try {
      // Matches the real CartItem shape from use-cart.ts's addToCart(userId, item).
      await addToCart(user.id, {
        productId: product.id,
        productName: product.name,
        productImage: getImageUrl(product.imageUrl),
        price: product.basePrice,
        quantity: 1,
      });
    } catch (err) {
      console.error("Failed to add product to cart", err);
    }
  };

  return (
    <div className="min-h-svh bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 selection:bg-[#E1784F]/30 relative no-scrollbar">

      {/* 🧭 Navigation handled by AppWrapper → Navigation component */}

      {/* 🌪️ 2. HERO */}
      <section className="min-h-[calc(100svh-5rem)] relative px-4 min-[360px]:px-5 sm:px-6 flex items-center">
        <div className="max-w-screen-xl mx-auto w-full grid lg:grid-cols-12 items-center gap-8 md:gap-20 py-12 md:py-16">

          {/* Text + CTA — mobile: col 1-2 of 3; desktop: left 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-none lg:col-span-7 lg:order-1 order-2 gap-6 items-end"
          >
            {/* Badge + Heading + Subtext */}
            <div className="sm:col-span-2 space-y-4 md:space-y-6" style={{ margin: 0 }}>
              <div className="inline-flex items-center gap-2.5 bg-[#E1784F]/5 dark:bg-white/5 px-4 py-2 rounded-full border border-[#E1784F]/10">
                <Sparkles className="text-[#E1784F]" size={12} />
                <span className="text-[9px] font-black capitalize tracking-widest text-[#E1784F]">Clinical Excellence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-7xl font-black leading-[1.1] tracking-tight italic text-black dark:text-white">
                Your <br /> Skin&apos;s <br /> <span className="text-[#E1784F]">Best Friend.</span>
              </h1>
              <p className="text-sm sm:text-lg md:text-2xl font-black max-w-lg opacity-25 tracking-tighter leading-tight italic">
                Localized protection. <br /> Safe care for the heritage.
              </p>
            </div>

            {/* CTA Button — stacks beside text on mobile, full-width below on lg */}
            <button
              onClick={() => router.push("/public-scan")}
              className="group sm:col-span-1 lg:col-span-full h-16 md:h-20 px-6 md:px-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black capitalize text-[10px] md:text-[11px] tracking-widest shadow-xl flex items-center justify-center gap-4 md:gap-6 active:scale-95 transition-all sm:justify-self-end lg:justify-self-start self-end w-full sm:w-auto lg:w-fit"
            >
              Start Now <ArrowRight size={16} />
            </button>
          </motion.div>

          {/* Image Card — full width on mobile (order-1), right 5 cols on desktop */}
          <div className="lg:col-span-5 relative max-w-sm sm:max-w-md mx-auto w-full lg:order-2 order-1">
            <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden border-[10px] border-white dark:border-[#121212] shadow-2xl bg-muted/20 relative group">
              <img
                src="./molle.png"
                alt="AfriDam"
                className="w-full h-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 pointer-events-none">
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-0 right-0 h-[2px] bg-[#E1784F] shadow-[0_0_30px_5px_#E1784F] z-20"
                />
              </div>
              <Link
                href="/public-scan"
                className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 p-4 sm:p-6 bg-black/80 hover:bg-black/90 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] border border-white/10 flex items-center gap-4 sm:gap-5 cursor-pointer active:scale-95 transition-all outline-none"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4DB6AC] rounded-xl sm:rounded-2xl flex items-center justify-center text-white flex-shrink-0">
                  <Camera size={20} />
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black capitalize tracking-widest text-white italic">Analysis Active</p>
                    <p className="text-[9px] font-bold text-[#4DB6AC] uppercase tracking-widest flex items-center gap-1">Scan <ArrowRight size={10} /></p>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 6, repeat: Infinity }} className="h-full bg-[#E1784F]" />
                  </div>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 🎥 3. THE VISUAL FLOW */}
<section className="py-20 md:py-36 px-6 bg-gray-100/70 dark:bg-white/[0.02] border-y border-black/5 dark:border-white/5 relative overflow-hidden">
  <div className="max-w-screen-xl mx-auto space-y-16 md:space-y-20">

    {/* Section Header */}
    <div className="text-center space-y-4 max-w-2xl mx-auto">
      <span className="text-[#E1784F] text-xs font-black uppercase tracking-[0.2em] opacity-90">
        Simple English Approach
      </span>
      <h2 className="text-4xl sm:text-5xl md:text-6xl font-black capitalize italic tracking-tighter leading-tight text-black dark:text-white">
        Simple Path. <br className="hidden md:block" />
        <span className="text-[#E1784F]">Pure Results.</span>
      </h2>
    </div>

    {/* Steps Grid: 2 White Cards & 2 Brand Orange Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">

      {/* STEP 01 - WHITE CARD */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="p-8 md:p-10 bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-8 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#E1784F]/10 text-[#E1784F] flex items-center justify-center font-black text-xl italic border border-[#E1784F]/20">
            01
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black italic leading-tight text-black dark:text-white">
              Snap a <br />Photo
            </h3>
            <p className="text-sm sm:text-base font-semibold text-black/70 dark:text-white/70 leading-relaxed tracking-tight">
              Capture your skin concern clearly under soft, natural light.
            </p>
          </div>
        </div>

        <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-[2rem] relative border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden group">
          <div className="p-6 bg-white dark:bg-white/10 backdrop-blur-xl rounded-full border border-black/5 dark:border-white/20 shadow-md group-hover:scale-110 transition-transform duration-300">
            <Aperture size={40} className="text-[#E1784F]" />
          </div>
        </div>
      </motion.div>

      {/* STEP 02 - BRAND ORANGE CARD */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="p-8 md:p-10 bg-[#E1784F] text-white rounded-[2.5rem] space-y-8 shadow-xl shadow-[#E1784F]/25 relative overflow-hidden flex flex-col justify-between"
      >
        <div className="space-y-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-xl italic border border-white/30">
            02
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black capitalize italic leading-tight text-white">
              Instant <br />Check
            </h3>
            <p className="text-sm sm:text-base font-semibold text-white/95 leading-relaxed tracking-tight">
              We check your scan against clinical health standards for melanin.
            </p>
          </div>
        </div>

        <div className="aspect-square bg-black/10 rounded-[2rem] flex items-center justify-center relative overflow-hidden border border-white/20 z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-2 border-dashed border-white/60 rounded-full flex items-center justify-center"
          >
            <Activity size={38} className="text-white" />
          </motion.div>
        </div>
      </motion.div>

      {/* STEP 03 - WHITE CARD */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="p-8 md:p-10 bg-white dark:bg-black rounded-[2.5rem] border border-black/5 dark:border-white/5 space-y-8 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
      >
        <div className="space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#4DB6AC]/10 text-[#4DB6AC] flex items-center justify-center font-black text-xl italic border border-[#4DB6AC]/20">
            03
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black italic leading-tight text-black dark:text-white">
              Get the <br />Answer
            </h3>
            <p className="text-sm sm:text-base font-semibold text-black/70 dark:text-white/70 leading-relaxed tracking-tight">
              Receive immediate results and guidance for your skin journey.
            </p>
          </div>
        </div>

        <div className="aspect-square bg-gray-50 dark:bg-white/5 rounded-[2rem] p-8 flex flex-col justify-center space-y-3.5 border border-black/5 dark:border-white/5">
          <motion.div initial={{ width: "20%" }} whileInView={{ width: "85%" }} transition={{ duration: 0.8 }} className="h-3 bg-[#4DB6AC] rounded-full opacity-90" />
          <motion.div initial={{ width: "20%" }} whileInView={{ width: "100%" }} transition={{ duration: 0.8, delay: 0.2 }} className="h-3 bg-[#4DB6AC] rounded-full opacity-50" />
          <motion.div initial={{ width: "20%" }} whileInView={{ width: "65%" }} transition={{ duration: 0.8, delay: 0.4 }} className="h-3 bg-[#4DB6AC] rounded-full opacity-30" />
        </div>
      </motion.div>

      {/* STEP 04 - BRAND ORANGE CARD */}
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="p-8 md:p-10 bg-[#E1784F] text-white rounded-[2.5rem] space-y-8 shadow-xl shadow-[#E1784F]/25 relative overflow-hidden flex flex-col justify-between"
      >
        <div className="space-y-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-black text-xl italic border border-white/30">
            04
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-3xl font-black italic leading-tight text-white">
              Meet the <br />Consultants
            </h3>
            <p className="text-sm sm:text-base font-semibold text-white/95 leading-relaxed tracking-tight">
              Connect your results to real specialist insight and next-step care.
            </p>
          </div>
        </div>

        <div className="aspect-square bg-black/10 rounded-[2rem] relative border border-white/20 overflow-hidden z-10">
          <motion.div
            animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-1/2 top-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-[1.75rem] bg-white/20 border border-white/40 flex items-center justify-center shadow-lg backdrop-blur-sm"
          >
            <UsersRound size={36} className="text-white" />
          </motion.div>
          <motion.div
            animate={{ x: [0, 8, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 top-8 h-10 w-10 rounded-xl bg-white/25 border border-white/30 flex items-center justify-center"
          >
            <MessageCircle size={20} className="text-white" />
          </motion.div>
          <motion.div
            animate={{ width: ["30%", "65%", "40%"] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 bottom-10 h-2 rounded-full bg-white/40"
          />
          <motion.div
            animate={{ width: ["50%", "25%", "60%"] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-6 bottom-6 h-2 rounded-full bg-white/25"
          />
        </div>
      </motion.div>

    </div>
  </div>
</section>

{/* 🛒 5.5 MARKETPLACE PREVIEW */}
<section id="marketplace-preview" className="py-24 md:py-40 px-6">
  <div className="max-w-screen-xl mx-auto space-y-16">

    {/* Section header */}
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
      <div className="space-y-4">
        <span className="text-[#E1784F] text-[10px] font-black capitalize tracking-widest opacity-40">Verified Products</span>
        <h2 className="text-4xl md:text-6xl font-black capitalize italic tracking-tighter leading-tight">
          Shop the <br className="hidden md:block" /><span className="text-[#4DB6AC]">Marketplace.</span>
        </h2>
      </div>
      <Link
        href="/marketplace"
        className="group inline-flex items-center gap-3 self-start md:self-auto h-14 px-8 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black capitalize text-[10px] tracking-widest shadow-xl active:scale-95 transition-all"
      >
        View All Products
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
      </Link>
    </div>

    {/* Product grid */}
    {productsLoading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {Array.from({ length: MAX_PREVIEW_ITEMS }).map((_, i) => (
          <div
            key={i}
            className="rounded-[2.5rem] overflow-hidden border border-black/5 dark:border-white/5"
          >
            <div className="aspect-[4/5] bg-gray-100 dark:bg-white/5 animate-pulse" />
            <div className="p-6 space-y-3">
              <div className="h-2.5 w-20 bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
              <div className="h-4 w-full bg-gray-100 dark:bg-white/5 rounded-full animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    ) : products.length === 0 ? (
      <div className="py-20 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-30">
          No products available right now
        </p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true }}
            variants={{
              initial: { opacity: 0, y: 24 },
              animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08 } },
            }}
            className="relative bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#E1784F]/40 transition-shadow duration-300 flex flex-col justify-between"
          >
            {/* Image + Overlay Container */}
            <div className="relative aspect-[4/5] bg-gray-50 dark:bg-white/5 overflow-hidden">
              <Link href={`/marketplace/${product.id}`} className="block w-full h-full">
                <motion.img
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  variants={{
                    initial: { scale: 1 },
                    hover: { scale: 1.08 }
                  }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="w-full h-full object-cover"
                />
              </Link>

              {/* Price badge */}
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/85 backdrop-blur-xl rounded-full z-10 pointer-events-none">
                <span className="text-[10px] font-black text-white tracking-wide">
                  {formatNaira(product.basePrice)}
                </span>
              </div>

              {/* Desktop Add to Cart (Slides up on hover only) */}
              <motion.button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                variants={{
                  initial: { y: 60, opacity: 0 },
                  hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="hidden md:flex absolute bottom-4 left-4 right-4 h-12 bg-[#E1784F] hover:bg-[#d0673e] text-white rounded-2xl font-black text-[10px] capitalize tracking-widest items-center justify-center gap-2 shadow-lg active:scale-95 z-20 cursor-pointer"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </motion.button>
            </div>

            {/* Details + Mobile Permanent Button */}
            <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
              <Link href={`/marketplace/${product.id}`} className="block space-y-2">
                {product.verifiedShop && (
                  <div className="flex items-center gap-1.5">
                    <BadgeCheck size={12} className="text-[#4DB6AC]" />
                    <span className="text-[9px] font-black capitalize tracking-widest text-[#4DB6AC]">Verified Shop</span>
                  </div>
                )}
                <h3 className="text-sm font-black italic leading-snug line-clamp-2 hover:text-[#E1784F] transition-colors">
                  {product.name}
                </h3>
              </Link>

              {/* Mobile Add to Cart (Always visible on small screens) */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className="md:hidden w-full h-12 bg-[#E1784F] active:bg-[#d0673e] text-white rounded-2xl font-black text-[10px] capitalize tracking-widest flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
              >
                <ShoppingCart size={14} />
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
</section>

      {/* 📜 4. THE MANIFESTO */}
      <section className="py-24 md:py-40 px-6 text-center">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center">
          
          <Image
          src="/logo.png" alt="AfridmaAI Logo" width={210} height={210}
          className="mb-12 mx-auto object-contain"
            />
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.9] max-w-5xl text-black dark:text-white">
            &quot;Heritage is <br /> our <span className="text-[#4DB6AC]">Foundation</span>, <br /> Skin is our <span className="text-[#E1784F]">Legacy</span>.&quot;
          </h2>
          <p className="text-[10px] font-black tracking-[0.5em] opacity-20 mt-16 italic">A Founder&apos;s Promise</p>
        </div>
      </section>

      {/* 5. CARE SOLUTIONS
      <section id="features" className="py-24 md:py-40 px-6 bg-gray-50/50 dark:bg-white/5">
        <div className="max-w-screen-xl mx-auto space-y-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: "Check Skin", icon: Camera, text: "A precision scan to verify your skin health.", path: "/public-scan", color: "#E1784F" },
              { title: "Safe Choice", icon: ShieldCheck, text: "Verify if your products are safe for melanin.", path: "/ingredient-analyzer", color: "#4DB6AC" }
            ].map((f) => (
              <div key={f.title} onClick={() => f.path === "/public-scan" ? router.push(f.path) : handleFeatureAccess(f.path)} className="group p-8 md:p-12 lg:p-16 bg-white dark:bg-black border border-black/5 dark:border-white/5 rounded-[2.5rem] md:rounded-[4rem] hover:border-[#E1784F] transition-all cursor-pointer shadow-sm">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-10 text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3" style={{ backgroundColor: f.color }}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-4xl font-black italic capitalize tracking-tighter mb-4 leading-none">{f.title}</h3>
                <p className="text-[12px] font-bold capitalize tracking-widest opacity-30 leading-relaxed mb-10 max-w-xs">{f.text}</p>
                <div className="flex items-center gap-4 text-[10px] font-black capitalize tracking-widest" style={{ color: f.color }}>
                  Start Now <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* 5. PEDIGREE */}
      <PedigreeSection />

      {/* 6. CARE HUB + BRAND CTA */}
      <CareHubSection />

      {/* 7. FAQ SECTION */}
      <FaqChatbot />

      {/* 8. TEAM MEMBERS */}
      <TeamMemberSection />

      {/* 9. Footer rendered by app-wrapper.tsx */}
    </div>
  )
}