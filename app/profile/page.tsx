/**
 * 🛡️ AFRIDAM IDENTITY: PROFILE (Rule 7 Precision Sync)
 * Version: 2026.3.2
 * Focus: Consolidated Profile Management with Modals.
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
  Fingerprint,
  Edit3,
  PlusCircle,
  UserCircle,
  Activity,
  Calendar,
  Layers,
  Heart
} from "lucide-react"
import { useAuth } from "@/providers/auth-provider"
import { apiClient, uploadAvatar, getImageUrl } from "@/lib/api-client" 
import { motion, AnimatePresence } from "framer-motion"
import { PersonalDetailsForm } from "@/components/personal-details-form"
import { EditProfileForm } from "@/components/edit-profile-form"

export default function ProfilePage() {
  const { user, signOut, mutate } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [activeModal, setActiveModal] = useState<'profile' | 'user' | null>(null)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(user?.profile?.avatarUrl || null)

  useEffect(() => {
    if (!user) router.push("/login")
  }, [user, router])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preprocessing for instant UI feedback
    const objectUrl = URL.createObjectURL(file)
    setPreviewUrl(objectUrl)
    setUploadingAvatar(true)

    try {
      // 🚀 THE SYNERGY UPLOAD: Using the dedicated avatar endpoint
      await uploadAvatar(file)

      // 🛡️ RE-SYNC: Refreshing auth state to get the new avatarUrl from the backend
      await mutate()
    } catch (err) {
      console.error("Clinical Profile Sync Error:", err)
      // Fallback is handled by keeping the preview or showing error
    } finally {
      setUploadingAvatar(false)
    }
  }

  const hasProfile = user?.profile && Object.keys(user.profile).length > 0;

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

        <section className="grid lg:grid-cols-3 gap-8 items-start">
           {/* LEFT COLUMN: IDENTITY CARD */}
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden bg-white dark:bg-black border-2 border-white dark:border-white/10 shadow-xl transition-all">
                      {(previewUrl || user?.profile?.avatarUrl) ? (
                        <img 
                          src={getImageUrl(previewUrl || user?.profile?.avatarUrl)} 
                          className="w-full h-full object-cover" 
                          alt="User" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-10">
                          <User size={60} strokeWidth={1} />
                        </div>
                      )}
                      {uploadingAvatar && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center space-y-2">
                          <Loader2 className="animate-spin text-white" size={20} />
                          <p className="text-[7px] font-black tracking-widest text-white">Saving...</p>
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
                  
                  <div className="text-center space-y-1">
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter">
                      {user.firstName} {user.lastName}
                    </h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-40">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E1784F]/10 flex items-center justify-center text-[#E1784F]">
                      <Phone size={14} />
                    </div>
                    <p className="text-[10px] font-bold opacity-60">{user.phoneNo || "No phone linked"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#4DB6AC]/10 flex items-center justify-center text-[#4DB6AC]">
                      <MapPin size={14} />
                    </div>
                    <p className="text-[10px] font-bold opacity-60">{user.nationality || user.profile?.country || "Nigeria"}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <UserCircle size={14} />
                    </div>
                    <p className="text-[10px] font-bold opacity-60 uppercase">{user.sex || "Unspecified"}</p>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveModal('user')}
                  className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
                >
                  <Edit3 size={14} /> Edit User Info
                </button>
              </div>

              <div className="bg-[#4DB6AC]/5 border border-[#4DB6AC]/10 rounded-3xl p-6 flex items-center gap-4">
                 <ShieldCheck className="text-[#4DB6AC]" size={24} />
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC]">Privacy Guard Active</p>
                    <p className="text-[8px] font-bold opacity-40">Your data is encrypted and synced with our clinical engine.</p>
                 </div>
              </div>
           </div>

           {/* RIGHT COLUMN: CLINICAL DATA */}
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 space-y-10 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                  <Fingerprint size={120} />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black italic uppercase tracking-tighter">Clinical Profile</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">AI-Diagnostic Context</p>
                  </div>
                  
                  {hasProfile ? (
                    <button 
                      onClick={() => setActiveModal('profile')}
                      className="px-6 py-4 bg-[#E1784F] text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-[#E1784F]/20 hover:scale-[1.02] transition-all"
                    >
                      <Edit3 size={14} /> Update Metrics
                    </button>
                  ) : (
                    <button 
                      onClick={() => setActiveModal('profile')}
                      className="px-6 py-4 bg-[#4DB6AC] text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-[#4DB6AC]/20 hover:scale-[1.02] transition-all animate-bounce"
                    >
                      <PlusCircle size={14} /> Create Profile
                    </button>
                  )}
                </div>

                {hasProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 space-y-4 border border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-3 text-[#E1784F]">
                        <Activity size={18} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Dermal Metrics</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Skin Type</span>
                          <span className="text-xs font-black">{user.profile?.skinType || "Not Set"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Tone Level</span>
                          <span className="text-xs font-black">Fitzpatrick {user.profile?.skinToneLevel || "0"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Age Range</span>
                          <span className="text-xs font-black">{user.profile?.ageRange || "Not Set"} yrs</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-white/5 rounded-3xl p-6 space-y-4 border border-black/5 dark:border-white/10">
                      <div className="flex items-center gap-3 text-[#4DB6AC]">
                        <Heart size={18} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Health Context</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Known Allergies</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {user.profile?.knownSkinAllergies?.length > 0 ? (
                              user.profile.knownSkinAllergies.map((a: string) => (
                                <span key={a} className="px-3 py-1 bg-red-500/10 text-red-500 text-[8px] font-black uppercase rounded-full">
                                  {a}
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] font-bold opacity-30 italic">None recorded</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-bold opacity-40 uppercase tracking-wider">Recent Treatments</span>
                          <p className="text-[10px] font-bold leading-relaxed">
                            {user.profile?.previousTreatments?.join(", ") || "No treatment history recorded."}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 bg-white dark:bg-white/5 rounded-3xl p-6 space-y-4 border border-black/5 dark:border-white/10">
                       <div className="flex items-center gap-3 text-purple-500">
                          <Layers size={18} />
                          <h4 className="text-[10px] font-black uppercase tracking-widest">Environmental Context</h4>
                       </div>
                       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                             <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Region</p>
                             <p className="text-[10px] font-black">{user.profile?.region || "West Africa"}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">App Usage</p>
                             <p className="text-[10px] font-black uppercase">{user.profile?.appActiveness || "Moderate"}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Lotion</p>
                             <p className="text-[10px] font-black">{user.profile?.knownBodyLotion || "Not Set"}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[8px] font-bold opacity-30 uppercase tracking-widest">Brand</p>
                             <p className="text-[10px] font-black">{user.profile?.bodyLotionBrand || "Not Set"}</p>
                          </div>
                       </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                    <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center text-gray-400">
                      <Calendar size={40} strokeWidth={1} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black italic uppercase tracking-tighter">No Profile Found</h4>
                      <p className="text-[10px] font-bold opacity-40 max-w-xs uppercase tracking-widest leading-loose">
                        Your clinical metrics are empty. Create a profile to unlock personalized AI analysis.
                      </p>
                    </div>
                  </div>
                )}
              </div>
           </div>
        </section>
      </div>

      {/* --- MODAL OVERLAYS --- */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-[#0A0A0A] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative scrollbar-hide"
            >
              <div className="p-6 md:p-10">
                {activeModal === 'profile' ? (
                  <PersonalDetailsForm 
                    onSuccess={() => setActiveModal(null)} 
                    onClose={() => setActiveModal(null)} 
                  />
                ) : (
                  <EditProfileForm 
                    onSuccess={() => setActiveModal(null)} 
                    onClose={() => setActiveModal(null)} 
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  )
}
