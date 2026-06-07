"use client";

const sections = [
    {
        title: "Acceptance of Terms",
        content:
            "By accessing or using LUNÉVIA, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.",
    },
    {
        title: "What LUNÉVIA Is",
        content:
            "LUNÉVIA is a marketplace that connects brides with bridal beauty artists and salons in Delhi. We facilitate discovery and booking but do not directly provide beauty services. All services are delivered by independent artists listed on the platform.",
    },
    {
        title: "Bookings & Payments",
        content:
            "A booking is confirmed only when the artist explicitly accepts your request. LUNÉVIA is not liable for cancellations, no-shows, or disputes between customers and artists. Any payment disputes must be resolved directly with the artist.",
    },
    {
        title: "AI Features",
        content:
            "AI-powered recommendations — including the LUNÉVIA Concierge, Hairstyle Analyzer, Package Builder, and Bridal Timeline — are for guidance only. Results are based on AI models and may not always be accurate. LUNÉVIA does not guarantee specific outcomes.",
    },
    {
        title: "User Conduct",
        content:
            "You agree not to misuse the platform, post false reviews, impersonate others, or use the AI features for any purpose other than personal bridal planning. LUNÉVIA reserves the right to suspend accounts that violate these terms.",
    },
    {
        title: "Intellectual Property",
        content:
            "All content on LUNÉVIA — including the brand, design system, and AI features — is the intellectual property of LUNÉVIA. You may not reproduce or distribute any part of the platform without written permission.",
    },
    {
        title: "Limitation of Liability",
        content:
            "LUNÉVIA is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability is limited to the amount paid for the booking in question.",
    },
    {
        title: "Contact",
        content:
            "Questions about these terms? Write to us at hello@lunevia.in.",
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-cream px-4 py-24">
            <div className="mx-auto max-w-2xl">
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
                    Terms of Service
                </h1>
                <p className="font-dm-sans text-xs uppercase tracking-widest text-gold text-center mb-12">
                    Last updated: June 2026
                </p>

                <div className="space-y-6">
                    {sections.map((section, i) => (
                        <div
                            key={section.title}
                            className="rounded-2xl border border-gold/20 bg-blush/60 p-6"
                        >
                            <div className="flex items-start gap-4">
                                <span className="font-cormorant text-3xl text-gold/30 leading-none mt-1">
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <div>
                                    <h2 className="font-cormorant text-2xl font-semibold text-primary mb-2">
                                        {section.title}
                                    </h2>
                                    <p className="font-dm-sans text-charcoal/70 leading-relaxed">
                                        {section.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}