"use client";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-cream px-4 py-24">
            <div className="mx-auto max-w-2xl">
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

                <h1 className="font-cormorant text-5xl font-semibold text-primary mb-4 text-center">
                    About LUNÉVIA
                </h1>
                <p className="font-dm-sans text-xs uppercase tracking-widest text-gold text-center mb-12">
                    Delhi's most trusted bridal beauty platform
                </p>

                <div className="space-y-6 font-dm-sans text-charcoal/70 text-lg leading-relaxed">
                    <p>
                        In India, a bride spends ₹1–5 lakh on her bridal look — yet the booking
                        experience is fragmented across WhatsApp groups, Instagram DMs, and
                        word-of-mouth. The process is stressful, opaque, and unworthy of the
                        most important day of her life.
                    </p>
                    <p>
                        LUNÉVIA was built to change that. We bring the entire bridal beauty
                        journey into one intelligent platform: AI-matched stylists, curated
                        packages, verified portfolios, and a personal LUNÉVIA Concierge that
                        helps every bride find her perfect look.
                    </p>
                    <p>
                        We are starting with Delhi — the wedding capital of India — and building
                        the platform that brides deserve.
                    </p>
                </div>

                {/* Stats */}
                <div className="mt-16 grid grid-cols-3 gap-6 text-center">
                    {[
                        { number: "2,400+", label: "Verified Artists" },
                        { number: "15,000+", label: "Weddings" },
                        { number: "₹2.1Cr+", label: "Bookings Facilitated" },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-2xl border border-gold/20 bg-blush/60 p-6">
                            <p className="font-cormorant text-3xl font-semibold text-gold">{stat.number}</p>
                            <p className="font-dm-sans text-xs uppercase tracking-widest text-charcoal/60 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <span className="inline-block px-8 py-3 rounded-full border border-gold/40 text-gold font-dm-sans text-sm tracking-widest uppercase">
                        AI Startup Buildathon 2026
                    </span>
                </div>
            </div>
        </div>
    );
}