"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { LuneviaButton } from "@/components/ui/LuneviaButton";
import { getAllSalons } from "@/lib/data/salons";
import { PageWrapper } from "@/components/ui/PageWrapper";
import type { User } from "@supabase/supabase-js";

interface Profile {
  full_name: string;
  wedding_date: string | null;
  budget_range: string | null;
  location: string | null;
  saved_salons: string[] | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [fullName, setFullName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [budgetRange, setBudgetRange] = useState("");

  useEffect(() => {
    async function loadSessionAndProfile() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/");
        return;
      }

      setUser(session.user);

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name || "");
        setWeddingDate(data.wedding_date || "");
        setBudgetRange(data.budget_range || "");
      }
      setLoading(false);
    }
    loadSessionAndProfile();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        wedding_date: weddingDate || null,
        budget_range: budgetRange,
      })
      .eq("id", user.id);
    setSaving(false);
  };

  if (loading) {
    return (
      <PageWrapper className="flex min-h-screen items-center justify-center pt-24">
        <p className="text-charcoal/60">Loading profile...</p>
      </PageWrapper>
    );
  }

  const allSalons = getAllSalons();
  const savedSalonsList = profile?.saved_salons
    ? allSalons.filter((s) => profile.saved_salons?.includes(s.id))
    : [];

  return (
    <PageWrapper className="mx-auto max-w-7xl px-4 pb-24 pt-28 md:px-6 md:pt-36">
      <div className="mb-12 flex items-center justify-between">
        <h1 className="font-cormorant text-4xl font-semibold text-charcoal md:text-5xl">
          Your Profile
        </h1>
        <LuneviaButton variant="ghost" onClick={handleSignOut}>
          Sign Out
        </LuneviaButton>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-gold/20 bg-cream/50 p-8">
            <h2 className="mb-6 font-cormorant text-2xl font-medium text-charcoal">
              Account Details
            </h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal/80">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full rounded-xl border border-gold/10 bg-transparent px-4 py-3 text-charcoal/60"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal/80">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-gold/30 bg-transparent px-4 py-3 text-charcoal placeholder-charcoal/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal/80">
                  Wedding Date
                </label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full rounded-xl border border-gold/30 bg-transparent px-4 py-3 text-charcoal placeholder-charcoal/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-charcoal/80">
                  Budget Range
                </label>
                <select
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  className="w-full rounded-xl border border-gold/30 bg-transparent px-4 py-3 text-charcoal focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                >
                  <option value="">Select budget</option>
                  <option value="₹10k - ₹20k">₹10k - ₹20k</option>
                  <option value="₹20k - ₹40k">₹20k - ₹40k</option>
                  <option value="₹40k+">₹40k+</option>
                </select>
              </div>
              <LuneviaButton type="submit" className="w-full" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </LuneviaButton>
            </form>
          </div>
        </div>

        <div className="lg:col-span-8">
          <h2 className="mb-6 font-cormorant text-3xl font-medium text-charcoal">
            Saved Salons
          </h2>
          {savedSalonsList.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gold/30 bg-cream/30 p-12 text-center">
              <p className="text-charcoal/60">
                You haven't saved any salons yet.
              </p>
              <Link href="/explore">
                <LuneviaButton variant="ghost" className="mt-4">
                  Browse Salons
                </LuneviaButton>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {savedSalonsList.map((salon) => (
                <div
                  key={salon.id}
                  className="group relative overflow-hidden rounded-2xl bg-cream shadow-warm transition-all duration-[400ms] hover:-translate-y-1 hover:shadow-warm-lg"
                >
                  <div className="relative aspect-[3/2] w-full overflow-hidden">
                    <Image
                      src={salon.coverImage}
                      alt={salon.name}
                      fill
                      className="object-cover transition-transform duration-[600ms] ease-in-out group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-cormorant text-xl font-medium text-charcoal">
                      {salon.name}
                    </h3>
                    <p className="mt-1 text-sm text-charcoal/60">
                      {salon.locationArea}
                    </p>
                    <Link href={`/salon/${salon.slug}`}>
                      <LuneviaButton variant="ghost" className="mt-4 w-full">
                        View Details
                      </LuneviaButton>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
