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
  region: string;
  country: string;
  otherCountry: string;
  fitzpatrickSkinType: string;
  skinTypeLastChecked: string;
  knownSkinConditions: string[];
  skinConditionLastChecked: string;
  gender: string;
  age: string;
  knownBodyLotion: string;
  bodyLotionBrand: string;
  knownAllergies: string[];
  lastSkinTreatment: string;
  lastDermatologistConsultation: string;
  appActiveness: string;
}

/* -------------------- COMPONENT -------------------- */

export const PersonalDetailsForm = () => {
  const { user, refreshUser } = useAuth();

  const [formData, setFormData] = useState<PersonalDetailsData>({
    region: "",
    country: "",
    otherCountry: "",
    fitzpatrickSkinType: "",
    skinTypeLastChecked: "",
    knownSkinConditions: [],
    skinConditionLastChecked: "",
    gender: "",
    age: "",
    knownBodyLotion: "",
    bodyLotionBrand: "",
    knownAllergies: [],
    lastSkinTreatment: "",
    lastDermatologistConsultation: "",
    appActiveness: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* -------------------- EFFECTS -------------------- */

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        region: user.profile.region || "",
        country: user.profile.country || "",
        otherCountry: "",
        fitzpatrickSkinType: user.profile.fitzpatrickSkinType || "",
        skinTypeLastChecked: user.profile.skinTypeLastChecked || "",
        knownSkinConditions: user.profile.knownSkinConditions || [],
        skinConditionLastChecked: user.profile.skinConditionLastChecked || "",
        gender: user.profile.gender || "",
        age: user.profile.age ? String(user.profile.age) : "",
        knownBodyLotion: user.profile.knownBodyLotion || "",
        bodyLotionBrand: user.profile.bodyLotionBrand || "",
        knownAllergies: user.profile.knownAllergies || [],
        lastSkinTreatment: user.profile.lastSkinTreatment || "",
        lastDermatologistConsultation: user.profile.lastDermatologistConsultation || "",
        appActiveness: user.profile.appActiveness || "",
      });
    }
  }, [user]);

  useEffect(() => {
    if (formData.country !== "Other") {
      setFormData(prev => ({ ...prev, otherCountry: "" }));
    }
  }, [formData.country]);

  /* -------------------- HANDLERS -------------------- */

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConditionToggle = (id: string) => {
    setFormData(prev => {
      if (id === "none") return { ...prev, knownSkinConditions: ["none"] };

      return {
        ...prev,
        knownSkinConditions: prev.knownSkinConditions.includes(id)
          ? prev.knownSkinConditions.filter(c => c !== id)
          : prev.knownSkinConditions.filter(c => c !== "none").concat(id),
      };
    });
  };

  const handleAllergyToggle = (id: string) => {
    setFormData(prev => ({
      ...prev,
      knownAllergies: prev.knownAllergies.includes(id)
        ? prev.knownAllergies.filter(a => a !== id)
        : [...prev.knownAllergies, id],
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !formData.gender) return;

    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // 🛡️ FORMAT DATA FOR API (Matching POST/PUT endpoint schema)
      // ⚠️ FIXED: Only send fields that the backend UpdateUserDto expects
      // Note: Profile data should be wrapped in a 'profile' object for the API
      const profilePayload = {
        profile: {
          ageRange: formData.age ? Number(formData.age) : 0,
          skinType: formData.fitzpatrickSkinType,
          knownSkinAllergies: formData.knownAllergies,
          previousTreatments: [
            formData.lastSkinTreatment,
            formData.lastDermatologistConsultation
          ].filter(Boolean),
        }
      };

      // 🚀 Determine if creating (first time) or updating (existing profile)
      const hasExistingProfile = user?.profile && Object.keys(user.profile).length > 0;
      
      if (hasExistingProfile) {
        // 📝 UPDATE existing profile (PUT /api/profile)
        await updateProfileAPI(profilePayload);
      } else {
        // ✨ CREATE new profile (POST /api/profile - Onboarding)
        await createProfileAPI(profilePayload);
      }

      setSuccess(true);
      
      // 🔄 Refresh user data to sync with new profile
      await refreshUser();
      
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save profile details";
      setError(errorMessage);
      console.error("Profile save error:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- JSX -------------------- */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-3">
        <h2 className="text-4xl md:text-5xl font-black uppercase italic">
          Your <span className="text-[#E1784F]">Profile</span>
        </h2>
        <p className="text-black/60 dark:text-white/60 text-lg font-medium max-w-md">
          Complete your skin health profile to get personalized recommendations
        </p>
      </div>

      {/* STATUS MESSAGES */}
      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-bold"
          >
            {error}
          </motion.div>
        )}
        
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-[#4DB6AC]/10 border border-[#4DB6AC]/30 rounded-2xl text-[#4DB6AC] text-sm font-bold flex items-center gap-3"
          >
            <CheckCircle2 className="w-5 h-5" />
            Profile updated successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* DEMOGRAPHICS SECTION */}
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-[#E1784F]" />
            <h3 className="text-xl font-black uppercase">Demographics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Region */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Region</label>
              <select
                name="region"
                value={formData.region}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
              >
                <option value="">Select Region</option>
                {AFRICAN_REGIONS.map(r => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Country</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
              >
                <option value="">Select Country</option>
                {AFRICAN_COUNTRIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Other Country (if selected) */}
            {formData.country === "Other" && (
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Specify Country</label>
                <input
                  type="text"
                  name="otherCountry"
                  value={formData.otherCountry}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
                  placeholder="Enter your country"
                />
              </div>
            )}

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                min="13"
                max="120"
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
                placeholder="Enter your age"
              />
            </div>
          </div>
        </div>

        {/* SKIN PROFILE SECTION */}
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-[#E1784F]" />
            <h3 className="text-xl font-black uppercase">Skin Profile</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fitzpatrick Skin Type */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Skin Type</label>
              <select
                name="fitzpatrickSkinType"
                value={formData.fitzpatrickSkinType}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
              >
                <option value="">Select Skin Type</option>
                {FITZPATRICK_SKIN_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* Last Skin Type Check */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Last Type Check</label>
              <input
                type="date"
                name="skinTypeLastChecked"
                value={formData.skinTypeLastChecked}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
              />
            </div>

            {/* Body Lotion */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Preferred Body Lotion</label>
              <input
                type="text"
                name="knownBodyLotion"
                value={formData.knownBodyLotion}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
                placeholder="e.g., Shea Butter"
              />
            </div>

            {/* Body Lotion Brand */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Brand</label>
              <input
                type="text"
                name="bodyLotionBrand"
                value={formData.bodyLotionBrand}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
                placeholder="e.g., Palmer's"
              />
            </div>

            {/* App Activeness */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Activity Level</label>
              <select
                name="appActiveness"
                value={formData.appActiveness}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
              >
                <option value="">Select Level</option>
                <option value="very_low">Very Low</option>
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="very_high">Very High</option>
              </select>
            </div>
          </div>
        </div>

        {/* SKIN CONDITIONS SECTION */}
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#E1784F]" />
            <h3 className="text-xl font-black uppercase">Known Skin Conditions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKIN_CONDITIONS.map(condition => (
              <button
                key={condition.id}
                type="button"
                onClick={() => handleConditionToggle(condition.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  formData.knownSkinConditions.includes(condition.id)
                    ? 'border-[#4DB6AC] bg-[#4DB6AC]/10'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#4DB6AC]'
                }`}
              >
                <p className="font-black text-sm uppercase">{condition.label}</p>
                <p className="text-xs text-black/60 dark:text-white/60 mt-1">{condition.description}</p>
              </button>
            ))}
          </div>

          {/* Skin Condition Last Checked */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Last Condition Check</label>
            <input
              type="date"
              name="skinConditionLastChecked"
              value={formData.skinConditionLastChecked}
              onChange={handleChange}
              className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
            />
          </div>
        </div>

        {/* ALLERGIES SECTION */}
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Pill className="w-6 h-6 text-[#E1784F]" />
            <h3 className="text-xl font-black uppercase">Known Allergies</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_ALLERGIES.map(allergy => (
              <button
                key={allergy.id}
                type="button"
                onClick={() => handleAllergyToggle(allergy.id)}
                className={`p-4 rounded-2xl border-2 transition-all text-left ${
                  formData.knownAllergies.includes(allergy.id)
                    ? 'border-[#E1784F] bg-[#E1784F]/10'
                    : 'border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#E1784F]'
                }`}
              >
                <p className="font-black text-sm uppercase">{allergy.label}</p>
                <p className="text-xs text-black/60 dark:text-white/60 mt-1">{allergy.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* TREATMENT HISTORY SECTION */}
        <div className="bg-black/5 dark:bg-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3">
            <Activity className="w-6 h-6 text-[#E1784F]" />
            <h3 className="text-xl font-black uppercase">Treatment History</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Last Skin Treatment */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Last Treatment</label>
              <input
                type="text"
                name="lastSkinTreatment"
                value={formData.lastSkinTreatment}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
                placeholder="e.g., Laser therapy, Chemical peel"
              />
            </div>

            {/* Last Dermatologist Consultation */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-black/70 dark:text-white/70">Last Dermatologist Visit</label>
              <input
                type="text"
                name="lastDermatologistConsultation"
                value={formData.lastDermatologistConsultation}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-[#4DB6AC] transition-all"
                placeholder="e.g., Acne consultation"
              />
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex gap-4">
          <motion.button
            type="submit"
            disabled={loading || !formData.gender}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-black dark:bg-white text-white dark:text-black font-black uppercase py-6 rounded-2xl flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                SAVING...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                SAVE PROFILE
              </>
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};
