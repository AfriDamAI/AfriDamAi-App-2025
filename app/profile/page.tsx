/**
 * 🛡️ AFRIDAM IDENTITY: PROFILE (Rule 7 Precision Sync)
 * Version: 2026.1.25
 * Focus: High-Precision Patch Handshake & Mobile-First Data Entry.
 */

"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
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
  Fingerprint,
  CheckCircle2
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { apiClient } from "@/lib/api-client" 

export default function ProfilePage() {
  const { user, signOut, mutate } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [isUpdating, setIsUpdating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile?.avatarUrl || null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    ageRange: 0,
    skinType: "",
    skinToneLevel: 0,
  })

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
        ageRange: user.profile?.ageRange || 0,
        skinType: user.profile?.skinType || "",
        skinToneLevel: user.profile?.skinToneLevel || 0,
      })
    }
  }, [user])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setUploadingAvatar(true)

    try {
      const data = new FormData()
      data.append('file', file) 

      // 🚀 THE HANDSHAKE: Synced with NestJS UserModule upload
      await apiClient.post('/user/avatar', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      await mutate()
    } catch (err) {
      console.log("Photo sync pending...")
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    if (!user?.id) return
    setIsUpdating(true)
    setIsSuccess(false)
    try {
      /**
       * 🛡️ RULE 7 SYNC: 
       * Using PATCH /user/:id to match UserService and api-client logic.
       */
      await apiClient.patch(`/user/${user.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNo: formData.phoneNo,
        profile: {
          ageRange: formData.ageRange,
          skinType: formData.skinType,
          skinToneLevel: formData.skinToneLevel,
        }
      })
      
      await mutate()
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (err) {
      console.log("Profile update paused - check internet")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <main className="min-h-[100svh] bg-white dark:bg-[#050505] text-black dark:text-white transition-colors duration-500 pb-12 text-left">
      
      {/* --- SOFT AMBIANCE --- */}
      <div className="absolute top-0 left-0 w-full h-[400px] bg-[radial-gradient(circle_at_50%_0%,rgba(225,120,79,0.08),transparent_70%)] pointer-events-none" />

      <div className="max-w-screen-xl mx-auto px-4 py-6 lg:py-10 relative z-10 space-y-8">
        
        {/* WORLD-CLASS HEADER */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-3">
            <button 
              onClick={() => router.push('/dashboard')}
              className="group flex items-center gap-2 text-[9px] font-black tracking-[0.2em] text-[#E1784F] transition-all"
            >
              <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Back home
            </button>
            <div className="space-y-1">
                <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter leading-[0.8] text-black dark:text-white">
                  My <br /> <span className="text-[#E1784F]">Profile</span>
                </h1>
                <p className="text-[8px] font-black tracking-[0.3em] opacity-30">Member: {user.id?.slice(0,8)}</p>
            </div>
          </div>
          <button 
            onClick={() => signOut?.()} 
            className="px-5 py-3 bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl text-[8px] font-black tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 active:scale-95"
          >
            <LogOut size={14} /> Log Out
          </button>
        </header>

        <section className="grid lg:grid-cols-2 gap-8 items-start">
           {/* AVATAR PORTAL */}
           <div className="flex flex-col items-center lg:items-start gap-6">
              <div className="relative group">
                 <div className="w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden bg-gray-50 dark:bg-white/5 border-2 border-white dark:border-white/10 shadow-lg transition-all">
                   {previewUrl ? (
                     <img src={previewUrl} className="w-full h-full object-cover" alt="User" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center opacity-10">
                       <User size={60} strokeWidth={1} />
                     </div>
                   )}
                   {uploadingAvatar && (
                     <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center space-y-2">
                       <Loader2 className="animate-spin text-white" size={20} />
                       <p className="text-[7px] font-black tracking-widest text-white">Saving photo...</p>
                     </div>
                   )}
                 </div>
                 <button 
                   onClick={() => fileInputRef.current?.click()}
                   className="absolute -bottom-2 -right-2 w-11 h-11 bg-[#E1784F] text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 active:scale-90 transition-all border-2 border-white dark:border-[#050505]"
                 >
                   <Camera size={18} />
                 </button>
                 <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange} />
              </div>
              <div className="space-y-2">
                 <h3 className="text-xl font-black italic tracking-tighter leading-none">My Identity</h3>
                 <p className="text-[10px] font-bold opacity-40 leading-relaxed max-w-sm tracking-tight">Updating your profile helps us personalize your skin journey. Keep your details current for the best results.</p>
              </div>
           </div>

           {/* DATA ENTRY GRID */}
           <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">First Name</label>
                        <input 
                        type="text" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 px-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm tracking-tight shadow-inner"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">Last Name</label>
                        <input 
                        type="text" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 px-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm tracking-tight shadow-inner"
                        />
                    </div>
                 </div>
                
                 <div className="space-y-2">
                    <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                      <input 
                        type="email" 
                        disabled
                        value={user.email}
                        className="w-full bg-gray-100 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl py-4 pl-12 pr-5 font-bold opacity-30 cursor-not-allowed text-sm tracking-tight"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                      <input 
                        type="tel" 
                        value={formData.phoneNo}
                        onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 pl-12 pr-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm tracking-tight shadow-inner"
                        placeholder="Mobile Number"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">Home Region</label>
                    <div className="relative">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 opacity-20" size={14} />
                      <input 
                        type="text" 
                        disabled
                        value={user.profile?.country || "Nigeria"}
                        className="w-full bg-gray-100 dark:bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-xl py-4 pl-12 pr-5 font-bold opacity-30 text-sm tracking-tight"
                      />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">Age</label>
                    <input 
                      type="number" 
                      value={formData.ageRange}
                      onChange={(e) => setFormData({...formData, ageRange: parseInt(e.target.value) || 0})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 px-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm tracking-tight shadow-inner"
                      placeholder="Your Age"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">Skin Type</label>
                    <input 
                      type="text" 
                      value={formData.skinType}
                      onChange={(e) => setFormData({...formData, skinType: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 px-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm tracking-tight shadow-inner"
                      placeholder="e.g., Brown, Dark, Light"
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[8px] font-black tracking-[0.2em] opacity-30 ml-3">Skin Tone Level (1-6)</label>
                    <input 
                      type="number" 
                      min="1"
                      max="6"
                      value={formData.skinToneLevel}
                      onChange={(e) => setFormData({...formData, skinToneLevel: parseInt(e.target.value) || 0})}
                      className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl py-4 px-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm tracking-tight shadow-inner"
                      placeholder="Fitzpatrick Scale (1-6)"
                    />
                 </div>
              </div>

              <div className="pt-4 space-y-4">
                 <button 
                  onClick={handleSaveProfile}
                  disabled={isUpdating}
                  className={`w-full h-14 rounded-xl font-black text-[10px] tracking-[0.3em] shadow-lg active:scale-[0.97] transition-all flex items-center justify-center gap-2 ${
                      isSuccess ? 'bg-[#4DB6AC] text-white shadow-[#4DB6AC]/20' : 'bg-[#E1784F] text-white shadow-[#E1784F]/20'
                  }`}
                 >
                   {isUpdating ? <Loader2 className="animate-spin" /> : isSuccess ? <><CheckCircle2 size={16} /> Profile Updated</> : <>Save Changes <Save size={16} /></>}
                 </button>

                 <div className="flex flex-col items-center gap-2 opacity-20">
                    <div className="flex items-center gap-2">
                       <ShieldCheck size={10} className="text-[#4DB6AC]" />
                       <p className="text-[7px] font-black tracking-widest">Privacy verified</p>
                    </div>
                    <Fingerprint size={16} />
                 </div>
              </div>
           </div>
        </section>
      </div>
    </main>
  )
}
