"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/providers/auth-provider"
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
  Save
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { user, signOut, updateProfile } = useAuth()
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

  // 🛡️ OGA FIX: AVATAR UPLOAD LOGIC
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 1. Show immediate preview
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setUploadingAvatar(true)

    try {
      const data = new FormData()
      data.append('file', file) // 🚀 Key must match backend @UploadedFile('file')

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: data,
      })

      if (!response.ok) throw new Error("Upload failed")
      
      const result = await response.json()
      // Update global auth state with new avatar URL
      if (updateProfile) updateProfile({ avatarUrl: result.url })
      
    } catch (err) {
      console.error("Avatar Upload Error:", err)
      alert("Failed to save profile picture. Check your connection.")
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveProfile = async () => {
    setIsUpdating(true)
    try {
      // Mocking update - replace with your actual update auth method
      // await updateProfile(formData)
      setTimeout(() => setIsUpdating(false), 1000)
    } catch (err) {
      setIsUpdating(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-[100svh] bg-[#0A0A0A] text-white p-4 md:p-10 relative overflow-x-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-10%,rgba(77,182,172,0.1),transparent_70%)] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-xl md:text-3xl font-black italic uppercase tracking-tighter leading-none">My <span className="text-[#4DB6AC]">Profile</span></h1>
          </div>
          <button onClick={() => signOut?.()} className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-red-500 transition-all flex items-center gap-2">
            <LogOut size={14} /> Exit
          </button>
        </header>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center gap-6 py-8">
           <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-[3rem] border-4 border-[#4DB6AC]/20 overflow-hidden bg-white/5 shadow-2xl relative">
                {previewUrl ? (
                  <img src={previewUrl} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/10">
                    <User size={64} />
                  </div>
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="animate-spin text-[#4DB6AC]" />
                  </div>
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#4DB6AC] text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 transition-all border-4 border-[#0A0A0A]"
              >
                <Camera size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
              />
           </div>
           <div className="text-center">
              <h2 className="text-2xl font-black uppercase tracking-tight italic">{user.firstName} {user.lastName}</h2>
              <p className="text-[#4DB6AC] text-[9px] font-black uppercase tracking-[0.4em] mt-1">Care ID: {user.id?.slice(0,8) || 'PREMIUM'}</p>
           </div>
        </div>

        {/* FORM FIELDS - FLUID GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="space-y-2 text-left">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-4">First Name</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 font-bold focus:border-[#4DB6AC] outline-none transition-all text-sm"
                />
              </div>
           </div>
           <div className="space-y-2 text-left">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-4">Last Name</label>
              <input 
                type="text" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 font-bold focus:border-[#4DB6AC] outline-none transition-all text-sm"
              />
           </div>
           <div className="space-y-2 text-left md:col-span-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-4">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/10" size={16} />
                <input 
                  type="email" 
                  disabled
                  value={user.email}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 font-bold text-white/20 outline-none cursor-not-allowed text-sm"
                />
              </div>
           </div>
           <div className="space-y-2 text-left">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-4">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="tel" 
                  value={formData.phoneNo}
                  onChange={(e) => setFormData({...formData, phoneNo: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 font-bold focus:border-[#4DB6AC] outline-none transition-all text-sm"
                />
              </div>
           </div>
           <div className="space-y-2 text-left">
              <label className="text-[9px] font-black uppercase tracking-widest text-white/40 ml-4">Location</label>
              <div className="relative">
                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="text" 
                  disabled
                  value={user.profile?.country || "Nigeria"}
                  className="w-full bg-white/[0.02] border border-white/5 rounded-2xl py-5 pl-14 pr-6 font-bold text-white/20 outline-none text-sm"
                />
              </div>
           </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="pt-6 space-y-6">
           <Button 
            onClick={handleSaveProfile}
            disabled={isUpdating}
            className="w-full h-16 bg-[#4DB6AC] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all"
           >
             {isUpdating ? <Loader2 className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save Changes</>}
           </Button>

           <div className="flex items-center justify-center gap-3 opacity-30">
              <ShieldCheck size={14} className="text-[#4DB6AC]" />
              <p className="text-[8px] font-black uppercase tracking-[0.3em]">Encrypted Clinical Identity</p>
           </div>
        </div>

      </motion.div>
    </div>
  )
}