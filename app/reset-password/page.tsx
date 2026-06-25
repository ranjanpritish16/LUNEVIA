// app/reset-password/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion } from "framer-motion";

function ResetPasswordContent() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        // Supabase automatically parses the recovery token from the URL hash
        // and fires this event once the recovery session is established.
        const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
            if (event === "PASSWORD_RECOVERY") {
                setIsReady(true);
            }
        });

        // Fallback: if a session already exists by the time this mounts
        // (e.g. fast redirect), allow the form anyway.
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) setIsReady(true);
        });

        return () => subscription.subscription.unsubscribe();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setMessage(null);

        if (password.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters." });
            return;
        }
        if (password !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });
        setLoading(false);

        if (error) {
            setMessage({ type: "error", text: error.message });
        } else {
            setMessage({ type: "success", text: "Password updated! Redirecting to sign in..." });
            await supabase.auth.signOut();
            setTimeout(() => router.replace("/login"), 1500);
        }
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cream px-4">
            <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose/10 blur-[120px]" />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="overflow-hidden rounded-3xl border border-gold/20 bg-blush/60 px-8 py-10 shadow-[0_8px_48px_rgba(201,147,58,0.12)] backdrop-blur-sm">
                    <div className="mb-2 text-center">
                        <Link href="/" className="font-cormorant text-3xl font-semibold tracking-wide text-gold">
                            LUNÉVIA
                        </Link>
                    </div>

                    <h2 className="mb-1 text-center font-cormorant text-3xl font-semibold text-primary">
                        Set New Password
                    </h2>
                    <p className="mb-7 text-center font-dm-sans text-sm text-charcoal/60">
                        Choose a new password for your account.
                    </p>

                    {!isReady ? (
                        <p className="text-center font-dm-sans text-sm text-charcoal/50">
                            Verifying reset link...
                        </p>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                                />
                            </div>

                            {message && (
                                <div className={`rounded-lg px-4 py-2 font-dm-sans text-sm ${message.type === "error" ? "border border-rose/20 bg-rose/10 text-rose" : "border border-gold/20 bg-gold/10 text-charcoal"}`}>
                                    {message.text}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-xl bg-gold py-3.5 font-dm-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(201,147,58,0.35)] transition-all hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream" />}>
            <ResetPasswordContent />
        </Suspense>
    );
}