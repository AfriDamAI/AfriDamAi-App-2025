"use client"

import { useAuth } from "@/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { EditProfileForm } from "@/components/edit-profile-form"
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Calendar, 
  Activity, 
  Flame, 
  Database, 
  ChevronLeft,
  Loader2,
  Zap
} from "lucide-react"

const TABS = ["Overview", "Edit Profile"]

export default function ProfilePage() {
    const { user, isSignedIn, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("Overview")

    useEffect(() => {
        if (!authLoading && !isSignedIn) {
            router.push("/")
        }
    }, [isSignedIn, authLoading, router])

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-[#E1784F] w-10 h-10" />
            </div>
        )
    }

    const displayName = user.firstName || (user.email ? user.email.split('@')[0] : "User");

    const stats = [
        { label: "Health Score", value: "85%", icon: <Activity className="w-5 h-5 text-[#4DB6AC]" /> },
        { label: "Routine Streak", value: "12 Days", icon: <Flame className="w-5 h-5 text-[#E1784F]" /> },
        { label: "Consultations", value: "3", icon: <Calendar className="w-5 h-5 text-blue-400" /> },
        { label: "Clinical Pts", value: "450", icon: <Database className="w-5 h-5 text-purple-400" /> },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-[#E1784F]/30 transition-colors duration-500">
            
            {/* 1. PREMIUM BRANDED HEADER */}
            <div className="relative h-64 bg-gradient-to-r from-[#E1784F] via-[#C55A32] to-[#1C1A19] overflow-hidden">
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
                
                <div className="absolute top-8 left-8 flex items-center gap-6 z-20">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-[#E1784F] transition-all shadow-lg"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    {/* LOGO IN TOP LEFT */}
                    <img 
                        src="/logo.png" 
                        alt="AfriDam AI Logo" 
                        className="h-16 w-auto object-contain drop-shadow-[0_0_20px_rgba(0,0,0,0.5)] cursor-pointer"
                        onClick={() => router.push('/')}
                    />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-24 relative z-10 pb-20">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-[4rem] shadow-2xl overflow-hidden transition-colors"
                >
                    <div className="p-10 md:p-16">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
                            {/* Avatar Node */}
                            <div className="relative group">
                                <div className="w-40 h-40 rounded-[3rem] bg-gradient-to-br from-[#E1784F] to-[#4DB6AC] p-1 shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
                                    <div className="w-full h-full rounded-[2.8rem] bg-background flex items-center justify-center overflow-hidden">
                                        <span className="text-6xl font-black text-foreground italic uppercase">
                                            {(displayName).charAt(0)}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#4DB6AC] border-4 border-card rounded-2xl flex items-center justify-center text-black shadow-xl">
                                    <ShieldCheck size={24} />
                                </div>
                            </div>

                            <div className="flex-1 text-center md:text-left space-y-4">
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tighter italic uppercase leading-none">{displayName}</h1>
                                    
                                    {/* FIXED: PREMIUM USER LABEL */}
                                    <span className="inline-flex items-center px-6 py-2 rounded-full text-[10px] font-black bg-[#4DB6AC]/10 text-[#4DB6AC] border border-[#4DB6AC]/20 uppercase tracking-[0.3em]">
                                        Premium User
                                    </span>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 text-muted-foreground font-bold text-[10px] uppercase tracking-[0.4em]">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-[#E1784F]" /> {user.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-[#4DB6AC]" /> Clinical ID: {user.id?.slice(0, 8).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Hub */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-muted p-8 rounded-[2.5rem] border border-border hover:border-[#E1784F]/30 transition-all group">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="p-3 bg-background rounded-xl group-hover:scale-110 transition-transform shadow-sm">
                                            {stat.icon}
                                        </div>
                                        <span className="text-2xl font-black text-foreground italic tracking-tighter">{stat.value}</span>
                                    </div>
                                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="px-10 border-t border-border bg-muted/30">
                        <nav className="flex gap-6 py-6 overflow-x-auto no-scrollbar">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === tab
                                            ? "bg-[#E1784F] text-white shadow-xl shadow-[#E1784F]/20"
                                            : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                </motion.div>

                {/* Content Sections */}
                <div className="mt-16">
                    {activeTab === 'Edit Profile' ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <EditProfileForm />
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <div className="md:col-span-1 space-y-10">
                                <div className="bg-card border border-border rounded-[3.5rem] p-10 shadow-xl">
                                    <h3 className="text-xl font-black italic mb-10 flex items-center gap-4 uppercase tracking-tight text-foreground">
                                        <Activity className="text-[#4DB6AC] w-6 h-6" /> Biometrics
                                    </h3>
                                    <div className="space-y-10">
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">Primary Skin Type</p>
                                            <p className="text-xl font-bold text-foreground italic uppercase tracking-tight">{user.profile?.skinType || "Awaiting Scan"}</p>
                                        </div>
                                        <div className="h-px bg-border" />
                                        <div>
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">Clinical Sex</p>
                                            <p className="text-xl font-bold text-foreground italic uppercase tracking-tight">{user.sex || "Not Registered"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 space-y-10">
                                {/* CTA: INSTANT AI ANALYSIS */}
                                <div 
                                    className="bg-gradient-to-br from-[#E1784F] to-[#C55A32] rounded-[4rem] p-12 lg:p-16 text-white relative overflow-hidden group shadow-2xl cursor-pointer" 
                                    onClick={() => router.push('/ai-scanner')}
                                >
                                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="relative z-10 space-y-8">
                                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                                            <Zap className="w-8 h-8 text-white fill-white" />
                                        </div>
                                        <h4 className="text-5xl md:text-6xl font-black mb-4 italic uppercase tracking-tighter leading-none">
                                            Instant <br /> AI Analysis
                                        </h4>
                                        <p className="text-white/80 font-medium max-w-sm text-lg leading-tight">Sync your clinical profile with our vision node to unlock hyper-personalized health targets.</p>
                                        <button className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-2xl uppercase tracking-[0.2em] text-[10px]">
                                            Launch Scanner Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}