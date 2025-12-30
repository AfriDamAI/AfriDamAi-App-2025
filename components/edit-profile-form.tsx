
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/providers/auth-provider";

export const EditProfileForm = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNo: "",
    sex: "",
    ageRange: 0,
    skinType: "",
    knownSkinAllergies: "",
    previousTreatments: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phoneNo: user.phoneNo || "",
        sex: user.sex || "",
        ageRange: user.profile?.ageRange || 0,
        skinType: user.profile?.skinType || "",
        knownSkinAllergies: user.profile?.knownSkinAllergies?.join(", ") || "",
        previousTreatments: user.profile?.previousTreatments?.join(", ") || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      if (!user) return;
      const { firstName, lastName, phoneNo, sex, ...profileData } = formData;
      const payload = {
        firstName,
        lastName,
        phoneNo,
        sex,
        profile: {
          ...user.profile,
          ageRange: Number(profileData.ageRange),
          skinType: profileData.skinType,
          knownSkinAllergies: profileData.knownSkinAllergies.split(",").map(s => s.trim()),
          previousTreatments: profileData.previousTreatments.split(",").map(s => s.trim()),
        }
      };
      await updateUserProfile(payload);
      setSuccess(true);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-black text-foreground mb-1 tracking-tight">Edit Profile</h2>
          <p className="text-sm font-medium text-muted-foreground">Keep your skin profile and contact info up to date.</p>
        </div>
        {success && (
          <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-2 rounded-xl flex items-center gap-2 animate-bounce-short">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            <span className="text-sm font-bold">Success! Profile updated.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Personal Info Section */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">General Info</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-muted/40 border-2 border-transparent focus:border-primary/30 focus:bg-card rounded-xl text-foreground font-bold transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-muted/40 border-2 border-transparent focus:border-primary/30 focus:bg-card rounded-xl text-foreground font-bold transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Biological Sex</label>
            <div className="flex gap-2">
              {["male", "female", "other"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFormData({ ...formData, sex: s })}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 ${formData.sex === s
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                      : "bg-muted/40 text-muted-foreground border-transparent hover:border-border"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-muted/40 border-2 border-transparent focus:border-primary/30 focus:bg-card rounded-xl text-foreground font-bold transition-all outline-none"
              placeholder="+123..."
            />
          </div>
        </div>

        {/* Vertical Divider for desktop */}
        <div className="hidden md:block w-px bg-border self-stretch" />

        {/* Skin Care Details Section */}
        <div className="md:col-span-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-600/10 flex items-center justify-center text-orange-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.477 2.387a2 2 0 00.547 1.022l1.428 1.428a2 2 0 001.022.547l2.387.477a2 2 0 001.96-1.414l.477-2.387a2 2 0 00-.547-1.022l-1.428-1.428z"></path></svg>
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Skin Profile</h3>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Age Range</label>
              <input
                type="number"
                name="ageRange"
                value={formData.ageRange}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-muted/40 border-2 border-transparent focus:border-primary/30 focus:bg-card rounded-xl text-foreground font-bold transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Skin Type</label>
              <select
                name="skinType"
                value={formData.skinType}
                onChange={(e) => setFormData({ ...formData, skinType: e.target.value })}
                className="w-full px-4 py-3 bg-muted/40 border-2 border-transparent focus:border-primary/30 focus:bg-card rounded-xl text-foreground font-bold transition-all outline-none appearance-none"
              >
                <option value="">Select Type</option>
                <option value="oily">Oily</option>
                <option value="dry">Dry</option>
                <option value="normal">Normal</option>
                <option value="sensitive">Sensitive</option>
                <option value="combination">Combination</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Known Skin Allergies</label>
            <textarea
              name="knownSkinAllergies"
              value={formData.knownSkinAllergies}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-muted/40 border-2 border-transparent focus:border-primary/30 focus:bg-card rounded-xl text-foreground font-bold transition-all outline-none resize-none"
              placeholder="Nut allergies, Nickel, etc (comma separated)"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1">Previous Treatments</label>
            <textarea
              name="previousTreatments"
              value={formData.previousTreatments}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 bg-muted/40 border-2 border-transparent focus:border-primary/30 focus:bg-card rounded-xl text-foreground font-bold transition-all outline-none resize-none"
              placeholder="Laser, Peels, etc (comma separated)"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full group bg-primary hover:bg-orange-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-70 disabled:active:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                  <span className="uppercase tracking-widest text-sm">Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
