"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "signin" | "signup" | "forgot";

// ✅ Inner component that uses useSearchParams
function CustomerLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "/";
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string; link?: { href: string; label: string } } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === "signin") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else if (data.user) {
        // Check the user's role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", data.user.id)
          .single();

        if (profile?.role === "artist") {
          setMessage({
            type: "error",
            text: "This account is registered as an artist. Please use the artist login instead.",
            link: { href: "/artist/login", label: "Go to artist login" },
          });
          await supabase.auth.signOut();
        } else {
          // If profile is incomplete, force them to profile page
          if (!profile?.full_name) {
            router.replace("/profile");
          } else {
            router.replace(nextUrl);
          }
        }
      }
    } else if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
        },
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        // Explicitly upsert profile with role: 'customer'
        if (data.user) {
          await supabase.from("profiles").upsert({ id: data.user.id, role: "customer" });
        }
        setMessage({ type: "success", text: "Account created! Check your email to verify your address." });
      }
    } else if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login/customer` : undefined,
      });
      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Password reset link sent! Check your inbox." });
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: typeof window !== "undefined" ? `${window.location.origin}${nextUrl}` : undefined },
    });
    void error;
  };

  const handleGithubLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: typeof window !== "undefined" ? `${window.location.origin}${nextUrl}` : undefined },
    });
  };

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setMessage(null);
    setPassword("");
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-cream px-4">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose/10 blur-[120px]" />

      <Link href="/login" className="absolute left-6 top-6 flex items-center gap-2 font-dm-sans text-sm text-charcoal/60 transition-colors hover:text-gold">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to LUNÉVIA
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-6 text-center">
          <svg width="48" height="12" viewBox="0 0 120 24" fill="none" className="mx-auto" aria-hidden="true">
            <line x1="0" y1="12" x2="42" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity="0.5" />
            <circle cx="52" cy="12" r="3" fill="#C9933A" fillOpacity="0.7" />
            <circle cx="60" cy="12" r="5" fill="none" stroke="#C9933A" strokeWidth="1" strokeOpacity="0.8" />
            <circle cx="68" cy="12" r="3" fill="#C9933A" fillOpacity="0.7" />
            <line x1="78" y1="12" x2="120" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity="0.5" />
          </svg>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gold/20 bg-blush/60 px-8 py-10 shadow-[0_8px_48px_rgba(201,147,58,0.12)] backdrop-blur-sm">
          <div className="mb-2 text-center">
            <Link href="/" className="font-cormorant text-3xl font-semibold tracking-wide text-gold">
              LUNÉVIA
            </Link>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <h2 className="mb-1 text-center font-cormorant text-3xl font-semibold text-primary">
                {mode === "signin" ? "Welcome back" : mode === "signup" ? "Create account" : "Reset password"}
              </h2>
              <p className="mb-7 text-center font-dm-sans text-sm text-charcoal/60">
                {mode === "signin"
                  ? "Sign in to continue to LUNÉVIA."
                  : mode === "signup"
                    ? "Join Delhi's most trusted bridal platform."
                    : "We'll send a reset link to your inbox."}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1.5 block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">
                    Email Address
                  </label>
                  <div className="relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full rounded-xl border border-gold/30 bg-cream py-3 pl-11 pr-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                </div>

                {mode !== "forgot" && (
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <label htmlFor="password" className="block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">
                        Password
                      </label>
                      {mode === "signin" && (
                        <button type="button" onClick={() => switchMode("forgot")} className="font-dm-sans text-xs font-medium text-gold transition-colors hover:text-gold/70">
                          Forgot?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                      </svg>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-gold/30 bg-cream py-3 pl-11 pr-11 font-dm-sans text-sm text-primary placeholder-charcoal/30 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                      <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/30 transition-colors hover:text-charcoal/60" aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {message && (
                  <div className={`rounded-lg px-4 py-2 font-dm-sans text-sm ${message.type === "error" ? "border border-rose/20 bg-rose/10 text-rose" : "border border-gold/20 bg-gold/10 text-charcoal"}`}>
                    <p>{message.text}</p>
                    {message.link && (
                      <Link href={message.link.href} className="mt-1 inline-block font-medium underline underline-offset-2">
                        {message.link.label}
                      </Link>
                    )}
                  </div>
                )}

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full rounded-xl bg-gold py-3.5 font-dm-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(201,147,58,0.35)] transition-all duration-300 hover:bg-gold/90 hover:shadow-[0_4px_24px_rgba(201,147,58,0.5)] disabled:cursor-not-allowed disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Please wait...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </span>
                  )}
                </motion.button>
              </form>

              {mode !== "forgot" && (
                <>
                  <div className="my-5 flex items-center gap-4">
                    <div className="h-px flex-1 bg-gold/20" />
                    <span className="font-dm-sans text-xs uppercase tracking-widest text-charcoal/40">Or continue with</span>
                    <div className="h-px flex-1 bg-gold/20" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-2.5 rounded-xl border border-gold/25 bg-cream py-3 font-dm-sans text-sm text-charcoal transition-all hover:border-gold/50 hover:bg-blush">
                      <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                      Google
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleGithubLogin} className="flex items-center justify-center gap-2.5 rounded-xl border border-gold/25 bg-cream py-3 font-dm-sans text-sm text-charcoal transition-all hover:border-gold/50 hover:bg-blush">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                      GitHub
                    </motion.button>
                  </div>
                </>
              )}

              <p className="mt-6 text-center font-dm-sans text-sm text-charcoal/60">
                {mode === "signin" ? (
                  <>Don&apos;t have an account?{" "}<button onClick={() => switchMode("signup")} className="font-medium text-gold transition-colors hover:text-gold/70">Sign up here</button></>
                ) : mode === "signup" ? (
                  <>Already have an account?{" "}<button onClick={() => switchMode("signin")} className="font-medium text-gold transition-colors hover:text-gold/70">Sign in</button></>
                ) : (
                  <>Remembered it?{" "}<button onClick={() => switchMode("signin")} className="font-medium text-gold transition-colors hover:text-gold/70">Back to sign in</button></>
                )}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <svg width="48" height="12" viewBox="0 0 120 24" fill="none" className="mx-auto mb-4" aria-hidden="true">
            <line x1="0" y1="12" x2="42" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity="0.3" />
            <circle cx="52" cy="12" r="3" fill="#C9933A" fillOpacity="0.4" />
            <circle cx="60" cy="12" r="5" fill="none" stroke="#C9933A" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="68" cy="12" r="3" fill="#C9933A" fillOpacity="0.4" />
            <line x1="78" y1="12" x2="120" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity="0.3" />
          </svg>
          <p className="font-dm-sans text-xs text-charcoal/40">
            &copy; 2026 LUNÉVIA · Delhi&apos;s most trusted bridal beauty platform
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ✅ Default export wraps CustomerLoginContent in Suspense
export default function CustomerLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <CustomerLoginContent />
    </Suspense>
  );
}
