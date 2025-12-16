import { ArrowRight, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./image-fallback";

const products = [
    {
        id: 1,
        name: "AI Skin Analysis Serum",
        category: "Serums",
        description: "Advanced formula with hyaluronic acid, recommended by our AI based on your skin profile.",
        image: "https://images.unsplash.com/photo-1643379850623-7eb6442cd262?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHNlcnVtJTIwYm90dGxlfGVufDF8fHx8MTc2NDY5NzQ5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        price: "$89",
        tag: "Best Seller"
    },
    {
        id: 2,
        name: "Natural Radiance Cream",
        category: "Moisturizers",
        description: "Organic ingredients that nourish and protect your skin throughout the day.",
        image: "https://images.unsplash.com/photo-1609357912334-e96886c0212b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc2tpbmNhcmUlMjBjcmVhbXxlbnwxfHx8fDE3NjQ2NjQzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        price: "$65",
        tag: "AI Recommended"
    },
    {
        id: 3,
        name: "Hydration Boost Treatment",
        category: "Treatments",
        description: "Intensive hydration therapy for dry and sensitive skin types.",
        image: "https://images.unsplash.com/photo-1629051192950-d251e96ab1b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYWNlJTIwbW9pc3R1cml6ZXIlMjBwcm9kdWN0fGVufDF8fHx8MTc2NDc0NDc4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        price: "$75",
        tag: "New"
    },
    {
        id: 4,
        name: "Luxury Skincare Set",
        category: "Sets",
        description: "Complete skincare routine curated by our AI for optimal results.",
        image: "https://images.unsplash.com/photo-1760614034530-a0d34463e03d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza2luY2FyZSUyMHByb2R1Y3RzJTIwbHV4dXJ5fGVufDF8fHx8MTc2NDY3NjA3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        price: "$199",
        tag: "Premium"
    }
];

export function ProductShowcase() {
    return (
        <div id="products" className="bg-gradient-to-br from-slate-50 to-primary/5 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
                        <Sparkles className="w-4 h-4" />
                        <span>AI-Powered Recommendations</span>
                    </div>
                    <h2 className="text-primary mb-4">Discover Our Products</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        Explore our collection of premium skincare products, each carefully formulated and selected by our AI to meet your unique skin needs.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer"
                        >
                            <div className="relative overflow-hidden aspect-square">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full">
                                    {product.tag}
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-emerald-600 mb-1">{product.category}</p>
                                <h3 className="text-slate-900 mb-2">{product.name}</h3>
                                <p className="text-slate-600 mb-4 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-primary">{product.price}</span>
                                    <button className="text-primary hover:text-primary/80 flex items-center gap-1 group-hover:gap-2 transition-all">
                                        View
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center">
                    <button className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg transition-colors inline-flex items-center gap-2">
                        View All Products
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>

                <div className="mt-16 bg-white rounded-2xl p-8 lg:p-12 shadow-sm">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-primary mb-4">Get Your Personalized Skincare Routine</h3>
                            <p className="text-slate-600 mb-6">
                                Our AI-powered skin analysis tool creates a customized skincare routine based on your unique skin type, concerns, and goals. Answer a few simple questions and receive personalized product recommendations.
                            </p>
                            <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                Start AI Consultation
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary/5 rounded-xl p-6 text-center">
                                <div className="text-primary mb-2">98%</div>
                                <p className="text-slate-600">Satisfaction Rate</p>
                            </div>
                            <div className="bg-rose-50 rounded-xl p-6 text-center">
                                <div className="text-rose-600 mb-2">50K+</div>
                                <p className="text-slate-600">Happy Customers</p>
                            </div>
                            <div className="bg-primary/5 rounded-xl p-6 text-center">
                                <div className="text-primary mb-2">100%</div>
                                <p className="text-slate-600">Natural Ingredients</p>
                            </div>
                            <div className="bg-rose-50 rounded-xl p-6 text-center">
                                <div className="text-rose-600 mb-2">24/7</div>
                                <p className="text-slate-600">AI Support</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
