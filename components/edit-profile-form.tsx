"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import { 
  User, 
  Activity, 
  Globe, 
  AlertTriangle, 
  Save, 
  Loader2, 
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AFRICAN_COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Ethiopia", 
  "Rwanda", "Uganda", "Egypt", "Morocco", "Other"
];

export const EditProfileForm = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    sex: "",
    nationality: "",
    otherCountry: "",
    skinType: "",
    allergies: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const userNationality = user.profile?.nationality || "";
      const isAfrican = AFRICAN_COUNTRIES.includes(userNationality);
      
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
        sex: user.sex || "",
        // 🛡️ RECTIFIED: Prevents defaulting to Nigeria if user data is still syncing
        nationality: userNationality ? (isAfrican ? userNationality : "Other") : "Nigeria",
        otherCountry: isAfrican ? "" : userNationality,
        skinType: user.profile?.skinType || "",
        allergies: user.profile?.allergies || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      if (!user) return;
      const finalNationality = formData.nationality === "Other" ? formData.otherCountry : formData.nationality;
      
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNo: formData.phoneNo,
        sex: formData.sex,
        onboardingCompleted: true, 
        profile: {
          ...user.profile,
          nationality: finalNationality,
          skinType: formData.skinType,
          allergies: formData.allergies,
        }
      };
      
      await updateUserProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Clinical Profile Sync Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">Edit Clinical Profile</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Update your identity and dermal metrics</p>
        </div>
        
        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 text-[#4DB6AC] px-6 py-3 rounded-2xl flex items-center gap-3">
              <CheckCircle2 size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">Changes Synced</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleUpdate} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* IDENTITY NODE */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <User className="text-[#E1784F]" size={18} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Identity Node</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="auth-input w-full" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="auth-input w-full" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nationality</label>
              <div className="relative">
                <select name="nationality" value={formData.nationality} onChange={handleChange} className="auth-input w-full appearance-none">
                  {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={16} />
              </div>
              {formData.nationality === "Other" && (
                <motion.input 
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  name="otherCountry" value={formData.otherCountry} onChange={handleChange}
                  placeholder="Specify country" className="auth-input w-full mt-2" 
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Biological Sex</label>
              <div className="flex gap-2">
                {["female", "male"].map((s) => (
                  <button
                    key={s} type="button" onClick={() => setFormData({ ...formData, sex: s })}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.sex === s
                        ? "bg-[#E1784F] text-white border-[#E1784F] shadow-lg shadow-[#E1784F]/20"
                        : "bg-muted/40 text-muted-foreground border-transparent hover:border-border"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CLINICAL METRICS */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Activity className="text-[#4DB6AC]" size={18} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Clinical Metrics</h3>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Phone Number</label>
              <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="auth-input w-full" placeholder="+234..." />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Skin Type</label>
              <div className="relative">
                <select name="skinType" value={formData.skinType} onChange={handleChange} className="auth-input w-full appearance-none">
                  <option value="">Select Category</option>
                  <option value="Oily / Shine">Oily / Shine</option>
                  <option value="Dry / Tight">Dry / Tight</option>
                  <option value="Balanced">Balanced</option>
                  <option value="Sensitive">Sensitive</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={16} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-2">
                <AlertTriangle className="text-red-500" size={12} />
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Known Allergies</label>
              </div>
              <textarea
                name="allergies" value={formData.allergies} onChange={handleChange}
                rows={3} className="auth-input w-full resize-none min-h-[100px] py-4"
                placeholder="Fragrance, Vitamin C, Nuts, etc."
              />
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex justify-end">
          <button type="submit" disabled={loading} className="w-full md:w-auto px-12 h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Save size={18} />
                Confirm Profile Sync
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};