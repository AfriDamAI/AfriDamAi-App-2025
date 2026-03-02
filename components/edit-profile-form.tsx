"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";
import {
  User as UserIcon,
  Activity,
  Globe,
  AlertTriangle,
  Save,
  Loader2,
  CheckCircle2,
  ChevronDown,
  X,
  History,
  Thermometer,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const AFRICAN_COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Ethiopia",
  "Rwanda", "Uganda", "Egypt", "Morocco", "Other"
];

const SKIN_TONES = [
  { level: 1, label: "Type I", desc: "Always burns, never tans" },
  { level: 2, label: "Type II", desc: "Burns easily, tans minimally" },
  { level: 3, label: "Type III", desc: "Sometimes burns, tans uniformly" },
  { level: 4, label: "Type IV", desc: "Burns minimally, tans easily" },
  { level: 5, label: "Type V", desc: "Rarely burns, tans profusely" },
  { level: 6, label: "Type VI", desc: "Never burns, deeply pigmented" }
];

export const EditProfileForm = ({
  onSuccess,
  onClose
}: {
  onSuccess?: () => void;
  onClose?: () => void;
}) => {
  const { user, updateUserProfile, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    sex: "",
    nationality: "",
    otherCountry: "",
    ageRange: 25,
    skinType: "",
    skinToneLevel: 4,
    melaninTone: "",
    primaryConcern: "",
    environment: "",
    allergies: "",
    knownSkinAllergies: [] as string[],
    previousTreatments: [] as string[],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      const userNationality = user.nationality || (user as any).profile?.nationality || "";
      const isAfrican = AFRICAN_COUNTRIES.includes(userNationality);

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
        sex: user.sex || "",
        nationality: userNationality ? (isAfrican ? userNationality : "Other") : "Nigeria",
        otherCountry: isAfrican ? "" : userNationality,
        ageRange: user.profile?.ageRange || 25,
        skinType: user.profile?.skinType || "",
        skinToneLevel: user.profile?.skinToneLevel || 4,
        melaninTone: user.profile?.melaninTone || "",
        primaryConcern: user.profile?.primaryConcern || "",
        environment: user.profile?.environment || "",
        allergies: user.profile?.allergies || "",
        knownSkinAllergies: user.profile?.knownSkinAllergies || [],
        previousTreatments: user.profile?.previousTreatments || [],
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

      // Update User Identity Fields
      await updateUserProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNo: formData.phoneNo,
        sex: formData.sex,
        nationality: finalNationality,
      });

      // Update Clinical Profile Fields
      await updateProfile({
        ageRange: Number(formData.ageRange),
        skinType: formData.skinType,
        skinToneLevel: Number(formData.skinToneLevel),
        melaninTone: formData.melaninTone,
        primaryConcern: formData.primaryConcern,
        environment: formData.environment,
        allergies: formData.allergies,
        knownSkinAllergies: formData.knownSkinAllergies,
        previousTreatments: formData.previousTreatments,
        onboardingSkipped: false
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Clinical Profile Sync Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm text-left relative max-h-[90vh] overflow-y-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-8 top-8 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all z-50"
        >
          <X size={24} />
        </button>
      )}

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
              <UserIcon className="text-[#E1784F]" size={18} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Identity Node</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nationality</label>
              <div className="relative">
                <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] appearance-none">
                  {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={16} />
              </div>
              {formData.nationality === "Other" && (
                <motion.input
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  name="otherCountry" value={formData.otherCountry} onChange={handleChange}
                  placeholder="Specify country" className="w-full mt-2 py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]"
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

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Age Range</label>
              <div className="grid grid-cols-4 gap-2">
                {[18, 25, 35, 50].map((age) => (
                  <button
                    key={age} type="button" onClick={() => setFormData({ ...formData, ageRange: age })}
                    className={`py-3 rounded-xl text-[10px] font-black transition-all border-2 ${formData.ageRange === age
                      ? "bg-[#E1784F] text-white border-[#E1784F]"
                      : "bg-muted/40 text-muted-foreground border-transparent hover:border-border"
                      }`}
                  >
                    {age === 50 ? "50+" : age === 18 ? "<25" : age === 25 ? "25-34" : "35-49"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Primary Concern</label>
              <input type="text" name="primaryConcern" value={formData.primaryConcern} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]" placeholder="Hyperpigmentation, Acne, etc." />
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
              <input type="tel" name="phoneNo" value={formData.phoneNo} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]" placeholder="+234..." />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Skin Type</label>
              <div className="relative">
                <select name="skinType" value={formData.skinType} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] appearance-none">
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
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Melanin Tone</label>
              <input type="text" name="melaninTone" value={formData.melaninTone} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]" placeholder="Deep Melanin, etc." />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Environment</label>
              <input type="text" name="environment" value={formData.environment} onChange={handleChange} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]" placeholder="High Humidity, Dry, etc." />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-2">
                <Thermometer size={12} className="text-[#E1784F]" />
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Skin Tone (Fitzpatrick)</label>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.level} type="button" onClick={() => setFormData({ ...formData, skinToneLevel: tone.level })}
                    className={`h-10 rounded-lg border-2 transition-all ${formData.skinToneLevel === tone.level ? "border-[#E1784F] scale-110" : "border-transparent"}`}
                    style={{ backgroundColor: `hsl(25, ${30 + tone.level * 5}%, ${80 - tone.level * 10}%)` }}
                    title={tone.desc}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-2">
                <AlertTriangle className="text-red-500" size={12} />
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Allergy Notes (Raw)</label>
              </div>
              <textarea
                name="allergies" value={formData.allergies} onChange={handleChange}
                rows={2} className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] resize-none min-h-[80px]"
                placeholder="Detailed raw notes about allergies..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-2">
                <ShieldCheck className="text-[#4DB6AC]" size={12} />
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Known Skin Allergies (Tags)</label>
              </div>
              <input
                type="text"
                value={formData.knownSkinAllergies.join(", ")}
                onChange={(e) => setFormData({ ...formData, knownSkinAllergies: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]"
                placeholder="Fragrance, Vitamin C, etc."
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 ml-2">
                <History className="text-[#4DB6AC]" size={12} />
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Previous Treatments (Tags)</label>
              </div>
              <input
                type="text"
                value={formData.previousTreatments.join(", ")}
                onChange={(e) => setFormData({ ...formData, previousTreatments: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]"
                placeholder="Laser therapy, Chemical peels, etc."
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
