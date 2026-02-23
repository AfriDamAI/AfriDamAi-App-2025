"use client";

import { Check, Send, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  title: string;
  description: string;
}

interface FormState {
  data: FormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

const API_ENDPOINT = "https://afridam-backend-prod-107032494605.us-central1.run.app/api/docs";

const INQUIRY_TYPES = [
  { value: "general", label: "General Inquiry" },
  { value: "ai-consultation", label: "AI Skin Consultation" },
  { value: "product", label: "Product Information" },
  { value: "partnership", label: "Partnership Opportunities" },
  { value: "support", label: "Customer Support" },
] as const;

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  title: "general",
  description: "",
};

export function ContactForm() {
  const [state, setState] = useState<FormState>({
    data: initialFormData,
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  });

  const updateField = (field: keyof FormData, value: string) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      error: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState((prev) => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(state.data),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit form: ${response.status}`);
      }

      setState({
        data: initialFormData,
        isSubmitting: false,
        isSubmitted: true,
        error: null,
      });

      setTimeout(() => {
        setState((prev) => ({ ...prev, isSubmitted: false }));
      }, 3000);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : "An error occurred. Please try again.",
      }));
    }
  };

  const { data, isSubmitting, isSubmitted, error } = state;

  if (isSubmitted) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Check className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-primary mb-2 font-semibold">Message Sent!</h3>
        <p className="text-slate-600">
          Thank you for reaching out. We'll be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-black mb-2 font-semibold">Send us a Message</h2>
      <p className="text-slate-600 mb-8">
        Fill out the form below and our team will get back to you within 24 hours.
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-slate-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name}
            onChange={(e) => updateField("name", e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-slate-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={data.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={data.phone}
            onChange={(e) => updateField("phone", e.target.value)}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div>
          <label htmlFor="title" className="block text-slate-700 mb-2">
            Inquiry Type *
          </label>
          <select
            id="title"
            name="title"
            value={data.title}
            onChange={(e) => updateField("title", e.target.value)}
            required
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {INQUIRY_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-slate-700 mb-2">
            Message *
          </label>
          <textarea
            id="description"
            name="description"
            value={data.description}
            onChange={(e) => updateField("description", e.target.value)}
            required
            rows={5}
            disabled={isSubmitting}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="Tell us more about your inquiry..."
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 hover:ring-primary text-white py-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
