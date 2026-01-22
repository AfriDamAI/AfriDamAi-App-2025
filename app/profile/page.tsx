/**
 * 🛡️ AFRIDAM IDENTITY: PROFILE (Rule 6 Synergy)
 * Version: 2026.1.22 (Soft Tone & Handshake Alignment)
 * Focus: Relatable Identity & Persistent Profile Data.
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
import apiClient from "@/lib/api-client" 

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

  useEffect(() => {
    if (!user) router.push("/")
  }, [user, router])

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
      await apiClient.post('/users/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      await mutate()
    } catch (err) {
      console.error("Photo save failed.")
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      await apiClient.put(`/users/${user?.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNo: formData.phoneNo
      })
      
      await mutate()
      // 🛡️ Rule 4: Soft English
      alert("Profile updated!")
    } catch (err) {
      console.error("Update failed.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 pb-20">
      
      {/* --- SOFT AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-6 py-10 lg:py-20 relative z-10 space-y-16">
        
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10 text-left">
          <div className="space-y-6">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#E1784F] transition-all"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
              Back to Hub
            </button>
            <div className="space-y-2">
                <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.8] text-black dark:text-white">
                  My <br /> <span className="text-[#E1784F]">Profile</span>
                </h1>
                <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">Member ID: {user.id?.slice(0,8)}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut?.()} 
            className="px-8 py-4 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-3 active:scale-95"
          >
            <LogOut size={16} /> Log Out
          </button>
        </header>

        <section className="grid lg:grid-cols-2 gap-16 items-start text-left">
           {/* AVATAR PORTAL */}
           <div className="flex flex-col items-center lg:items-start gap-10">
              <div className="relative group">
                 <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden bg-gray-50 dark:bg-white/5 border-4 border-white dark:border-white/10 shadow-2xl transition-all">
                   {previewUrl ? (
                     <img src={previewUrl} className="w-full h-full object-cover" alt="User" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center opacity-10">
                       <User size={100} strokeWidth={1} />
                     </div>
                   )}
                   {uploadingAvatar && (
                     <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center space-y-3">
                       <Loader2 className="animate-spin text-white" size={24} />
                       <p className="text-[8px] font-black uppercase tracking-widest text-white">Saving photo...</p>
                     </div>
                   )}
                 </div>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="absolute -bottom-3 -right-3 w-16 h-16 bg-[#E1784F] text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all border-4 border-white dark:border-[#050505]"
                 >
                   <Camera size={24} />
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <div className="space-y-4">
                 <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none">Your Identity</h3>
                 <p className="text-xs font-bold opacity-40 leading-relaxed max-w-sm uppercase tracking-tight">Your profile helps our AI keep your skin diary accurate. Keep your details fresh for better results.</p>
              </div>
           </div>

           {/* DATA ENTRY GRID */}
           <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 ml-4">First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[1.8rem] py-6 px-8 font-bold focus:border-[#E1784F] outline-none transition-all text-base uppercase tracking-tight shadow-inner"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 ml-4">Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[1.8rem] py-6 px-8 font-bold focus:border-[#E1784F] outline-none transition-all text-base uppercase tracking-tight shadow-inner"
                    />
                 </div>
                 <div className="space-y-3 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 ml-4">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                      <input 
                        type="email" 
                        disabled
                        value={user.email}
                        className="w-full bg-gray-100 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[1.8rem] py-6 pl-16 pr-8 font-bold opacity-30 cursor-not-allowed text-base uppercase tracking-tight"
                      />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 ml-4">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                      <input 
                        type="tel" 
                        value={formData.phoneNo}
                        onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[1.8rem] py-6 pl-16 pr-8 font-bold focus:border-[#E1784F] outline-none transition-all text-base uppercase tracking-tight shadow-inner"
                      />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 ml-4">Home Region</label>
                    <div className="relative">
                      <MapPin className="absolute left-8 top-1/2 -translate-y-1/2 opacity-20" size={16} />
                      <input 
                        type="text" 
                        disabled
                        value={user.profile?.country || "Nigeria"}
                        className="w-full bg-gray-100 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[1.8rem] py-6 pl-16 pr-8 font-bold opacity-30 text-base uppercase tracking-tight"
                      />
                    </div>
                 </div>
              </div>

              <div className="pt-6 space-y-6">
                 <button 
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className="w-full h-20 bg-[#E1784F] text-white rounded-[2rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-xl shadow-[#E1784F]/20 active:scale-[0.97] transition-all flex items-center justify-center gap-3"
                 >
                   {isUpdating ? <Loader2 className="animate-spin" /> : <>Save Changes <Save size={18} /></>}
                 </button>

                 <div className="flex flex-col items-center gap-3 opacity-20">
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={12} className="text-[#4DB6AC]" />
                       <p className="text-[8px] font-black uppercase tracking-widest">Your data is safe</p>
                    </div>
                    <Fingerprint size={20} />
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}