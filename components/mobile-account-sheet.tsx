"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { History, Settings, Moon, Sun, LogOut, X } from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { useTheme } from "@/providers/theme-provider"
import { motion, AnimatePresence } from "framer-motion"

interface MobileAccountSheetProps {
    isOpen: boolean
    onClose: () => void
}

/**
 * 📱 MOBILE ACCOUNT SHEET
 * Slide-up bottom sheet that surfaces the actions hidden behind the
 * lg-only sidebar / md-only profile dropdown: Clinical Diary, Settings,
 * Theme toggle and Sign Out. Tap the backdrop or the grab handle to dismiss.
 */
export function MobileAccountSheet({ isOpen, onClose }: MobileAccountSheetProps) {
    const router = useRouter()
    const { user, signOut } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const isDark = theme === "dark"

    const firstName = user?.firstName || "User"
    const initials = `${user?.firstName?.charAt(0) || ""}${user?.lastName?.charAt(0) || ""}`.toUpperCase() || "U"
    const planName = (user as any)?.plan?.name || "Free Plan"

    // 🔒 Lock page scroll while the sheet is open
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "unset"
        return () => { document.body.style.overflow = "unset" }
    }, [isOpen])

    const go = (path: string) => {
        onClose()
        router.push(path)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="account-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10000] lg:hidden flex items-end"
                >
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                        dragElastic={{ top: 0, bottom: 0.6 }}
                        onDragEnd={(_event, info) => {
                            if (info.offset.y > 120 || info.velocity.y > 500) onClose()
                        }}
                        onClick={(event) => event.stopPropagation()}
                        className="w-full bg-background border-t border-border rounded-t-[2rem] shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] touch-none"
                    >
                        {/* Grab handle — drag down to dismiss */}
                        <div className="flex justify-center pt-3 pb-1 cursor-grab active:cursor-grabbing">
                            <div className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                        </div>

                        {/* Header — who you are */}
                        <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
                            <div className="w-12 h-12 rounded-2xl bg-[#E1784F] flex items-center justify-center text-white text-sm font-black italic shadow-lg shrink-0">
                                {initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-sm font-black uppercase tracking-tight italic text-foreground truncate">{firstName}</span>
                                <span className="text-[9px] font-bold text-[#4DB6AC] uppercase tracking-widest truncate">{planName}</span>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close menu"
                                className="ml-auto p-2 rounded-xl bg-muted/50 hover:bg-muted border border-border shrink-0"
                            >
                                <X size={16} className="text-[#E1784F]" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="p-4 space-y-2">
                            <button
                                onClick={() => go("/history")}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-foreground bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-all"
                            >
                                <History size={20} className="text-[#E1784F] shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-widest">Clinical Diary</span>
                            </button>

                            <button
                                onClick={() => go("/settings")}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-foreground bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-all"
                            >
                                <Settings size={20} className="text-[#E1784F] shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-widest">Settings</span>
                            </button>

                            <button
                                onClick={toggleTheme}
                                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-foreground bg-gray-100 dark:bg-white/[0.06] hover:bg-gray-200 dark:hover:bg-white/[0.12] transition-all"
                            >
                                {isDark
                                    ? <Sun size={20} className="text-[#E1784F] shrink-0" />
                                    : <Moon size={20} className="text-[#E1784F] shrink-0" />}
                                <span className="text-xs font-bold uppercase tracking-widest">Theme</span>
                                <span className="ml-auto text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                    {isDark ? "Dark" : "Light"}
                                </span>
                            </button>

                            {/* Sign Out — fitted & centered to avoid accidental taps */}
                            <div className="flex justify-center pt-3">
                                <button
                                    onClick={() => { onClose(); signOut(); }}
                                    className="w-fit flex items-center gap-2.5 px-6 py-2.5 rounded-2xl text-red-500 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
                                >
                                    <LogOut size={16} className="shrink-0" />
                                    <span className="text-[11px] font-bold uppercase tracking-widest">Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
