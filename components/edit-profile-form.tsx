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

const TagInput = ({
  value,
  onChange,
  placeholder,
  label,
  icon: Icon
}: {
  value: string[],
  onChange: (tags: string[]) => void,
  placeholder: string,
  label: string,
  icon: any
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!value.includes(inputValue.trim())) {
        onChange([...value, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tag: string) => {
    onChange(value.filter(t => t !== tag));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 ml-2">
        {Icon && <Icon className="text-[#4DB6AC]" size={12} />}
        <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{label}</label>
      </div>
      <div className="flex flex-wrap gap-2 p-3 bg-muted/20 border border-border rounded-xl focus-within:border-[#E1784F] transition-all min-h-[50px]">
        {value.map(tag => (
          <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20 rounded-lg text-[10px] font-black uppercase italic">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">
              <X size={10} strokeWidth={3} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : "Add more..."}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-xs font-bold py-1"
        />
      </div>
    </div>
  );
};

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
    <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm text-left relative max-h-[95vh] overflow-y-auto w-full max-w-5xl mx-auto">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-8 top-8 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all z-50 text-muted-foreground hover:text-foreground"
        >
          <X size={24} />
        </button>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-foreground leading-none">Profile Sync</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#E1784F]">Clinical Architecture & Dermal History</p>
        </div>

        <AnimatePresence>
          {success && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-[#4DB6AC]/10 border border-[#4DB6AC]/20 text-[#4DB6AC] px-6 py-3 rounded-2xl flex items-center gap-3">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Core Synced</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleUpdate} className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">

          {/* 🆔 IDENTITY NODE */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <UserIcon className="text-[#E1784F]" size={16} strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Identity Node</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Biological Sex</label>
                <div className="relative">
                  <select name="sex" value={formData.sex} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] appearance-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Age Metric</label>
                <div className="relative">
                  <select name="ageRange" value={formData.ageRange} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] appearance-none cursor-pointer">
                    <option value={18}>&lt; 25</option>
                    <option value={25}>25 - 34</option>
                    <option value={35}>35 - 49</option>
                    <option value={50}>50+</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Nationality</label>
              <div className="relative">
                <select name="nationality" value={formData.nationality} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] appearance-none cursor-pointer">
                  {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
              </div>
              {formData.nationality === "Other" && (
                <motion.input
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  name="otherCountry" value={formData.otherCountry} onChange={handleChange}
                  placeholder="Specify country" className="w-full mt-2 h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]"
                />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Primary Dermal Concern</label>
              <input type="text" name="primaryConcern" value={formData.primaryConcern} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]" placeholder="e.g. Hyperpigmentation, Acne Nodes" />
            </div>
          </div>

          {/* 🧬 CLINICAL NODE */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <Activity className="text-[#4DB6AC]" size={16} strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Clinical Node</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Skin Category</label>
                <div className="relative">
                  <select name="skinType" value={formData.skinType} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] appearance-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="Oily / Shine">Oily / Shine</option>
                    <option value="Dry / Tight">Dry / Tight</option>
                    <option value="Balanced">Balanced</option>
                    <option value="Sensitive">Sensitive</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Melanin Tone</label>
                <input type="text" name="melaninTone" value={formData.melaninTone} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]" placeholder="e.g. Deep Melanin" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Environment</label>
                <input type="text" name="environment" value={formData.environment} onChange={handleChange} className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]" placeholder="e.g. High Humidity" />
              </div>
            </div>

            <TagInput
              label="Known Skin Allergies"
              placeholder="Type & Press Enter..."
              value={formData.knownSkinAllergies}
              onChange={(tags) => setFormData({ ...formData, knownSkinAllergies: tags })}
              icon={ShieldCheck}
            />

            <TagInput
              label="Clinical History / Treatments"
              placeholder="Type & Press Enter..."
              value={formData.previousTreatments}
              onChange={(tags) => setFormData({ ...formData, previousTreatments: tags })}
              icon={History}
            />
          </div>
        </div>

        {/* 📝 RAW NOTES BLOCK */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 ml-2">
            <AlertTriangle className="text-red-500" size={12} strokeWidth={3} />
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Extended Allergy Notes (Raw Storage)</label>
          </div>
          <textarea
            name="allergies" value={formData.allergies} onChange={handleChange}
            rows={2} className="w-full bg-muted/20 border border-border rounded-2xl p-6 text-xs font-bold outline-none focus:border-[#E1784F] transition-all resize-none h-28"
            placeholder="Document detailed raw clinical observations here..."
          />
        </div>

        <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] text-muted-foreground font-medium max-w-sm uppercase tracking-tighter">
            Updating your clinical profile will recalibrate the AI diagnostic engine for your next scan.
          </p>
          <button type="submit" disabled={loading} className="w-full md:w-auto px-16 h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] shadow-[0_15px_30px_rgba(225,120,79,0.25)] hover:bg-[#d06b45] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Save size={18} strokeWidth={3} />
                Sync Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
