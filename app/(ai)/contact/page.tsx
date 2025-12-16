import { Clock, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { ProductShowcase } from "@/components/product-showcase";
import { ImageWithFallback } from "@/components/image-fallback";
import Image from "next/image";

export default function App() {
    return (
        <div className="min-h-screen bg-white">
            <div className="relative py-16 lg:py-24 overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/Save.jpg"
                        alt="Skincare background"
                        fill
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-slate-800/75 to-black/70"></div>
                </div>

                {/* Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                        <Mail className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-white mb-4">Get in Touch</h1>
                    <p className="text-white/90 max-w-2xl mx-auto">
                        Have questions about our AI-powered skincare solutions? We're here to help you find the perfect products for your skin.
                    </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                    <ContactForm />
                    <div>
                        <h2 className="text-emerald-900 mb-2">Contact Information</h2>
                        <p className="text-slate-600 mb-8">
                            Reach out to us through any of these channels. We're always happy to help.
                        </p>

                        <div className="space-y-6 mb-12">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-slate-900 mb-1">Address</h3>
                                    <p className="text-slate-600">
                                        Afridamai Technologies<br />
                                        Innovation Hub, Tech District<br />
                                        Kigali, Rwanda
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-slate-900 mb-1">Phone</h3>
                                    <a href="tel:+250788123456" className="text-primary hover:text-primary/80 transition-colors">
                                        +250 788 123 456
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-slate-900 mb-1">Email</h3>
                                    <a href="mailto:info@afridamai.com" className="text-primary hover:text-primary/80 transition-colors">
                                        info@afridamai.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-slate-900 mb-1">Business Hours</h3>
                                    <p className="text-slate-600">
                                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                                        Saturday: 10:00 AM - 4:00 PM<br />
                                        Sunday: Closed
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary/5 to-rose-50 rounded-2xl p-8 border border-primary/20">
                            <div className="flex items-start gap-3 mb-4">
                                <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="text-primary mb-2">AI-Powered Skincare</h3>
                                    <p className="text-slate-600 mb-4">
                                        Experience personalized skincare recommendations powered by artificial intelligence. Our advanced AI technology analyzes your skin type and concerns to suggest the perfect products for you.
                                    </p>
                                    <a
                                        href="#products"
                                        className="inline-block bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors"
                                    >
                                        Explore Products
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ProductShowcase />
            {/* <Footer /> */}
        </div>
    );
}
