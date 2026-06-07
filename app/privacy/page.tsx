"use client";

const sections = [
    {
        title: "Data We Collect",
        content:
            "We collect your name, email, and wedding date when you create an account. Face photos uploaded to the Hairstyle Analyzer are processed entirely client-side using MediaPipe and are never sent to or stored on our servers.",
    },
    {
        title: "How We Use Your Data",
        content:
            "Your data is used solely to provide and improve LUNÉVIA services — matching you with artists, managing bookings, and personalising your experience. We do not use your data for advertising.",
    },
    {
        title: "Third-Party Services",
        content:
            "We use Supabase for authentication and database storage, and Google Gemini for AI features. Each service has its own privacy policy. We do not sell your personal data to any third party.",
    },
    {
        title: "AI Features",
        content:
            "Face photos used in the Hairstyle Analyzer are processed locally in your browser. Only extracted facial measurements (ratios, not images) are sent to our AI endpoint. No biometric data is stored.",
    },
    {
        title: "Your Rights",
        content:
            "You may request deletion of your account and all associated data at any time by writing to hello@lunevia.in. We will process your request within 7 business days.",
    },
    {
        title: "Contact",
        content:
            "For any privacy concerns or data requests, contact us at hello@lunevia.in.",
    },
];

export default function PrivacyPage() {
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
                    Privacy Policy
                </h1>
                <p className="font-dm-sans text-xs uppercase tracking-widest text-gold text-center mb-12">
                    Last updated: June 2026
                </p>

                <div className="space-y-8">
                    {sections.map((section) => (
                        <div
                            key={section.title}
                            className="rounded-2xl border border-gold/20 bg-blush/60 p-6"
                        >
                            <h2 className="font-cormorant text-2xl font-semibold text-primary mb-3">
                                {section.title}
                            </h2>
                            <p className="font-dm-sans text-charcoal/70 leading-relaxed">
                                {section.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}