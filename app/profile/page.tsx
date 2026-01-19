/**
 * 🛡️ AFRIDAM CLINICAL IDENTITY: PROFILE
 * Version: 2026.1.2 (Premium Editorial Refactor)
 * Handshake: Fully synced with Render Backend
 * Focus: High-Contrast, Deep Ambiance, Profile Persistence.
 */

"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  ChevronLeft, 
  ShieldCheck, 
  Loader2, 
  LogOut,
  Save,
  Fingerprint
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import apiClient from "@/lib/api-client" // 🛡️ DIRECT BACKEND SYNC

export default function ProfilePage() {
  const { user, signOut, mutate } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile?.avatarUrl || null)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phoneNo: user?.phoneNo || "",
  })

  // 🛡️ OGA SYNC: Redirect if session is lost
  useEffect(() => {
    if (!user) router.push("/")
  }, [user, router])

  // 🛡️ AVATAR PERSISTENCE LOGIC
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setUploadingAvatar(true)

    try {
      const data = new FormData()
      data.append('file', file) 

      // 🚀 HITTING THE RENDER BACKEND
      const response = await apiClient.post('/users/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      // Refresh global state so the photo stays on the Dashboard
      await mutate()
    } catch (err) {
      console.error("Avatar sync failed.")
      alert("Failed to save image to cloud.")
    } finally {
      setUploadingAvatar(false)
    }
  }

  // 🛡️ PROFILE DATA PERSISTENCE
  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      // 🚀 UPDATING THE PERMANENT DATABASE RECORD
      await apiClient.put(`/users/${user?.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNo: formData.phoneNo
      })
      
      await mutate()
      alert("PROFILE SYNCED SUCCESSFULLY.")
    } catch (err) {
      console.error("Profile sync failed.")
      alert("Engine room error. Retry.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white selection:bg-[#E1784F]/30 transition-colors duration-500 overflow-x-hidden relative">
      
      {/* --- PREMIUM AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(77,182,172,0.05),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-20 relative z-10 space-y-20">
        
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-8">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-[#4DB6AC] transition-all"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
              Return to Hub
            </button>
            <div className="space-y-4">
                <h1 className="text-6xl md:text-9xl font-black italic tracking-[-0.05em] uppercase leading-[0.8] text-black dark:text-white">
                  My <br /> <span className="text-[#4DB6AC]">Profile</span>
                </h1>
                <p className="text-[10px] md:text-[12px] font-black uppercase tracking-[0.5em] opacity-40">Clinical Practitioner ID: {user.id?.slice(0,8)}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut?.()} 
            className="px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-3 shadow-sm"
          >
            <LogOut size={16} /> Terminate Session
          </button>
        </header>

        <section className="grid lg:grid-cols-2 gap-20 items-start">
           {/* AVATAR PORTAL */}
           <div className="flex flex-col items-center lg:items-start gap-10">
              <div className="relative group">
                 <div className="w-64 h-64 md:w-80 md:h-80 rounded-[4rem] overflow-hidden bg-gray-100 dark:bg-white/5 border-[8px] border-white dark:border-[#1A1A1A] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] transition-all group-hover:scale-[1.02]">
                   {previewUrl ? (
                     <img src={previewUrl} className="w-full h-full object-cover" alt="Practitioner" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center opacity-10">
                       <User size={100} strokeWidth={1} />
                     </div>
                   )}
                   {uploadingAvatar && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center space-y-4">
                       <Loader2 className="animate-spin text-[#4DB6AC]" size={32} />
                       <p className="text-[9px] font-black uppercase tracking-widest text-white">Syncing Image</p>
                     </div>
                   )}
                 </div>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#4DB6AC] text-white rounded-3xl flex items-center justify-center shadow-2xl hover:scale-110 transition-all border-[6px] border-white dark:border-[#050505]"
                 >
                   <Camera size={28} />
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <div className="space-y-4 text-center lg:text-left">
                 <h3 className="text-4xl font-black italic uppercase tracking-tighter">Practitioner Metadata</h3>
                 <p className="text-sm font-medium opacity-40 leading-relaxed max-w-sm">Your clinical profile is the anchor for your AI analysis history. Keep it updated for accurate diagnosis tracking.</p>
              </div>
           </div>

           {/* DATA ENTRY GRID */}
           <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-6">First Identity</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-7 px-10 font-bold focus:border-[#4DB6AC] outline-none transition-all text-lg uppercase tracking-tight"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-6">Last Identity</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-7 px-10 font-bold focus:border-[#4DB6AC] outline-none transition-all text-lg uppercase tracking-tight"
                    />
                 </div>
                 <div className="space-y-4 md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-6">Communication Bridge (Email)</label>
                    <div className="relative">
                      <Mail className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20" size={20} />
                      <input 
                        type="email" 
                        disabled
                        value={user.email}
                        className="w-full bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-[2rem] py-7 pl-20 pr-10 font-bold opacity-30 cursor-not-allowed text-lg uppercase tracking-tight"
                      />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-6">Mobile Contact</label>
                    <div className="relative">
                      <Phone className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20" size={20} />
                      <input 
                        type="tel" 
                        value={formData.phoneNo}
                        onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2rem] py-7 pl-20 pr-10 font-bold focus:border-[#4DB6AC] outline-none transition-all text-lg uppercase tracking-tight"
                      />
                    </div>
                 </div>
                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 ml-6">Region Access</label>
                    <div className="relative">
                      <MapPin className="absolute left-10 top-1/2 -translate-y-1/2 opacity-20" size={20} />
                      <input 
                        type="text" 
                        disabled
                        value={user.profile?.country || "Nigeria"}
                        className="w-full bg-gray-100 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 rounded-[2rem] py-7 pl-20 pr-10 font-bold opacity-30 text-lg uppercase tracking-tight"
                      />
                    </div>
                 </div>
              </div>

              <div className="pt-10 space-y-8">
                 <button 
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="w-full h-24 bg-[#4DB6AC] text-white rounded-[2.5rem] font-black uppercase text-[12px] tracking-[0.5em] shadow-[0_30px_60px_rgba(77,182,172,0.3)] active:scale-[0.97] transition-all flex items-center justify-center gap-4 group"
                 >
                   {isUpdating ? <Loader2 className="animate-spin" /> : <>Sync Profile Changes <Save size={20} className="group-hover:scale-125 transition-transform" /></>}
                 </button>

                 <div className="flex flex-col items-center gap-4 opacity-30">
                    <div className="flex items-center gap-3">
                       <ShieldCheck size={14} className="text-[#4DB6AC]" />
                       <p className="text-[9px] font-black uppercase tracking-[0.4em]">Clinical Identity Guard</p>
                    </div>
                    <Fingerprint size={24} />
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}