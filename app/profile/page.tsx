"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { EditProfileForm } from "@/components/edit-profile-form"
import { uploadAvatar } from "@/lib/api-client"
import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button" // 🛠️ FIXED: Added missing import
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Heart, 
  Award, 
  ChevronLeft,
  Loader2,
  Zap,
  Camera,
  CheckCircle2,
  Sparkles,
  Fingerprint,
  ArrowRight,
  AlertTriangle,
  History,
  Trash2,
  Globe,
  Activity
} from "lucide-react"

const TABS = ["Overview", "Edit Profile"]

export default function ProfilePage() {
    const { user, isSignedIn, isLoading: authLoading, refreshUser, deleteAccount } = useAuth()
    const { theme } = useTheme()
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    
    const [activeTab, setActiveTab] = useState("Overview")
    const [isUploading, setIsUploading] = useState(false)
    const [uploadSuccess, setUploadSuccess] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const isDark = theme === "dark"

    useEffect(() => {
        if (!authLoading && !isSignedIn) {
            router.push("/")
        }
    }, [isSignedIn, authLoading, router])

    const handleAvatarClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            setIsUploading(true)
            await uploadAvatar(file)
            await refreshUser() 
            setUploadSuccess(true)
            setTimeout(() => setUploadSuccess(false), 3000)
        } catch (error) {
            console.error("Avatar upload failed:", error)
        } finally {
            setIsUploading(false)
        }
    }

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            router.push("/");
        } catch (err) {
            console.error("Deletion failed", err);
        }
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-[#E1784F] w-10 h-10" />
            </div>
        )
    }

    const displayName = user.firstName || (user.email ? user.email.split('@')[0] : "Friend");

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-[#E1784F]/30 transition-colors duration-500 font-sans overflow-x-hidden relative">
            
            {/* 1. BRANDED HEADER */}
            <div className="relative h-72 bg-gradient-to-br from-[#E1784F] via-[#F0A287] to-[#C55A32] overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-10 left-10 flex items-center gap-6 z-20">
                    <button onClick={() => router.push('/dashboard')} className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#E1784F] transition-all">
                        <ChevronLeft size={20} />
                    </button>
                    <img src="/logo.png" alt="AfriDam" className={`h-10 w-auto object-contain cursor-pointer ${isDark ? '' : 'brightness-0 invert'}`} onClick={() => router.push('/')} />
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-24 relative z-10 pb-24">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-[3.5rem] shadow-2xl overflow-hidden">
                    <div className="p-10 md:p-14">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
                            {/* Avatar Node */}
                            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                                <div className={`w-36 h-36 rounded-[2.5rem] bg-gradient-to-br from-[#E1784F] to-[#F0A287] p-1 shadow-2xl ${isUploading ? 'animate-pulse' : ''}`}>
                                    <div className="w-full h-full rounded-[2.3rem] bg-background flex items-center justify-center overflow-hidden relative border-4 border-card">
                                        {user.profile?.avatarUrl ? <img src={user.profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" /> : <span className="text-4xl font-black italic uppercase">{(displayName).charAt(0)}</span>}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity">
                                            {isUploading ? <Loader2 className="text-white animate-spin" /> : <Camera className="text-white w-6 h-6" />}
                                        </div>
                                    </div>
                                </div>
                                <div className={`absolute -bottom-1 -right-1 w-9 h-9 border-4 border-card rounded-xl flex items-center justify-center shadow-xl ${uploadSuccess ? 'bg-green-500' : 'bg-foreground text-background'}`}>
                                    {uploadSuccess ? <CheckCircle2 size={16} className="text-white" /> : <ShieldCheck size={16} />}
                                </div>
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-4">
                                <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter italic uppercase leading-none">{displayName}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-muted-foreground font-black text-[9px] uppercase tracking-widest opacity-60">
                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3 text-[#E1784F]" /> {user.email}</div>
                                    <div className="flex items-center gap-2"><Globe className="w-3 h-3 text-[#4DB6AC]" /> {user.profile?.nationality || "Global Node"}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-10 border-t border-border bg-muted/20">
                        <nav className="flex gap-4 py-6">
                            {TABS.map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`px-10 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? "bg-[#E1784F] text-white shadow-xl shadow-[#E1784F]/20" : "text-muted-foreground hover:text-foreground"}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </motion.div>

                {/* Content Sections */}
                <div className="mt-12">
                    {activeTab === 'Edit Profile' ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <EditProfileForm />
                            
                            {/* DIGNITY ZONE - Account Deletion */}
                            <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 mt-12">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="space-y-2 text-center md:text-left">
                                        <h3 className="text-red-500 font-black italic uppercase tracking-tight text-lg flex items-center justify-center md:justify-start gap-3">
                                            <Trash2 size={20} /> Account Dignity Zone
                                        </h3>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                                            Delete your data and clinical history permanently. <br/> This action cannot be undone.
                                        </p>
                                    </div>
                                    <Button 
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="bg-red-500 text-white font-black uppercase text-[10px] tracking-widest px-10 h-14 rounded-xl shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all border-none"
                                    >
                                        Delete My Data
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* RECENT SCAN SUMMARY */}
                            <div className="md:col-span-2">
                                <div className="bg-card border border-border rounded-[3rem] p-10 shadow-sm relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4DB6AC]/5 blur-3xl rounded-full" />
                                    <div className="flex justify-between items-center mb-10">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground flex items-center gap-3">
                                            <History className="text-[#4DB6AC]" size={24} /> Recent Analysis
                                        </h3>
                                        <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Verified Report</span>
                                    </div>
                                    
                                    <div className="p-8 bg-muted/50 rounded-[2rem] border border-border flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="space-y-2">
                                            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-[#4DB6AC]">Clinical Result</p>
                                            <h4 className="text-2xl font-black italic uppercase tracking-tighter text-foreground">Healthy & Radiant Base</h4>
                                        </div>
                                        <button onClick={() => router.push('/ai-scanner')} className="w-12 h-12 bg-[#E1784F] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                                            <Zap size={20} fill="currentColor" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* MEDICAL NODE */}
                            <div className="md:col-span-1">
                                <div className="bg-[#1C1A19] dark:bg-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden text-white dark:text-[#1C1A19]">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-[#E1784F]/20 blur-3xl rounded-full" />
                                    <h3 className="text-lg font-black italic uppercase mb-8 flex items-center gap-3">
                                        <Activity className="text-[#E1784F]" size={20} /> Medical Node
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-2">Skin Type</p>
                                            <p className="text-lg font-black italic uppercase">{user.profile?.skinType || "Pending"}</p>
                                        </div>
                                        <div className="h-px bg-white/10 dark:bg-black/10" />
                                        <div>
                                            <p className="text-[8px] font-black uppercase tracking-widest opacity-40 mb-2">Allergies</p>
                                            <p className="text-[11px] font-bold leading-relaxed">{user.profile?.allergies || "None logged."}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DELETE ACCOUNT MODAL */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDeleteConfirm(false)} className="absolute inset-0 bg-black/95 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-card border border-red-500/20 rounded-[3rem] p-10 max-w-sm w-full text-center space-y-8 shadow-2xl">
                            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-2xl font-black italic uppercase tracking-tighter">Are you sure?</h4>
                                <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest leading-loose">Erasing your clinical history is permanent.</p>
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} className="h-14 rounded-xl font-black uppercase text-[10px] tracking-widest">Keep My Data</Button>
                                <Button onClick={handleDeleteAccount} className="h-14 bg-red-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-500/20 border-none">Delete Everything</Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}