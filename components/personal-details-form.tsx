/**
 * 🛡️ AFRIDAM PERSONAL DETAILS FORM (Rule 7 Sync)
 * Version: 2026.1.29 (Skin Health & Demographics)
 * Focus: Comprehensive dermal and personal data collection for AI model context.
 */

"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "@/providers/auth-provider";
import { updateUserProfile as updateProfileAPI, createUserProfile as createProfileAPI } from "@/lib/api-client";
import {
  Activity,
  Globe,
  AlertTriangle,
  Save,
  Loader2,
  CheckCircle2,
  ChevronDown,
  Heart,
  Pill,
  X,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* -------------------- CONSTANTS -------------------- */

const FITZPATRICK_SKIN_TYPES = [
  { value: "I", label: "Type I (Pale white, always burns)" },
  { value: "II", label: "Type II (Fair, usually burns)" },
  { value: "III", label: "Type III (Fair to medium, sometimes burns)" },
  { value: "IV", label: "Type IV (Medium to olive, rarely burns)" },
  { value: "V", label: "Type V (Olive to brown, very rarely burns)" },
  { value: "VI", label: "Type VI (Dark brown to black, never burns)" },
];

const AFRICAN_REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
];

const AFRICAN_COUNTRIES = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "Ethiopia",
  "Rwanda",
  "Uganda",
  "Egypt",
  "Morocco",
  "Cameroon",
  "Senegal",
  "Benin",
  "Ivory Coast",
  "Other",
];

const SKIN_CONDITIONS = [
  { id: "acne", label: "Acne", description: "Pimples, blackheads, whiteheads" },
  { id: "eczema", label: "Eczema", description: "Dry, itchy, inflamed skin" },
  { id: "psoriasis", label: "Psoriasis", description: "Red, scaly patches on skin" },
  { id: "rosacea", label: "Rosacea", description: "Facial redness and visible blood vessels" },
  { id: "vitiligo", label: "Vitiligo", description: "Loss of skin pigmentation in patches" },
  { id: "hyperpigmentation", label: "Hyperpigmentation", description: "Dark patches or uneven skin tone" },
  { id: "melasma", label: "Melasma", description: "Brown patches on face" },
  { id: "keratosis_pilaris", label: "Keratosis Pilaris", description: "Small bumps on arms/thighs" },
  { id: "none", label: "No Known Condition", description: "No diagnosed skin condition" },
];

const COMMON_ALLERGIES = [
  { id: "fragrance", label: "Fragrance", description: "Perfumes & scents" },
  { id: "vitamin_c", label: "Vitamin C", description: "May irritate sensitive skin" },
  { id: "nuts", label: "Nut Oils", description: "Almond, coconut oils" },
  { id: "sulfates", label: "Sulfates", description: "SLS/SLES cleansers" },
  { id: "alcohol", label: "Alcohol", description: "Drying alcohols" },
  { id: "benzoyl_peroxide", label: "Benzoyl Peroxide", description: "Acne treatment irritant" },
  { id: "salicylic_acid", label: "Salicylic Acid", description: "Can cause dryness" },
  { id: "nickel", label: "Nickel", description: "Metal sensitivity" },
  { id: "sun", label: "Sun Sensitivity", description: "Burns easily" },
];

/* -------------------- TYPES -------------------- */

interface PersonalDetailsData {
  nationality: string;
  otherCountry: string;
  skinType: string;
  skinToneLevel: number;
  gender: string;
  ageRange: string;
  melaninTone: string;
  primaryConcern: string;
  environment: string;
  knownSkinAllergies: string[];
  previousTreatments: string[];
}

