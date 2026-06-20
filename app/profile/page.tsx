"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) { setLoading(false); return; }

      const [bookingsRes, packagesRes, profileRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("*, salons(name, cover_image, location, services)")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("saved_packages")
          .select("*")
          .eq("customer_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("profiles")
          .select("full_name, phone_number")
          .eq("id", user.id)
          .single()
      ]);

      setBookings(bookingsRes.data || []);
      setPackages(packagesRes.data || []);
      if (profileRes.data) {
        if (profileRes.data.full_name) setFullName(profileRes.data.full_name);
        if (profileRes.data.phone_number) setPhone(profileRes.data.phone_number);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-cream pt-24 text-center">Loading...</div>;

  if (!user) return (
    <div className="min-h-screen bg-cream pt-24 text-center">
      <p className="font-dm-sans text-charcoal">Please log in to view your profile.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream pt-20 md:pt-24">
      <div className="mx-auto max-w-4xl px-4 pb-16 md:px-6">
        <div className="mb-8 flex items-center justify-between border-b border-gold/15 pb-6">
          <div>
            <h1 className="font-cormorant text-4xl text-primary mb-1">My Profile</h1>
            <p className="font-dm-sans text-sm text-charcoal/60">{user.email}</p>
          </div>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/";
            }}
            className="rounded-full border border-gold/20 px-5 py-2 font-dm-sans text-xs font-medium text-charcoal transition-colors hover:bg-rose/10 hover:text-rose hover:border-rose/30"
          >
            Sign out
          </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Settings Section */}
          <div className="lg:col-span-2">
            <h2 className="font-cormorant text-2xl text-primary mb-4">My Information</h2>
            <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-warm">
              <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
                <div>
                  <label className="block text-xs font-dm-sans text-charcoal/70 mb-1 ml-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-xl border border-gold/30 px-4 py-3 font-dm-sans text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-cream/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-dm-sans text-charcoal/70 mb-1 ml-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your Phone Number"
                    className="w-full rounded-xl border border-gold/30 px-4 py-3 font-dm-sans text-sm focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold bg-cream/30"
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end mt-2">
                  <button
                    onClick={async () => {
                      setSavingProfile(true);
                      const { error } = await supabase.from("profiles").upsert({
                        id: user.id,
                        full_name: fullName,
                        phone_number: phone,
                      });
                      setSavingProfile(false);
                      if (error) {
                        console.error("Profile save error:", error);
                        alert(`Failed to save: ${error.message}. Please make sure you ran the add_profile_phone.sql script in Supabase!`);
                      } else {
                        alert("Profile updated successfully!");
                      }
                    }}
                    disabled={savingProfile}
                    className="rounded-full bg-gold px-6 py-2 font-dm-sans text-sm font-medium text-white disabled:opacity-50"
                  >
                    {savingProfile ? "Saving..." : "Save Information"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings Section */}
          <div>
            <h2 className="font-cormorant text-2xl text-primary mb-4">My Bookings</h2>
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-gold/20 bg-white p-8 text-center shadow-warm">
                <p className="font-dm-sans text-charcoal/60">No bookings yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((b) => (
                  <div key={b.id} className="rounded-2xl border border-gold/20 bg-white p-5 shadow-warm flex gap-4">
                    {b.salons?.cover_image && (
                      <img src={b.salons.cover_image} alt={b.salons.name}
                        className="h-16 w-16 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="flex-1">
                      <h3 className="font-cormorant text-lg text-primary">{b.salons?.name}</h3>
                      <p className="font-dm-sans text-sm text-charcoal">{b.salons?.location}</p>
                      <p className="font-dm-sans text-sm text-charcoal mt-1">
                        {(b.salons?.services?.find((s: any) => s.id === b.service_id)?.name) || b.service_id} — {b.date} at {b.time_slot}
                      </p>
                      <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-dm-sans ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "declined" || b.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-gold/10 text-primary"}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Packages Section */}
          <div>
            <h2 className="font-cormorant text-2xl text-primary mb-4">Saved Packages</h2>
            {packages.length === 0 ? (
              <div className="rounded-2xl border border-gold/20 bg-white p-8 text-center shadow-warm">
                <p className="font-dm-sans text-charcoal/60">No saved packages yet.</p>
                <a href="/package-builder" className="mt-4 inline-block font-dm-sans text-sm text-gold hover:underline">
                  Try the Package Builder →
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {packages.map((pkg) => {
                  const data = pkg.package_data;
                  return (
                    <div key={pkg.id} className="rounded-2xl border border-gold/20 bg-blush p-5 shadow-warm">
                      <h3 className="font-cormorant text-xl text-primary">{data.packageName}</h3>
                      <p className="font-dm-sans text-sm text-charcoal/70 mb-3">{data.tagline}</p>
                      
                      <div className="space-y-2 mb-4">
                        {data.services?.map((s: any, idx: number) => (
                          <div key={idx} className="flex justify-between font-dm-sans text-sm">
                            <span className="text-charcoal">{s.name}</span>
                            <span className="text-gold">{s.estimatedCost}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-gold/20 pt-4">
                        <span className="font-dm-sans text-sm text-charcoal/60">Total Estimate</span>
                        <span className="font-cormorant text-xl text-gold font-medium">{data.totalEstimate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}