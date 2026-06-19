"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ArtistBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, []);

  async function fetchBookings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: salonData } = await supabase
      .from("salons")
      .select("id")
      .eq("owner_id", user.id);

    if (!salonData || salonData.length === 0) {
      setLoading(false);
      return;
    }

    const salonIds = salonData.map((s: any) => s.id);

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .in("salon_id", salonIds)
      .order("created_at", { ascending: false });

    setBookings(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
  }

  return (
    <div className="p-6">
      <h1 className="font-cormorant text-3xl text-primary mb-6">My Bookings</h1>

      {loading ? <p className="font-dm-sans text-sm text-charcoal">Loading...</p> : (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <p className="font-dm-sans text-sm text-charcoal/60">No bookings yet.</p>
          ) : bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-gold/20 bg-white p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-cormorant text-lg text-primary">{b.service_name}</p>
                  <p className="font-dm-sans text-sm text-charcoal">{b.date} at {b.time}</p>
                  <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-dm-sans ${
                    b.status === "confirmed" ? "bg-green-100 text-green-700" :
                    b.status === "cancelled" ? "bg-red-100 text-red-700" :
                    "bg-gold/10 text-primary"}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(b.id, "confirmed")}
                    className="rounded-full bg-green-500 px-3 py-1 text-xs text-white font-dm-sans">
                    Confirm
                  </button>
                  <button onClick={() => updateStatus(b.id, "cancelled")}
                    className="rounded-full bg-red-400 px-3 py-1 text-xs text-white font-dm-sans">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}