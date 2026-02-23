"use client";

import { Check, Send, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * 🛡️ AFRIDAM CARE HUB: CONTACT FORM (Rule 6 Synergy)
 * Version: 2026.1.25
 * Focus: High-Precision Support Handshake & Mobile-First Inputs.
 */

const API_ENDPOINT = "https://afridam-backend-prod-107032494605.us-central1.run.app/api/docs";

interface FormData {
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
}

const INQUIRY_TYPES = [
  { value: "general", label: "General Support" },
  { value: "ai-consultation", label: "Dermal Analysis Help" },
  { value: "product", label: "Care Shop Support" },
  { value: "partnership", label: "Clinical Partnerships" },
] as const;

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  title: "general",
  description: "",
};

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit: ${response.status}`);
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData(initialFormData);
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative text-left">
      <AnimatePresence mode="wait">
        {isSubmitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[#4DB6AC]/5 border border-[#4DB6AC]/20 rounded-[2.5rem] p-10 text-center py-20"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4DB6AC] text-white mb-6 shadow-xl shadow-[#4DB6AC]/20"
            >
              <Check className="w-10 h-10" strokeWidth={3} />
            </motion.div>
            <h3 className="text-3xl font-black italic tracking-tighter text-[#4DB6AC] mb-2">
              Message Sent
            </h3>
            <p className="text-[9px] font-black tracking-[0.4em] opacity-40 leading-relaxed max-w-[240px] mx-auto">
              Our clinical team will reach out to you shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-[0.3em] opacity-40 ml-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter your name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-[0.3em] opacity-40 ml-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-[0.3em] opacity-40 ml-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="+234..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black tracking-[0.3em] opacity-40 ml-2">
                  Inquiry Type
                </label>
                <div className="relative">
                  <select
                    name="title"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    required
                    disabled={isSubmitting}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl px-6 py-5 font-bold focus:border-[#E1784F] outline-none appearance-none cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {INQUIRY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20 text-[10px]">
                    ▼
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black tracking-[0.3em] opacity-40 ml-2">
                Message
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                required
                rows={4}
                disabled={isSubmitting}
                className="w-full bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-[2rem] px-6 py-6 font-bold focus:border-[#E1784F] outline-none resize-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="How can we help your skin journey today?"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-20 bg-[#E1784F] text-white rounded-[2rem] font-black text-[10px] tracking-[0.4em] shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send size={18} />}
              {isSubmitting ? "Syncing..." : "Send Message"}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
