"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        interest: "general"
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        setTimeout(() => {
            setIsSubmitted(false);
            setFormData({
                name: "",
                email: "",
                phone: "",
                subject: "",
                message: "",
                interest: "general"
            });
        }, 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div>
            <h2 className="text-black mb-2 font-semibold">Send us a Message</h2>
            <p className="text-slate-600 mb-8">
                Fill out the form below and our team will get back to you within 24 hours.
            </p>

            {isSubmitted ? (
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-primary mb-2">Message Sent!</h3>
                    <p className="text-slate-600">
                        Thank you for reaching out. We&apos;ll be in touch soon.
                    </p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-slate-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
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
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div>
                        <label htmlFor="interest" className="block text-slate-700 mb-2">
                            I&#39;m interested in *
                        </label>
                        <select
                            id="interest"
                            name="interest"
                            value={formData.interest}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                        >
                            <option value="general">General Inquiry</option>
                            <option value="ai-consultation">AI Skin Consultation</option>
                            <option value="product">Product Information</option>
                            <option value="partnership">Partnership Opportunities</option>
                            <option value="support">Customer Support</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="subject" className="block text-slate-700 mb-2">
                            Subject *
                        </label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="How can we help you?"
                        />
                    </div>

                    <div>
                        <label htmlFor="message" className="block text-slate-700 mb-2">
                            Message *
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={5}
                            className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                            placeholder="Tell us more about your inquiry..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 hover:ring-primary text-white py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        Send Message
                    </button>
                </form>
            )}
        </div>
    );
}
