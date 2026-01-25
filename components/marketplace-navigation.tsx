/**
 * 🛡️ AFRIDAM CARE HUB: NAVIGATION (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: Direct Portal access and Mobile-First State Sync.
 */

"use client"

import { useAuth } from '@/providers/auth-provider'
import { useTheme } from '@/providers/theme-provider'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { Menu, Moon, ShoppingBag, Sun, X, LogOut, LayoutDashboard } from 'lucide-react'
import { UserProfile } from './user-profile'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface NavigationProps {
    onSignInClick: () => void
    onSignUpClick: () => void
    onViewProfileClick?: () => void
}

export default function MarketplaceNavigation({ onSignInClick, onSignUpClick, onViewProfileClick }: NavigationProps) {
    const { theme, toggleTheme } = useTheme()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { user, signOut, isLoading } = useAuth()
    const router = useRouter()
    const isDark = theme === "dark"

    // 🛡️ RE-ENFORCED: Smooth mobile overlay transition
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => { document.body.style.overflow = 'unset' }
    }, [mobileMenuOpen])

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/dashboard", label: "Dashboard" }, // 🚀 SYNC: Direct access to scanner
        { href: "/marketplace", label: "Care Shop" },
        { href: "/contact", label: "Support" },
    ]

    return (
        <nav className="sticky top-0 z-[100] bg-background/80 backdrop-blur-2xl border-b border-border transition-all">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                <div className="flex justify-between items-center h-20 md:h-24">
                    
                    {/* 🌍 BRAND LOGO */}
                    <Link href="/" className="flex items-center gap-3 active:scale-95 transition-transform text-left">
                        <img 
                          src="/logo.png" 
                          alt="AfriDam AI" 
                          className="h-10 md:h-12 w-auto object-contain dark:invert" 
                        />
                        <div className="hidden sm:block border-l border-border/50 pl-3">
                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Care Hub</p>
                        </div>
                    </Link>

                    {/* Desktop Links (Clean Tracking) */}
                    <div className="hidden lg:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-[#E1784F] transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Action Hub */}
                    <div className="flex items-center gap-3 md:gap-5 text-left">
                        
                        <button onClick={toggleTheme} className="p-3 rounded-2xl bg-muted/50 border border-border text-foreground hover:bg-muted transition-all">
                            {isDark ? <Sun size={18} className="text-[#E1784F]" /> : <Moon size={18} />}
                        </button>

                        <button
                            onClick={() => router.push("/marketplace/cart")}
                            className="relative p-3 rounded-2xl bg-[#E1784F]/10 border border-[#E1784F]/20 text-[#E1784F] hover:bg-[#E1784F] hover:text-white transition-all active:scale-90"
                        >
                            <ShoppingBag size={18} />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E1784F] text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-background">
                                0
                            </span>
                        </button>

                        <div className="hidden md:block">
                            <UserProfile
                                onSignInClick={onSignInClick}
                                onSignUpClick={onSignUpClick}
                                onViewProfileClick={onViewProfileClick}
                            />
                        </div>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-3 rounded-2xl bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20"
                        >
                            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-0 top-20 z-[90] bg-background lg:hidden p-8 flex flex-col text-left"
                    >
                        <div className="flex-grow space-y-4">
                            <p className="text-[9px] font-black text-[#E1784F] uppercase tracking-[0.4em] mb-6">Care Hub Node</p>
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block px-8 py-5 rounded-[2rem] bg-card border border-border text-lg font-black uppercase italic tracking-tighter"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="pt-8 border-t border-border text-left">
                            {!user && !isLoading ? (
                                <button 
                                    onClick={() => { setMobileMenuOpen(false); onSignUpClick(); }}
                                    className="w-full py-6 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-xl"
                                >
                                    Join The Hub
                                </button>
                            ) : user && (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-3xl mb-4">
                                        <div className="w-10 h-10 rounded-full bg-[#E1784F] flex items-center justify-center text-white text-xs font-black italic">
                                            {user.firstName?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-tighter">{user.firstName} {user.lastName}</p>
                                            <p className="text-[8px] opacity-40 uppercase font-bold tracking-widest">Active Profile</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                        className="w-full py-6 bg-red-500/10 text-red-500 rounded-[2rem] font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3"
                                    >
                                        <LogOut size={16} /> End Session
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}