/* -------------------- COMPONENT -------------------- */

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
        {Icon && <Icon className="text-[#4DB6AC]" size={14} />}
        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</label>
      </div>
      <div className="flex flex-wrap gap-2 p-4 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus-within:border-[#E1784F] transition-all min-h-[60px]">
        {value.map(tag => (
          <span key={tag} className="flex items-center gap-2 px-3 py-1 bg-[#E1784F]/10 text-[#E1784F] border border-[#E1784F]/20 rounded-lg text-[9px] font-extrabold uppercase italic">
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
          className="flex-1 min-w-[100px] bg-transparent outline-none text-xs font-bold py-1"
        />
      </div>
    </div>
  );
};

export const PersonalDetailsForm = ({
  onSuccess,
  onClose
}: {
  onSuccess?: () => void;
  onClose?: () => void;
}) => {
  const { user, refreshUser, updateUserProfile, updateProfile, createProfile } = useAuth();

  const [formData, setFormData] = useState<PersonalDetailsData>({
    nationality: "",
    otherCountry: "",
    skinType: "",
    skinToneLevel: 4,
    gender: "",
    ageRange: "25",
    melaninTone: "",
    primaryConcern: "",
    environment: "",
    knownSkinAllergies: [],
    previousTreatments: [],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nationality: user.nationality || "",
        otherCountry: "",
        skinType: user.profile?.skinType || "",
        skinToneLevel: user.profile?.skinToneLevel || 4,
        gender: user.sex || "",
        ageRange: user.profile?.ageRange ? String(user.profile?.ageRange) : "25",
        melaninTone: user.profile?.melaninTone || "",
        primaryConcern: user.profile?.primaryConcern || "",
        environment: user.profile?.environment || "",
        knownSkinAllergies: user.profile?.knownSkinAllergies || [],
        previousTreatments: user.profile?.previousTreatments || [],
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      const profilePayload = {
        ageRange: Number(formData.ageRange),
        skinType: formData.skinType,
        skinToneLevel: formData.skinToneLevel,
        melaninTone: formData.melaninTone,
        primaryConcern: formData.primaryConcern,
        environment: formData.environment,
        knownSkinAllergies: formData.knownSkinAllergies,
        previousTreatments: formData.previousTreatments,
        onboardingSkipped: false,
        onboardingCompleted: true
      };

      const hasExistingProfile = user?.profile && Object.keys(user.profile).length > 0;

      if (hasExistingProfile) {
        await updateProfile(profilePayload);
      } else {
        await createProfile(profilePayload);
      }

      await updateUserProfile({
        sex: formData.gender,
        nationality: formData.nationality === "Other" ? formData.otherCountry : formData.nationality
      });

      setSuccess(true);
      await refreshUser();
      if (onSuccess) onSuccess();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Sync Failed");
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- JSX -------------------- */

  return (
    <div className="space-y-10 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-0 top-0 p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-all z-50 text-muted-foreground hover:text-foreground"
        >
          <X size={24} />
        </button>
      )}

      {/* HEADER */}
      <div className="space-y-2">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
          Clinical <span className="text-[#E1784F]">Handshake</span>
        </h2>
        <p className="text-black/40 dark:text-white/40 text-xs font-black uppercase tracking-[0.3em]">
          Dermal Architecture & Health Context
        </p>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-widest">
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-4 bg-[#4DB6AC]/10 border border-[#4DB6AC]/30 rounded-2xl text-[#4DB6AC] text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
            <CheckCircle2 size={16} />
            Data Synchronized
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* 📍 GEOGRAPHIC & IDENTITY NODE */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
              <Globe className="text-[#E1784F]" size={16} strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Identity Node</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Biological Sex</label>
                <div className="relative">
                  <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full h-14 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] appearance-none cursor-pointer">
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#E1784F] ml-2">Age Metric</label>
                <div className="relative">
                  <input
                    type="number"
                    name="ageRange"
                    value={formData.ageRange}
                    onChange={handleChange}
                    placeholder="Enter Age (e.g. 25)"
                    className="w-full h-14 bg-muted/20 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all"
                  />
                  <Activity className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#E1784F] ml-2">Country / Nationality</label>
                <div className="relative">
                  <select
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                    className="w-full h-14 bg-white dark:bg-white/5 border-2 border-black/30 dark:border-white/30 rounded-xl px-4 text-xs font-black outline-none focus:border-[#E1784F] appearance-none cursor-pointer transition-all shadow-sm"
                  >
                    <option value="">Select Country</option>
                    {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <Globe className="absolute right-4 top-1/2 -translate-y-1/2 opacity-60 text-[#E1784F] pointer-events-none" size={16} strokeWidth={3} />
                </div>
              </div>
            </div>

            {formData.nationality === "Other" && (
              <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Specify Other Country</label>
                <input
                  type="text"
                  name="otherCountry"
                  value={formData.otherCountry}
                  onChange={handleChange}
                  placeholder="Type country name..."
                  className="w-full h-14 bg-muted/20 border-2 border-[#E1784F]/20 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F]"
                />
              </motion.div>
            )}

            <TagInput
              label="Known Skin Allergies"
              placeholder="Type & Press Enter..."
              value={formData.knownSkinAllergies}
              onChange={(tags) => setFormData({ ...formData, knownSkinAllergies: tags })}
              icon={AlertTriangle}
            />
          </div>

          {/* 🧬 CLINICAL NODE */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 pb-4">
              <Activity className="text-[#4DB6AC]" size={16} strokeWidth={3} />
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Clinical Node</h3>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC] ml-2">Skin Type / Dermal Context</label>
                <div className="relative">
                  <input
                    type="text"
                    name="skinType"
                    value={formData.skinType}
                    onChange={handleChange}
                    placeholder="e.g. Oily, Dry, Type VI"
                    className="w-full h-14 bg-muted/20 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all"
                  />
                  <Heart className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC] ml-2">Skin Tone Level (Fitzpatrick 1-6)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="skinToneLevel"
                    min="1"
                    max="6"
                    value={formData.skinToneLevel}
                    onChange={handleChange}
                    placeholder="Level 1-6"
                    className="w-full h-14 bg-muted/20 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all"
                  />
                  <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC] ml-2">Melanin Tone</label>
                <div className="relative">
                  <input
                    type="text"
                    name="melaninTone"
                    value={formData.melaninTone}
                    onChange={handleChange}
                    placeholder="e.g. Deep Melanin, Golden..."
                    className="w-full h-14 bg-muted/20 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all"
                  />
                  <ShieldCheck className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC] ml-2">Primary Skin Concern</label>
                <div className="relative">
                  <input
                    type="text"
                    name="primaryConcern"
                    value={formData.primaryConcern}
                    onChange={handleChange}
                    placeholder="e.g. Hyperpigmentation, Acne..."
                    className="w-full h-14 bg-muted/20 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all"
                  />
                  <AlertTriangle className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#4DB6AC] ml-2">Typical Environment</label>
                <div className="relative">
                  <input
                    type="text"
                    name="environment"
                    value={formData.environment}
                    onChange={handleChange}
                    placeholder="e.g. High Humidity, Urban, Dry..."
                    className="w-full h-14 bg-muted/20 border-2 border-black/10 dark:border-white/10 rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all"
                  />
                  <Globe className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={14} />
                </div>
              </div>
            </div>

            <TagInput
              label="Treatment History"
              placeholder="Type (e.g. Laser) & Enter..."
              value={formData.previousTreatments}
              onChange={(tags) => setFormData({ ...formData, previousTreatments: tags })}
              icon={Save}
            />
          </div>
        </div>

        {/* 🚀 SUBMIT NODE */}
        <div className="pt-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[9px] text-muted-foreground font-medium max-w-sm uppercase tracking-tighter">
            Your clinical data is protected by Rule 7 sync and used only for AI analysis.
          </p>
          <button type="submit" disabled={loading} className="w-full md:w-auto px-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.4em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Save size={18} strokeWidth={3} />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
