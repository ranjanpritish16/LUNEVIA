"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";
import { Upload, X, Plus, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Constants ────────────────────────────────────────────────────────
const LOCALITIES = ["Lajpat Nagar", "Hauz Khas", "Punjabi Bagh", "South Ex", "Greater Kailash", "Karol Bagh", "Rohini", "Dwarka", "Vasant Kunj", "Saket"];
const SPECIALTY_OPTIONS = ["Bridal Makeup", "Mehendi", "Hair Styling", "Pre-Bridal Packages"];
const SERVICE_CATEGORIES = ["Bridal Makeup", "Pre-Bridal", "Hair", "Mehendi", "Other"];
const STEP_LABELS = ["Basics", "Contact", "Services", "Photo"];

interface ServiceRow {
  id: string; name: string; duration: string; price: string; category: string;
}

interface WizardState {
  name: string; locality: string; specialty: string[]; description: string;
  phone: string; address: string; instagram: string; whatsapp: string; email: string;
  services: ServiceRow[]; coverImageFile: File | null; coverPreview: string;
}

function newService(): ServiceRow {
  return { id: Math.random().toString(36).slice(2), name: "", duration: "", price: "", category: "Bridal Makeup" };
}

function generateSlug(name: string): string {
  const base = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

// ── Shared input styles ──────────────────────────────────────────────
const inputCls = "w-full rounded-xl border border-gold/30 bg-cream px-4 py-3 font-dm-sans text-sm text-primary placeholder-charcoal/30 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";
const labelCls = "mb-1.5 block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50";

// ── Progress bar ─────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8 flex flex-col items-center gap-2">
      <div className="flex items-center gap-2">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className={cn("h-2.5 w-2.5 rounded-full transition-all duration-300", i < step ? "bg-gold scale-110" : i === step ? "bg-gold ring-2 ring-gold/30" : "bg-gold/25")} />
              <span className={cn("hidden font-dm-sans text-[10px] uppercase tracking-widest md:block", i === step ? "text-gold" : "text-charcoal/30")}>{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={cn("mb-3 h-px w-10 transition-colors duration-300 md:w-16", i < step ? "bg-gold/60" : "bg-gold/20")} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 1: Basics ───────────────────────────────────────────────────
function Step1({ state, set }: { state: WizardState; set: (p: Partial<WizardState>) => void }) {
  const toggleSpecialty = (tag: string) =>
    set({ specialty: state.specialty.includes(tag) ? state.specialty.filter(s => s !== tag) : [...state.specialty, tag] });

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-cormorant text-3xl font-semibold text-primary">Tell us about your salon</h2>
        <p className="mt-1 font-dm-sans text-sm text-charcoal/50">These details appear on your public profile.</p>
      </div>
      <div>
        <label className={labelCls}>Salon / Studio Name <span className="text-rose">*</span></label>
        <input className={inputCls} placeholder="e.g. Neha Kapoor Bridal Studio" value={state.name} onChange={e => set({ name: e.target.value })} />
      </div>
      <div>
        <label className={labelCls}>Locality <span className="text-rose">*</span></label>
        <select className={inputCls} value={state.locality} onChange={e => set({ locality: e.target.value })}>
          <option value="">Select area…</option>
          {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Specialties <span className="text-rose">*</span></label>
        <div className="flex flex-wrap gap-2 pt-1">
          {SPECIALTY_OPTIONS.map(tag => (
            <button key={tag} type="button" onClick={() => toggleSpecialty(tag)}
              className={cn("rounded-full border px-4 py-2 font-dm-sans text-sm transition-all", state.specialty.includes(tag) ? "border-gold bg-gold/10 font-medium text-gold" : "border-gold/25 bg-cream text-charcoal/60 hover:border-gold/50")}>
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className={labelCls}>Description <span className="text-rose">*</span> <span className="normal-case tracking-normal text-charcoal/40">({state.description.length}/500, min 50)</span></label>
        <textarea className={cn(inputCls, "resize-none")} rows={4} placeholder="Describe your studio, your specialties, and what makes you unique…" value={state.description} onChange={e => set({ description: e.target.value.slice(0, 500) })} />
      </div>
    </div>
  );
}

// ── Step 2: Contact ──────────────────────────────────────────────────
function Step2({ state, set }: { state: WizardState; set: (p: Partial<WizardState>) => void }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-cormorant text-3xl font-semibold text-primary">How can brides reach you?</h2>
        <p className="mt-1 font-dm-sans text-sm text-charcoal/50">Required details help brides contact and find you.</p>
      </div>
      <div>
        <label className={labelCls}>Phone Number <span className="text-rose">*</span></label>
        <input className={inputCls} type="tel" placeholder="98765 43210" value={state.phone} onChange={e => set({ phone: e.target.value })} />
      </div>
      <div>
        <label className={labelCls}>Full Address <span className="text-rose">*</span></label>
        <textarea className={cn(inputCls, "resize-none")} rows={3} placeholder="e.g. F-14, First Floor, Lajpat Nagar II, New Delhi – 110024" value={state.address} onChange={e => set({ address: e.target.value })} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Instagram Handle</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-dm-sans text-sm text-charcoal/40">@</span>
            <input className={cn(inputCls, "pl-8")} placeholder="yourhandle" value={state.instagram} onChange={e => set({ instagram: e.target.value })} />
          </div>
        </div>
        <div>
          <label className={labelCls}>WhatsApp Number</label>
          <input className={inputCls} type="tel" placeholder="98765 43210" value={state.whatsapp} onChange={e => set({ whatsapp: e.target.value })} />
        </div>
      </div>
      <div>
        <label className={labelCls}>Email</label>
        <input className={inputCls} type="email" placeholder="studio@example.com" value={state.email} onChange={e => set({ email: e.target.value })} />
      </div>
    </div>
  );
}

// ── Step 3: Services ─────────────────────────────────────────────────
function Step3({ state, set }: { state: WizardState; set: (p: Partial<WizardState>) => void }) {
  const updateService = (id: string, field: keyof ServiceRow, val: string) =>
    set({ services: state.services.map(s => s.id === id ? { ...s, [field]: val } : s) });
  const removeService = (id: string) => set({ services: state.services.filter(s => s.id !== id) });

  // Rows that won't actually be saved on submit (filter drops anything with no name)
  const incompleteCount = state.services.filter(s => !s.name.trim() && (s.duration.trim() || s.price.trim() || s.category !== "Bridal Makeup")).length;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-cormorant text-3xl font-semibold text-primary">What do you offer?</h2>
        <p className="mt-1 font-dm-sans text-sm text-charcoal/50">Add at least one service to continue.</p>
      </div>
      <div className="space-y-4">
        {state.services.map((svc, i) => {
          const isIncomplete = !svc.name.trim();
          return (
            <div key={svc.id} className={cn("relative rounded-2xl border bg-blush/30 p-4 transition-colors", isIncomplete && (svc.duration.trim() || svc.price.trim()) ? "border-rose/40" : "border-gold/15")}>
              {state.services.length > 1 && (
                <button type="button" onClick={() => removeService(svc.id)} className="absolute right-3 top-3 text-charcoal/30 hover:text-rose" aria-label="Remove">
                  <X size={16} />
                </button>
              )}
              <p className="mb-3 font-dm-sans text-xs font-semibold uppercase tracking-widest text-charcoal/40">Service {i + 1}</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className={labelCls}>Service Name <span className="text-rose">*</span></label>
                  <input className={inputCls} placeholder="e.g. HD Bridal Makeup" value={svc.name} onChange={e => updateService(svc.id, "name", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={inputCls} value={svc.category} onChange={e => updateService(svc.id, "category", e.target.value)}>
                    {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Price (₹) <span className="text-rose">*</span></label>
                  <input className={inputCls} type="number" min="0" placeholder="18000" value={svc.price} onChange={e => updateService(svc.id, "price", e.target.value)} />
                </div>
                <div>
                  <label className={labelCls}>Duration</label>
                  <input className={inputCls} placeholder="e.g. 3 hours" value={svc.duration} onChange={e => updateService(svc.id, "duration", e.target.value)} />
                </div>
              </div>
              {isIncomplete && (svc.duration.trim() || svc.price.trim()) && (
                <p className="mt-2 font-dm-sans text-xs text-rose">This row needs a name or it won't be saved.</p>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" onClick={() => set({ services: [...state.services, newService()] })}
        className="inline-flex items-center gap-2 rounded-xl border border-gold/30 px-4 py-2.5 font-dm-sans text-sm text-gold transition-all hover:bg-gold/10">
        <Plus size={15} /> Add Another Service
      </button>
      {incompleteCount > 0 && (
        <p className="font-dm-sans text-xs text-charcoal/40">
          {incompleteCount} unnamed service{incompleteCount > 1 ? "s" : ""} won't be saved unless you give {incompleteCount > 1 ? "them" : "it"} a name.
        </p>
      )}
    </div>
  );
}

// ── Step 4: Cover Photo ──────────────────────────────────────────────
function Step4({ state, set, error }: { state: WizardState; set: (p: Partial<WizardState>) => void; error: string }) {
  const dropRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    set({ coverImageFile: file, coverPreview: URL.createObjectURL(file) });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-cormorant text-3xl font-semibold text-primary">Show your best work</h2>
        <p className="mt-1 font-dm-sans text-sm text-charcoal/50">This will be the first thing brides see on your profile.</p>
      </div>

      {state.coverPreview ? (
        <div className="relative overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={state.coverPreview} alt="Cover preview" className="h-56 w-full object-cover md:h-72" />
          <button type="button" onClick={() => fileRef.current?.click()}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-white/40 bg-primary/70 px-4 py-2 font-dm-sans text-sm text-cream backdrop-blur-sm hover:bg-primary/90">
            <Upload size={14} /> Change Photo
          </button>
        </div>
      ) : (
        <div ref={dropRef} onDrop={onDrop} onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className="flex h-56 cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gold/30 bg-blush/30 transition-all hover:border-gold/60 hover:bg-blush/50 md:h-72">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-cream text-gold/60">
            <Upload size={24} />
          </div>
          <div className="text-center">
            <p className="font-dm-sans text-sm font-medium text-charcoal/60">Drop your photo here, or <span className="text-gold">browse</span></p>
            <p className="mt-1 font-dm-sans text-xs text-charcoal/40">JPG, PNG or WebP · Recommended 1600×900px</p>
          </div>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden"
        onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />

      {error && (
        <p className="rounded-xl border border-rose/20 bg-rose/10 px-4 py-3 font-dm-sans text-sm text-rose">{error}</p>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────
export default function ArtistOnboardingPage() {
  const router = useRouter();
  const { salon, isLoading } = useArtistSalon();
  const [authChecked, setAuthChecked] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  const [state, setState] = useState<WizardState>({
    name: "", locality: "", specialty: [], description: "",
    phone: "", address: "", instagram: "", whatsapp: "", email: "",
    services: [newService()], coverImageFile: null, coverPreview: "",
  });

  const set = (patch: Partial<WizardState>) => setState(prev => ({ ...prev, ...patch }));

  // Auth + redirect guard
  useEffect(() => {
    async function guard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/artist/login"); return; }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "artist") { router.replace("/login/customer"); return; }

      // Pre-fill email
      set({ email: user.email ?? "" });
      setUserId(user.id);
      setAuthChecked(true);
    }
    guard();
  }, [router]);

  // Redirect if already has salon
  useEffect(() => {
    if (!isLoading && salon) {
      router.replace("/artist/dashboard");
    }
  }, [salon, isLoading, router]);

  // ── Validation per step ──────────────────────────────────────────
  const step1Valid = state.name.trim().length > 0 && state.locality !== "" && state.specialty.length > 0 && state.description.trim().length >= 50;
  const step2Valid = state.phone.replace(/\D/g, "").length >= 10 && state.address.trim().length > 0;
  const step3Valid = state.services.some(s => s.name.trim() && s.price.trim());
  const canContinue = [step1Valid, step2Valid, step3Valid, true][step];

  // Helper text for disabled continue
  const helperText = [
    !state.name.trim() ? "Enter your salon name" : !state.locality ? "Select your locality" : state.specialty.length === 0 ? "Choose at least one specialty" : state.description.trim().length < 50 ? `Description needs ${50 - state.description.trim().length} more characters` : "",
    !state.phone.replace(/\D/g, "").length ? "Enter your phone number" : state.phone.replace(/\D/g, "").length < 10 ? "Enter a valid 10-digit phone number" : !state.address.trim() ? "Enter your full address" : "",
    !step3Valid ? "Add at least one service with a name and price" : "",
    "",
  ][step];

  // ── Navigation ───────────────────────────────────────────────────
  const goNext = () => {
    if (!canContinue) return;
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  // ── Final submit ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!userId) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      let coverUrl: string | null = null;

      // Upload cover image if selected
      if (state.coverImageFile) {
        const ext = state.coverImageFile.name.split(".").pop() ?? "jpg";
        const path = `covers/${userId}-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("salon-covers")
          .upload(path, state.coverImageFile, { upsert: true });

        if (uploadError) {
          // Previously this failed silently and inserted the salon with
          // cover_image: null, leaving the artist unaware their photo
          // never saved. Now we stop and surface it instead.
          setSubmitError(`Your photo couldn't be uploaded (${uploadError.message}). You can try again, or skip the photo and add it later from your dashboard.`);
          setSubmitting(false);
          return;
        }
        const { data } = supabase.storage.from("salon-covers").getPublicUrl(path);
        coverUrl = data.publicUrl;
      }

      const slug = generateSlug(state.name);

      // Derive a real location string instead of hardcoding "Delhi" —
      // prefer the address they typed, fall back to locality, then a
      // generic default rather than silently mislabeling every salon.
      const derivedLocation = state.address.trim()
        ? state.address.trim()
        : state.locality
          ? `${state.locality}, Delhi`
          : "Delhi";

      const { error: insertError } = await supabase.from("salons").insert({
        owner_id: userId,
        name: state.name.trim(),
        slug,
        description: state.description.trim(),
        location: derivedLocation,
        locality: state.locality,
        specialty: state.specialty,
        price_range: "₹₹",
        cover_image: coverUrl,
        gallery_images: [],
        services: state.services.filter(s => s.name.trim()).map(s => ({
          id: s.id, name: s.name.trim(), duration: s.duration.trim(),
          price: Number(s.price) || 0, category: s.category,
        })),
        team: [],
        contact: {
          phone: state.phone, email: state.email,
          instagram: state.instagram, whatsapp: state.whatsapp,
          address: state.address,
        },
        working_hours: {},
        blocked_dates: [],
        is_published: false,
      });

      if (insertError) {
        setSubmitError(insertError.message);
        setSubmitting(false);
        return;
      }

      router.replace("/artist/dashboard");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  // ── Loading / redirect states ────────────────────────────────────
  if (!authChecked || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <span className="font-cormorant text-2xl font-semibold text-gold">LUNÉVIA</span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-gold/20">
            <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gold/60" />
          </div>
        </div>
      </div>
    );
  }

  const stepContent = [
    <Step1 key="s1" state={state} set={set} />,
    <Step2 key="s2" state={state} set={set} />,
    <Step3 key="s3" state={state} set={set} />,
    <Step4 key="s4" state={state} set={set} error={submitError} />,
  ];

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cream px-4 py-12">
      {/* Glow blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose/10 blur-[120px]" />

      {/* Back to login */}
      <Link href="/artist/login" className="absolute left-6 top-6 flex items-center gap-2 font-dm-sans text-sm text-charcoal/50 transition-colors hover:text-gold">
        <ArrowLeft size={15} /> Back
      </Link>

      <div className="relative z-10 w-full max-w-xl">
        {/* Header */}
        <div className="mb-6 text-center">
          <Link href="/" className="font-cormorant text-2xl font-semibold tracking-wide text-gold">LUNÉVIA</Link>
          <p className="mt-1 font-dm-sans text-xs uppercase tracking-widest text-charcoal/40">Setting up your salon</p>
        </div>

        {/* Progress */}
        <ProgressBar step={step} />

        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-gold/20 bg-blush/50 px-6 py-8 shadow-[0_8px_48px_rgba(201,147,58,0.10)] backdrop-blur-sm md:px-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-8 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-4">
              {step > 0 ? (
                <button type="button" onClick={goBack}
                  className="inline-flex items-center gap-2 rounded-xl border border-gold/25 px-5 py-3 font-dm-sans text-sm text-charcoal/70 transition-all hover:border-gold/50 hover:text-charcoal">
                  <ArrowLeft size={15} /> Back
                </button>
              ) : <div />}

              {step < 3 ? (
                <motion.button
                  whileHover={canContinue ? { scale: 1.02 } : {}}
                  whileTap={canContinue ? { scale: 0.98 } : {}}
                  type="button"
                  onClick={goNext}
                  disabled={!canContinue}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-dm-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(201,147,58,0.35)] transition-all hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Continue <ArrowRight size={15} />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-dm-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(201,147,58,0.35)] transition-all hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Setting up…" : "Complete Setup"} {!submitting && <ArrowRight size={15} />}
                </motion.button>
              )}
            </div>

            {/* Helper / Skip text */}
            {!canContinue && helperText && (
              <p className="text-center font-dm-sans text-xs text-charcoal/40">{helperText}</p>
            )}
            {step === 3 && !submitting && (
              <button type="button" onClick={handleSubmit}
                className="text-center font-dm-sans text-xs text-charcoal/40 underline underline-offset-2 hover:text-charcoal/60">
                Skip photo for now, I&apos;ll add it later
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center font-dm-sans text-xs text-charcoal/30">
          Your profile will be saved as a draft — you control when it goes live.
        </p>
      </div>
    </div>
  );
}