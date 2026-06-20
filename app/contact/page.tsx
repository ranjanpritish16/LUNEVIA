"use client";

import { useState } from "react";

export default function ContactPage() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  
    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus("loading");
        
        const formData = new FormData(e.currentTarget);
        
        try {
            const res = await fetch("https://formsubmit.co/ajax/hello.luneviaa@gmail.com", {
                method: "POST",
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });
            
            if (res.ok) {
                setStatus("success");
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus("error");
            }
        } catch (err) {
            setStatus("error");
        }
    }

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
                        { label: "Email", value: "hello.luneviaa@gmail.com", icon: "✉️" },
                        { label: "Instagram", value: "@lunevia.in", icon: "📸" },
                        { label: "WhatsApp", value: "+91 7903912585", icon: "💬" },
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
                    
                    {status === "success" ? (
                        <div className="rounded-xl border border-gold/30 bg-cream p-6 text-center">
                            <span className="text-3xl mb-2 block">✨</span>
                            <p className="font-cormorant text-xl text-primary mb-2">Message Sent!</p>
                            <p className="font-dm-sans text-sm text-charcoal/70">
                                Thank you for reaching out. We will get back to you shortly.
                            </p>
                            <button 
                                onClick={() => setStatus("idle")}
                                className="mt-4 text-xs font-dm-sans text-gold hover:underline"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Honeypot for spam bots */}
                            <input type="text" name="_honey" style={{ display: "none" }} />
                            {/* Disable Captcha */}
                            <input type="hidden" name="_captcha" value="false" />
                            
                            <input
                                type="text"
                                name="name"
                                required
                                placeholder="Your name"
                                className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            />
                            <input
                                type="email"
                                name="email"
                                required
                                placeholder="your@email.com"
                                className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            />
                            <textarea
                                name="message"
                                required
                                rows={4}
                                placeholder="Your message..."
                                className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-none"
                            />
                            
                            {status === "error" && (
                                <p className="font-dm-sans text-xs text-rose">
                                    Something went wrong. Please try again later.
                                </p>
                            )}

                            <button 
                                type="submit" 
                                disabled={status === "loading"}
                                className="w-full rounded-xl bg-gold py-3 font-dm-sans text-sm font-semibold text-cream hover:bg-gold/90 transition-colors disabled:opacity-50"
                            >
                                {status === "loading" ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}