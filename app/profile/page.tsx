"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) { setLoading(false); return; }

      const { data } = await supabase
        .from("bookings")
        .select("*, salons(name, cover_image, location)")
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      setBookings(data || []);
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
        <h1 className="font-cormorant text-4xl text-primary mb-8">My Profile</h1>
        <p className="font-dm-sans text-sm text-charcoal mb-8">{user.email}</p>

        <h2 className="font-cormorant text-2xl text-primary mb-4">My Bookings</h2>

        {bookings.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-white p-8 text-center">
            <p className="font-dm-sans text-charcoal/60">No bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-2xl border border-gold/20 bg-white p-5 shadow-warm flex gap-4">
                {b.salons?.cover_image && (
                  <img src={b.salons.cover_image} alt={b.salons.name}
                    className="h-20 w-20 rounded-xl object-cover shrink-0" />
                )}
                <div className="flex-1">
                  <h3 className="font-cormorant text-lg text-primary">{b.salons?.name}</h3>
                  <p className="font-dm-sans text-sm text-charcoal">{b.salons?.location}</p>
                  <p className="font-dm-sans text-sm text-charcoal mt-1">{b.service_name} — {b.date} at {b.time}</p>
                  <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-dm-sans ${
                    b.status === "confirmed" ? "bg-green-100 text-green-700" :
                    b.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gold/10 text-primary"}`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}