"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useArtistSalon, type ArtistSalon } from "@/lib/hooks/useArtistSalon";
import { DashboardShell } from "@/components/artist/DashboardShell";
import { ArrowRight, Plus, Trash2, Upload, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Auth guard (reused pattern) ──────────────────────────────────────
function useArtistAuth() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/artist/login"); return; }
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "artist") { router.replace("/login/customer"); return; }
      setChecking(false);
    }
    check();
  }, [router]);
  return checking;
}

// ── Constants ────────────────────────────────────────────────────────
const LOCALITIES = [
  "Lajpat Nagar", "Hauz Khas", "Punjabi Bagh", "South Ex",
  "Greater Kailash", "Karol Bagh", "Rohini", "Dwarka",
  "Vasant Kunj", "Saket",
];

const SPECIALTY_OPTIONS = [
  "Bridal Makeup", "Mehendi", "Hair Styling", "Pre-Bridal Packages",
];

const PRICE_RANGES = ["₹", "₹₹", "₹₹₹"] as const;
type PriceRange = (typeof PRICE_RANGES)[number];

// ── Input component (consistent with existing login styles) ──────────
function FormInput({ label, id, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">
        {label}
      </label>
      <input
        id={id}
        {...props}
        className={cn(
          "w-full rounded-xl border border-gold/30 bg-cream py-3 px-4 font-dm-sans text-sm text-primary placeholder-charcoal/30 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold",
          props.className
        )}
      />
    </div>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-48 rounded-xl bg-blush/60" />
      {[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-xl bg-blush/60" />)}
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────
function OnboardingEmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="mb-2 font-cormorant text-3xl font-semibold text-primary">Complete Onboarding First</h1>
      <p className="mb-8 max-w-sm font-dm-sans text-sm text-charcoal/60">
        Set up your salon profile before editing it here.
      </p>
      <Link href="/artist/onboarding"
        className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-dm-sans text-sm font-semibold text-cream hover:bg-gold/90">
        Start Onboarding <ArrowRight size={16} />
      </Link>
    </div>
  );
}

// ── Profile form (only rendered when salon exists) ───────────────────
function ProfileForm({ salon, onSaved }: { salon: ArtistSalon; onSaved: () => void }) {
  const [name, setName] = useState(salon.name ?? "");
  const [description, setDescription] = useState(salon.description ?? "");
  const [locality, setLocality] = useState(salon.location ?? "");
  const [address, setAddress] = useState((salon.contact as Record<string, string>)?.address ?? "");
  const [specialty, setSpecialty] = useState<string[]>(salon.specialty ?? []);
  const [priceRange, setPriceRange] = useState<PriceRange>((salon.price_range as PriceRange) ?? "₹₹");
  const [isPublished, setIsPublished] = useState(salon.is_published);
  const [coverImage, setCoverImage] = useState(salon.cover_image ?? "");
  const [phone, setPhone] = useState((salon.contact as Record<string, string>)?.phone ?? "");
  const [email, setEmail] = useState((salon.contact as Record<string, string>)?.email ?? "");
  const [instagram, setInstagram] = useState((salon.contact as Record<string, string>)?.instagram ?? "");
  const [whatsapp, setWhatsapp] = useState((salon.contact as Record<string, string>)?.whatsapp ?? "");
  const [team, setTeam] = useState<{ name: string; role: string }[]>(salon.team ?? []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [saveError, setSaveError] = useState("");
  const [publishedToast, setPublishedToast] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggleSpecialty = (tag: string) => {
    setSpecialty((prev) =>
      prev.includes(tag) ? prev.filter((s) => s !== tag) : [...prev, tag]
    );
  };

  const addTeamMember = () => setTeam((prev) => [...prev, { name: "", role: "" }]);
  const removeTeamMember = (i: number) => setTeam((prev) => prev.filter((_, idx) => idx !== i));
  const updateTeamMember = (i: number, field: "name" | "role", val: string) =>
    setTeam((prev) => prev.map((m, idx) => (idx === i ? { ...m, [field]: val } : m)));

  const handleCoverUpload = useCallback(async (file: File) => {
    setUploading(true);
    setUploadError("");
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `covers/${salon.id}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("salon-covers")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (error) {
      // Surface the real error so it's debuggable
      setUploadError(`Upload failed: ${error.message}`);
    } else {
      const { data } = supabase.storage.from("salon-covers").getPublicUrl(path);
      setCoverImage(data.publicUrl);
    }
    setUploading(false);
  }, [salon.id]);

  const handleSave = async () => {
    setSaving(true);
    setSuccessMsg("");
    setSaveError("");
    const { error } = await supabase
      .from("salons")
      .update({
        name,
        description,
        location: locality,
        specialty,
        price_range: priceRange,
        cover_image: coverImage,
        is_published: isPublished,
        contact: { address, phone, email, instagram, whatsapp },
        team,
      })
      .eq("id", salon.id);

    if (!error) {
      setSuccessMsg("Profile saved successfully!");
      onSaved();
      setTimeout(() => setSuccessMsg(""), 4000);
    } else {
      setSaveError(`Save failed: ${error.message}`);
    }
    setSaving(false);
  };

  const handlePublishToggle = (checked: boolean) => {
    setIsPublished(checked);
    if (checked) {
      setPublishedToast(true);
      setTimeout(() => setPublishedToast(false), 3500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Publish toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-gold/20 bg-blush/40 px-6 py-4">
        <div>
          <p className="font-cormorant text-lg font-semibold text-primary">
            {isPublished ? "Profile is Live" : "Profile is a Draft"}
          </p>
          <p className="font-dm-sans text-xs text-charcoal/50">
            {isPublished
              ? "Your salon is visible to brides on LUNÉVIA."
              : "Toggle to publish your salon publicly."}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isPublished}
          onClick={() => handlePublishToggle(!isPublished)}
          className={cn(
            "relative h-7 w-12 rounded-full border shadow-sm transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold",
            isPublished
              ? "bg-gold border-gold"
              : "bg-gray-400 border-gray-500"
          )}
        >
          <span
            className={cn(
              "absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-300",
              isPublished ? "translate-x-5" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Published toast */}
      {publishedToast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 font-dm-sans text-sm text-emerald-700"
        >
          <CheckCircle size={16} className="flex-shrink-0" />
          Your salon is now live on LUNÉVIA!
        </motion.div>
      )}

      {/* Basic info */}
      <section>
        <h2 className="mb-4 font-cormorant text-xl font-semibold text-primary">Basic Information</h2>
        <div className="space-y-4">
          <FormInput label="Salon Name" id="salon-name" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Neha Kapoor Bridal Studio" />
          <div>
            <label htmlFor="description" className="mb-1.5 block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">
              Description <span className="normal-case tracking-normal text-charcoal/40">({description.length}/500)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 500))}
              rows={4}
              placeholder="Describe your salon, specialties, and what makes you unique…"
              className="w-full resize-none rounded-xl border border-gold/30 bg-cream px-4 py-3 font-dm-sans text-sm text-primary placeholder-charcoal/30 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>
        </div>
      </section>

      {/* Location */}
      <section>
        <h2 className="mb-4 font-cormorant text-xl font-semibold text-primary">Location</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="locality" className="mb-1.5 block font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">Locality</label>
            <select
              id="locality"
              value={locality}
              onChange={e => setLocality(e.target.value)}
              className="w-full rounded-xl border border-gold/30 bg-cream px-4 py-3 font-dm-sans text-sm text-primary focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="">Select area…</option>
              {LOCALITIES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <FormInput label="Full Address" id="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="e.g. F-14, First Floor, Lajpat Nagar II" />
        </div>
      </section>

      {/* Specialties */}
      <section>
        <h2 className="mb-4 font-cormorant text-xl font-semibold text-primary">Specialties</h2>
        <div className="flex flex-wrap gap-2">
          {SPECIALTY_OPTIONS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleSpecialty(tag)}
              className={cn(
                "rounded-full border px-4 py-2 font-dm-sans text-sm transition-all",
                specialty.includes(tag)
                  ? "border-gold bg-gold/10 text-gold font-medium"
                  : "border-gold/25 bg-cream text-charcoal/60 hover:border-gold/50"
              )}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Price range */}
      <section>
        <h2 className="mb-4 font-cormorant text-xl font-semibold text-primary">Price Range</h2>
        <div className="inline-flex rounded-xl border border-gold/25 bg-blush/30 p-1">
          {PRICE_RANGES.map(range => (
            <button
              key={range}
              type="button"
              onClick={() => setPriceRange(range)}
              className={cn(
                "rounded-lg px-6 py-2 font-dm-sans text-sm font-medium transition-all",
                priceRange === range
                  ? "bg-gold text-cream shadow-sm"
                  : "text-charcoal/60 hover:text-charcoal"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </section>

      {/* Cover image */}
      <section>
        <h2 className="mb-4 font-cormorant text-xl font-semibold text-primary">Cover Photo</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
          {coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverImage} alt="Cover" className="h-40 w-full rounded-2xl object-cover md:w-64" />
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded-2xl border-2 border-dashed border-gold/30 bg-blush/30 md:w-64">
              <span className="font-dm-sans text-sm text-charcoal/40">No cover photo</span>
            </div>
          )}
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={e => {
                if (e.target.files?.[0]) handleCoverUpload(e.target.files[0]);
                // Reset so the same file can be re-selected after an error
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/30 bg-cream px-5 py-2.5 font-dm-sans text-sm text-charcoal transition-all hover:border-gold/60 hover:bg-blush disabled:opacity-60"
            >
              <Upload size={15} />
              {uploading ? "Uploading…" : "Change Photo"}
            </button>
            <p className="mt-2 font-dm-sans text-xs text-charcoal/40">JPG, PNG or WebP · Recommended 1600×900px</p>
            {uploadError && (
              <p className="mt-2 font-dm-sans text-xs text-rose">{uploadError}</p>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="mb-4 font-cormorant text-xl font-semibold text-primary">Contact Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormInput label="Phone" id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          <FormInput label="Email" id="contact-email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="studio@example.com" />
          <FormInput label="Instagram Handle" id="instagram" value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="@yourhandle" />
          <FormInput label="WhatsApp Number" id="whatsapp" type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 98765 43210" />
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-cormorant text-xl font-semibold text-primary">Team Members</h2>
          <button
            type="button"
            onClick={addTeamMember}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gold/30 px-3 py-1.5 font-dm-sans text-xs text-gold transition-all hover:bg-gold/10"
          >
            <Plus size={13} /> Add Member
          </button>
        </div>
        {team.length === 0 ? (
          <p className="font-dm-sans text-sm text-charcoal/40">No team members added yet.</p>
        ) : (
          <div className="space-y-3">
            {team.map((member, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  placeholder="Name" value={member.name}
                  onChange={e => updateTeamMember(i, "name", e.target.value)}
                  className="flex-1 rounded-xl border border-gold/30 bg-cream px-4 py-2.5 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <input
                  placeholder="Role (e.g. Lead Makeup Artist)" value={member.role}
                  onChange={e => updateTeamMember(i, "role", e.target.value)}
                  className="flex-1 rounded-xl border border-gold/30 bg-cream px-4 py-2.5 font-dm-sans text-sm text-primary placeholder-charcoal/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <button
                  type="button" onClick={() => removeTeamMember(i)}
                  className="flex-shrink-0 text-charcoal/30 transition-colors hover:text-rose"
                  aria-label="Remove member"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save */}
      <div className="flex flex-col gap-3 border-t border-gold/15 pt-6">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave} disabled={saving}
            className="rounded-xl bg-gold px-8 py-3 font-dm-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(201,147,58,0.35)] transition-all hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Profile"}
          </motion.button>
          {successMsg && (
            <motion.span
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 font-dm-sans text-sm text-emerald-600"
            >
              <CheckCircle size={15} /> {successMsg}
            </motion.span>
          )}
        </div>
        {saveError && (
          <p className="font-dm-sans text-sm text-rose">{saveError}</p>
        )}
      </div>
    </motion.div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────
export default function ArtistProfilePage() {
  const checking = useArtistAuth();
  const { salon, isLoading, refetch } = useArtistSalon();

  if (checking || isLoading) {
    return (
      <DashboardShell>
        <ProfileSkeleton />
      </DashboardShell>
    );
  }

  if (!salon) {
    return <DashboardShell><OnboardingEmptyState /></DashboardShell>;
  }

  return (
    <DashboardShell salonName={salon.name} isPublished={salon.is_published}>
      <div className="mb-8">
        <h1 className="font-cormorant text-3xl font-semibold text-primary">Edit Profile</h1>
        <p className="mt-1 font-dm-sans text-sm text-charcoal/50">
          Changes you save here will reflect immediately on your public salon page.
        </p>
      </div>
      <ProfileForm salon={salon} onSaved={refetch} />
    </DashboardShell>
  );
}
