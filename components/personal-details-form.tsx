/**
 * 🛡️ AFRIDAM PERSONAL DETAILS FORM (Rule 7 Sync)
 * Version: 2026.1.29 (Skin Health & Demographics)
 * Focus: Comprehensive dermal and personal data collection for AI model context.
 */

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
  ChevronDown,
  Calendar,
  Heart,
  Pill,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Fitzpatrick Skin Types
const FITZPATRICK_SKIN_TYPES = [
  { value: "I", label: "Type I (Pale white, always burns)" },
  { value: "II", label: "Type II (Fair, usually burns)" },
  { value: "III", label: "Type III (Fair to medium, sometimes burns)" },
  { value: "IV", label: "Type IV (Medium to olive, rarely burns)" },
  { value: "V", label: "Type V (Olive to brown, very rarely burns)" },
  { value: "VI", label: "Type VI (Dark brown to black, never burns)" },
];

// African Regions
const AFRICAN_REGIONS = [
  "West Africa",
  "East Africa",
  "Central Africa",
  "Southern Africa",
  "North Africa",
];

const AFRICAN_COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "Ethiopia", 
  "Rwanda", "Uganda", "Egypt", "Morocco", "Cameroon", 
  "Senegal", "Benin", "Ivory Coast", "Other"
];

// Known Skin Conditions with explanations
const SKIN_CONDITIONS = [
  {
    id: "acne",
    label: "Acne",
    description: "Pimples, blackheads, whiteheads"
  },
  {
    id: "eczema",
    label: "Eczema",
    description: "Dry, itchy, inflamed skin"
  },
  {
    id: "psoriasis",
    label: "Psoriasis",
    description: "Red, scaly patches on skin"
  },
  {
    id: "rosacea",
    label: "Rosacea",
    description: "Facial redness and visible blood vessels"
  },
  {
    id: "vitiligo",
    label: "Vitiligo",
    description: "Loss of skin pigmentation in patches"
  },
  {
    id: "hyperpigmentation",
    label: "Hyperpigmentation",
    description: "Dark patches or uneven skin tone"
  },
  {
    id: "melasma",
    label: "Melasma",
    description: "Brown patches on face, common in melanin-rich skin"
  },
  {
    id: "keratosis_pilaris",
    label: "Keratosis Pilaris",
    description: "Small bumps on upper arms and thighs"
  },
  {
    id: "none",
    label: "No Known Condition",
    description: "No diagnosed skin condition"
  }
];

// Common Allergies/Sensitivities
const COMMON_ALLERGIES = [
  {
    id: "fragrance",
    label: "Fragrance",
    description: "Perfume, essential oils, and synthetic scents"
  },
  {
    id: "vitamin_c",
    label: "Vitamin C",
    description: "May cause irritation or sensitivity in some individuals"
  },
  {
    id: "nuts",
    label: "Nut Oils",
    description: "Almond oil, coconut oil, and other nut-derived products"
  },
  {
    id: "sulfates",
    label: "Sulfates",
    description: "SLS/SLES - harsh cleansing agents"
  },
  {
    id: "alcohol",
    label: "Alcohol",
    description: "Drying alcohols in skincare products"
  },
  {
    id: "benzoyl_peroxide",
    label: "Benzoyl Peroxide",
    description: "Common acne treatment that can irritate sensitive skin"
  },
  {
    id: "salicylic_acid",
    label: "Salicylic Acid",
    description: "Can cause dryness and irritation"
  },
  {
    id: "nickel",
    label: "Nickel",
    description: "Metal sensitivity, common around neck from jewelry"
  },
  {
    id: "heat",
    label: "Heat Rashes",
    description: "Prone to rashes and irritation in hot/humid conditions"
  },
  {
    id: "sun",
    label: "Sun Sensitivity",
    description: "Sensitive to sun exposure, prone to sunburn"
  },
];

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

