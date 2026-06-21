"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, X, CheckCircle2 } from "lucide-react";

const SPECIALTY_OPTIONS = ["Bridal Makeup", "Mehendi", "Hair Styling", "Pre-Bridal Packages"];
const PRICE_OPTIONS = ["₹", "₹₹", "₹₹₹"];

export default function ProfilePage() {
  const [salonId, setSalonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [locality, setLocality] = useState("");
  const [specialty, setSpecialty] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState("₹₹");
  const [coverImage, setCoverImage] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [team, setTeam] = useState<{ name: string; role: string }[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("salons")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (data) {
      setSalonId(data.id);
      setName(data.name ?? "");
      setDescription(data.description ?? "");
      setLocation(data.location ?? "");
      setLocality(data.locality ?? "");
      setSpecialty(data.specialty ?? []);
      setPriceRange(data.price_range ?? "₹₹");
      setCoverImage(data.cover_image ?? "");
      setPhone(data.contact?.phone ?? "");
      setEmail(data.contact?.email ?? "");
      setInstagram(data.contact?.instagram ?? "");
      setWhatsapp(data.contact?.whatsapp ?? "");
      setTeam(data.team ?? []);
      setIsPublished(data.is_published ?? false);
    }
    setLoading(false);
  }

  function toggleSpecialty(tag: string) {
    setSpecialty((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function addTeamMember() {
    setTeam((prev) => [...prev, { name: "", role: "" }]);
  }

  function updateTeamMember(index: number, field: "name" | "role", value: string) {
    setTeam((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  }

  function removeTeamMember(index: number) {
    setTeam((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!salonId) return;
    setSaving(true);
    setSaved(false);

    await supabase
      .from("salons")
      .update({
        name,
        description,
        location,
        locality,
        specialty,
        price_range: priceRange,
        cover_image: coverImage,
        contact: { phone, email, instagram, whatsapp },
        team,
      })
      .eq("id", salonId);

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function togglePublish() {
    if (!salonId) return;
    const next = !isPublished;
    setIsPublished(next);
    await supabase.from("salons").update({ is_published: next }).eq("id", salonId);
  }

  const [uploadingCover, setUploadingCover] = useState(false);

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!salonId || !e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setUploadingCover(true);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${salonId}/cover_${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('salon-covers')
        .upload(filePath, file);

      if (uploadError) {
        alert("Upload failed: " + uploadError.message);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('salon-covers')
        .getPublicUrl(filePath);

      setCoverImage(publicUrl);
    } catch (error) {
      console.error(error);
    } finally {
      setUploadingCover(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6 sm:p-8">
        <div className="h-9 w-48 animate-pulse rounded-lg bg-blush" />
        <div className="h-64 animate-pulse rounded-2xl bg-white/70" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gold/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-cormorant text-3xl text-primary">Edit profile</h1>
        <p className="font-dm-sans text-sm text-charcoal/50">
          Changes appear on your public page immediately
        </p>
      </div>

      {/* Publish toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-gold/20 bg-white p-5">
        <div>
          <p className="font-dm-sans text-sm font-medium text-primary">
            {isPublished ? "Your profile is live" : "Your profile is a draft"}
          </p>
          <p className="font-dm-sans text-xs text-charcoal/60 mt-0.5">
            {isPublished
              ? "Brides can find and book you on LUNÉVIA."
              : "Publish when you're ready for brides to discover you."}
          </p>
        </div>
        <button
          onClick={togglePublish}
          role="switch"
          aria-checked={isPublished}
          className={
            isPublished
              ? "relative h-7 w-12 flex-shrink-0 rounded-full border border-gold bg-gold transition-colors"
              : "relative h-7 w-12 flex-shrink-0 rounded-full border-2 border-gray-400 bg-gray-200 transition-colors"
          }
        >
          <span
            className={
              isPublished
                ? "absolute top-0.5 left-0.5 h-6 w-6 translate-x-5 rounded-full bg-white shadow transition-transform"
                : "absolute top-0.5 left-0.5 h-5 w-5 translate-x-0 rounded-full bg-gray-600 shadow transition-transform"
            }
          />
        </button>
      </div>

      {/* Basic info */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6 space-y-5">
        <h2 className="font-cormorant text-xl text-primary">Basic info</h2>

        <div className="flex flex-col gap-1.5">
          <label className="font-dm-sans text-xs text-charcoal/60">Salon / studio name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-dm-sans text-xs text-charcoal/60">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            maxLength={750}
            className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none resize-none"
          />
          <p className="font-dm-sans text-xs text-charcoal/40 text-right">{description.length}/750</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs text-charcoal/60">Locality</label>
            <input
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              placeholder="e.g. Lajpat Nagar"
              className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs text-charcoal/60">Full address</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="font-dm-sans text-xs text-charcoal/60">Cover image</label>
          
          <div className="flex items-center gap-3 border border-dashed border-gold/30 rounded-xl p-4 bg-cream/30">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={uploadingCover}
              className="block w-full text-sm text-charcoal file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-gold file:text-white hover:file:bg-gold/90"
            />
            {uploadingCover && <span className="text-xs font-dm-sans text-primary shrink-0">Uploading...</span>}
          </div>

          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-gold/10"></div>
            <span className="text-[10px] font-dm-sans text-charcoal/40 uppercase tracking-widest">OR PASTE URL</span>
            <div className="h-px flex-1 bg-gold/10"></div>
          </div>

          <input
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="https://…"
            className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
          />
          {coverImage && (
            <img
              src={coverImage}
              alt="Cover preview"
              className="mt-2 h-40 w-full rounded-xl object-cover border border-gold/20 shadow-sm"
            />
          )}
        </div>
      </div>

      {/* Specialty + pricing */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6 space-y-5">
        <h2 className="font-cormorant text-xl text-primary">Specialty & pricing</h2>

        <div className="flex flex-col gap-2">
          <label className="font-dm-sans text-xs text-charcoal/60">Specialties</label>
          <div className="flex flex-wrap gap-2">
            {SPECIALTY_OPTIONS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleSpecialty(tag)}
                className={`rounded-full border px-4 py-1.5 font-dm-sans text-xs transition-colors ${specialty.includes(tag)
                  ? "border-gold bg-gold text-white"
                  : "border-gold/20 bg-white text-charcoal/70 hover:border-gold/50"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-dm-sans text-xs text-charcoal/60">Price range</label>
          <div className="flex gap-2">
            {PRICE_OPTIONS.map((p) => (
              <button
                key={p}
                onClick={() => setPriceRange(p)}
                className={`rounded-lg border px-4 py-2 font-playfair italic text-sm transition-colors ${priceRange === p
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-gold/20 text-charcoal/60 hover:border-gold/50"
                  }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6 space-y-4">
        <h2 className="font-cormorant text-xl text-primary">Contact</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs text-charcoal/60">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs text-charcoal/60">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs text-charcoal/60">Instagram handle</label>
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@studioname"
              className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-dm-sans text-xs text-charcoal/60">WhatsApp number</label>
            <input
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="rounded-lg border border-gold/20 px-3 py-2.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-cormorant text-xl text-primary">Team members</h2>
          <button
            onClick={addTeamMember}
            className="flex items-center gap-1 font-dm-sans text-xs text-gold hover:text-gold/80"
          >
            <Plus size={14} /> Add member
          </button>
        </div>

        {team.length === 0 ? (
          <p className="font-dm-sans text-xs text-charcoal/40">No team members added yet.</p>
        ) : (
          <div className="space-y-3">
            {team.map((member, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={member.name}
                  onChange={(e) => updateTeamMember(i, "name", e.target.value)}
                  placeholder="Name"
                  className="flex-1 rounded-lg border border-gold/20 px-3 py-2 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <input
                  value={member.role}
                  onChange={(e) => updateTeamMember(i, "role", e.target.value)}
                  placeholder="Role, e.g. Lead Makeup Artist"
                  className="flex-1 rounded-lg border border-gold/20 px-3 py-2 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
                />
                <button
                  onClick={() => removeTeamMember(i)}
                  aria-label="Remove team member"
                  className="text-charcoal/40 hover:text-rose"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-gold px-8 py-2.5 font-dm-sans text-sm font-medium text-white hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 font-dm-sans text-xs text-green-700">
            <CheckCircle2 size={14} /> Saved
          </span>
        )}
      </div>
    </div>
  );
}