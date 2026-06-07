"use client";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-cream px-4 py-24">
            <div className="mx-auto max-w-xl">
                {/* Ornament */}
                <div className="mb-8 text-center">
                    <svg width="48" height="12" viewBox="0 0 120 24" fill="none" className="mx-auto">
                        <line x1="0" y1="12" x2="42" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity="0.5" />
                        <circle cx="52" cy="12" r="3" fill="#C9933A" fillOpacity="0.7" />
                        <circle cx="60" cy="12" r="5" fill="none" stroke="#C9933A" strokeWidth="1" strokeOpacity="0.8" />
                        <circle cx="68" cy="12" r="3" fill="#C9933A" fillOpacity="0.7" />
                        <line x1="78" y1="12" x2="120" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity="0.5" />
                    </svg>
                </div>

                <h1 className="font-cormorant text-5xl font-semibold text-primary mb-2 text-center">
                    Contact Us
                </h1>
                <p className="font-dm-sans text-charcoal/60 text-center mb-12">
                    We would love to hear from you.
                </p>

                <div className="space-y-4">
                    {[
                        { label: "Email", value: "hello@lunevia.in", icon: "✉️" },
                        { label: "Instagram", value: "@lunevia.in", icon: "📸" },
                        { label: "WhatsApp", value: "+91 98765 43210", icon: "💬" },
                        { label: "Location", value: "Delhi, India", icon: "📍" },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-4 rounded-2xl border border-gold/20 bg-blush/60 p-5"
                        >
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                                <p className="font-dm-sans text-xs uppercase tracking-widest text-gold mb-0.5">
                                    {item.label}
                                </p>
                                <p className="font-dm-sans text-charcoal">{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 rounded-2xl border border-gold/20 bg-blush/60 p-6">
                    <p className="font-cormorant text-2xl text-primary mb-4">Send a Message</p>
                    <div className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your name"
                            className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        />
                        <textarea
                            rows={4}
                            placeholder="Your message..."
                            className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                        />
                        <button className="w-full rounded-xl bg-gold py-3 font-dm-sans text-sm font-semibold text-cream hover:bg-gold/90 transition-colors">
                            Send Message
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}