export const PersonalDetailsForm = () => {
  const { user, updateUserProfile } = useAuth();
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
  const [expandedAllergies, setExpandedAllergies] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        region: user.profile.region || "",
        country: user.profile.country || "",
        otherCountry: user.profile.otherCountry || "",
        fitzpatrickSkinType: user.profile.fitzpatrickSkinType || "",
        skinTypeLastChecked: user.profile.skinTypeLastChecked || "",
        knownSkinConditions: user.profile.knownSkinConditions || [],
        skinConditionLastChecked: user.profile.skinConditionLastChecked || "",
        gender: user.sex || "",
        age: user.profile.age || "",
        knownBodyLotion: user.profile.knownBodyLotion || "",
        bodyLotionBrand: user.profile.bodyLotionBrand || "",
        knownAllergies: user.profile.knownAllergies || [],
        lastSkinTreatment: user.profile.lastSkinTreatment || "",
        lastDermatologistConsultation: user.profile.lastDermatologistConsultation || "",
        appActiveness: user.profile.appActiveness || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConditionToggle = (conditionId: string) => {
    setFormData(prev => ({
      ...prev,
      knownSkinConditions: prev.knownSkinConditions.includes(conditionId)
        ? prev.knownSkinConditions.filter(c => c !== conditionId)
        : [...prev.knownSkinConditions, conditionId]
    }));
  };

  const handleAllergyToggle = (allergyId: string) => {
    setFormData(prev => ({
      ...prev,
      knownAllergies: prev.knownAllergies.includes(allergyId)
        ? prev.knownAllergies.filter(a => a !== allergyId)
        : [...prev.knownAllergies, allergyId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (!user) return;

      const finalCountry = formData.country === "Other" ? formData.otherCountry : formData.country;

      const payload = {
        sex: formData.gender,
        profile: {
          ...user.profile,
          region: formData.region,
          country: finalCountry,
          fitzpatrickSkinType: formData.fitzpatrickSkinType,
          skinTypeLastChecked: formData.skinTypeLastChecked,
          knownSkinConditions: formData.knownSkinConditions,
          skinConditionLastChecked: formData.skinConditionLastChecked,
          age: formData.age,
          knownBodyLotion: formData.knownBodyLotion,
          bodyLotionBrand: formData.bodyLotionBrand,
          knownAllergies: formData.knownAllergies,
          lastSkinTreatment: formData.lastSkinTreatment,
          lastDermatologistConsultation: formData.lastDermatologistConsultation,
          appActiveness: formData.appActiveness,
        }
      };

      await updateUserProfile(payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (error) {
      console.error("Personal Details Sync Failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-sm text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-foreground">Personal Details</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#4DB6AC]">Complete your skin profile for personalized insights</p>
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

      <form onSubmit={handleSubmit} className="space-y-12">
        
        {/* SECTION 1: LOCATION & DEMOGRAPHICS */}
        <div>
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-8">
            <Globe className="text-[#E1784F]" size={18} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Location & Demographics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Region */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Region *</label>
              <div className="relative">
                <select 
                  name="region" 
                  value={formData.region} 
                  onChange={handleChange}
                  required
                  className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all appearance-none"
                >
                  <option value="">Select Region</option>
                  {AFRICAN_REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={16} />
              </div>
              <p className="text-[8px] text-muted-foreground ml-2">For weather-specific skin considerations</p>
            </div>

            {/* Country */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Country *</label>
              <div className="relative">
                <select 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange}
                  required
                  className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all appearance-none"
                >
                  <option value="">Select Country</option>
                  {AFRICAN_COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={16} />
              </div>
            </div>

            {formData.country === "Other" && (
              <motion.div 
                initial={{ opacity: 0, y: -5 }} 
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 md:col-span-2"
              >
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Specify Country</label>
                <input 
                  type="text"
                  name="otherCountry" 
                  value={formData.otherCountry} 
                  onChange={handleChange}
                  placeholder="Enter country name" 
                  className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
                />
              </motion.div>
            )}

            {/* Gender */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Gender *</label>
              <div className="flex gap-2">
                {["female", "male"].map((g) => (
                  <button
                    key={g} 
                    type="button" 
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${formData.gender === g
                        ? "bg-[#E1784F] text-white border-[#E1784F] shadow-lg shadow-[#E1784F]/20"
                        : "bg-muted/40 text-muted-foreground border-transparent hover:border-border"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Age *</label>
              <input 
                type="number" 
                name="age" 
                value={formData.age} 
                onChange={handleChange}
                min="13"
                max="150"
                required
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
                placeholder="18"
              />
              <p className="text-[8px] text-muted-foreground ml-2">Age-related skin conditions vary</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: SKIN CHARACTERISTICS */}
        <div>
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-8">
            <Activity className="text-[#4DB6AC]" size={18} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Skin Characteristics</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Fitzpatrick Skin Type */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Fitzpatrick Skin Type *</label>
              <div className="relative">
                <select 
                  name="fitzpatrickSkinType" 
                  value={formData.fitzpatrickSkinType} 
                  onChange={handleChange}
                  required
                  className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all appearance-none"
                >
                  <option value="">Select Skin Type</option>
                  {FITZPATRICK_SKIN_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={16} />
              </div>
            </div>

            {/* Skin Type Last Checked */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Skin Type Check</label>
              <input 
                type="date" 
                name="skinTypeLastChecked" 
                value={formData.skinTypeLastChecked} 
                onChange={handleChange}
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
              />
              <p className="text-[8px] text-muted-foreground ml-2">When you determined your skin type</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: SKIN CONDITIONS */}
        <div>
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-8">
            <AlertTriangle className="text-red-500" size={18} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Known Skin Conditions</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {SKIN_CONDITIONS.map(condition => (
              <button
                key={condition.id}
                type="button"
                onClick={() => handleConditionToggle(condition.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.knownSkinConditions.includes(condition.id)
                    ? "bg-[#E1784F]/10 border-[#E1784F]"
                    : "bg-muted/40 border-border hover:border-[#E1784F]/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{condition.label}</p>
                    <p className="text-[8px] text-muted-foreground mt-1">{condition.description}</p>
                  </div>
                  <div className={`ml-3 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    formData.knownSkinConditions.includes(condition.id)
                      ? "bg-[#E1784F] border-[#E1784F]"
                      : "border-border"
                  }`}>
                    {formData.knownSkinConditions.includes(condition.id) && (
                      <span className="text-white text-[10px] font-black">✓</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Skin Condition Last Checked */}
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Condition Check</label>
            <input 
              type="date" 
              name="skinConditionLastChecked" 
              value={formData.skinConditionLastChecked} 
              onChange={handleChange}
              className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
            />
            <p className="text-[8px] text-muted-foreground ml-2">Last scan or diagnosis date</p>
          </div>
        </div>

        {/* SECTION 4: SKIN CARE PRODUCTS */}
        <div>
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-8">
            <Pill className="text-[#4DB6AC]" size={18} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Skincare & Products</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Known Body Lotion */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Known Body Lotion</label>
              <input 
                type="text" 
                name="knownBodyLotion" 
                value={formData.knownBodyLotion} 
                onChange={handleChange}
                placeholder="E.g., Moisturizing, SPF, etc." 
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
              />
              <p className="text-[8px] text-muted-foreground ml-2">Type or main benefit of your lotion</p>
            </div>

            {/* Body Lotion Brand */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Brand</label>
              <input 
                type="text" 
                name="bodyLotionBrand" 
                value={formData.bodyLotionBrand} 
                onChange={handleChange}
                placeholder="E.g., Vaseline, Palmer's, etc." 
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
              />
            </div>

            {/* Last Skin Treatment */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Skin Treatment</label>
              <input 
                type="date" 
                name="lastSkinTreatment" 
                value={formData.lastSkinTreatment} 
                onChange={handleChange}
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
              />
              <p className="text-[8px] text-muted-foreground ml-2">From AfriDam products or dermatologist</p>
            </div>

            {/* Last Dermatologist Consultation */}
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">Last Consultation</label>
              <input 
                type="date" 
                name="lastDermatologistConsultation" 
                value={formData.lastDermatologistConsultation} 
                onChange={handleChange}
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all" 
              />
              <p className="text-[8px] text-muted-foreground ml-2">Last AfriDam specialist consultation</p>
            </div>
          </div>
        </div>

        {/* SECTION 5: ALLERGIES & SENSITIVITIES */}
        <div>
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-8">
            <Heart className="text-red-500" size={18} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Allergies & Sensitivities</h3>
          </div>

          <p className="text-[9px] text-muted-foreground mb-6 ml-2">Select all that apply. These help us recommend compatible products.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COMMON_ALLERGIES.map(allergy => (
              <button
                key={allergy.id}
                type="button"
                onClick={() => handleAllergyToggle(allergy.id)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  formData.knownAllergies.includes(allergy.id)
                    ? "bg-red-500/10 border-red-500"
                    : "bg-muted/40 border-border hover:border-red-500/50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-foreground">{allergy.label}</p>
                    <p className="text-[8px] text-muted-foreground mt-1">{allergy.description}</p>
                  </div>
                  <div className={`ml-3 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    formData.knownAllergies.includes(allergy.id)
                      ? "bg-red-500 border-red-500"
                      : "border-border"
                  }`}>
                    {formData.knownAllergies.includes(allergy.id) && (
                      <span className="text-white text-[10px] font-black">✓</span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SECTION 6: APP USAGE */}
        <div>
          <div className="flex items-center gap-3 border-b border-border pb-4 mb-8">
            <Activity className="text-[#4DB6AC]" size={18} />
            <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">App Usage</h3>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-2">How Active Are You? *</label>
            <div className="relative">
              <select 
                name="appActiveness" 
                value={formData.appActiveness} 
                onChange={handleChange}
                required
                className="w-full py-4 bg-muted/20 border border-border rounded-xl px-4 text-xs font-bold outline-none focus:border-[#E1784F] transition-all appearance-none"
              >
                <option value="">Select activity level</option>
                <option value="daily">Daily User</option>
                <option value="weekly">Weekly User</option>
                <option value="monthly">Monthly User</option>
                <option value="occasional">Occasional User</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" size={16} />
            </div>
            <p className="text-[8px] text-muted-foreground ml-2">Helps us understand your engagement with AfriDam</p>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-8 border-t border-border flex justify-end">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full md:w-auto px-12 h-16 bg-[#E1784F] text-white rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>
                <Save size={18} />
                Save Personal Details
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
