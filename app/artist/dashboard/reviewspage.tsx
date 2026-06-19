"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ArtistReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => { fetchReviews(); }, []);

  async function fetchReviews() {
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
      .from("reviews")
      .select("*")
      .in("salon_id", salonIds)
      .order("created_at", { ascending: false });

    setReviews(data || []);

    if (data && data.length > 0) {
      const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
      setAvgRating(Math.round(avg * 10) / 10);
    }

    setLoading(false);
  }

  return (
    <div className="p-6">
      <h1 className="font-cormorant text-3xl text-primary mb-2">My Reviews</h1>

      {!loading && reviews.length > 0 && (
        <div className="mb-6 rounded-2xl border border-gold/20 bg-white p-5 inline-block">
          <p className="font-dm-sans text-sm text-charcoal">Average Rating</p>
          <p className="font-cormorant text-4xl text-gold">⭐ {avgRating}</p>
          <p className="font-dm-sans text-xs text-charcoal/60">{reviews.length} total reviews</p>
        </div>
      )}

      {loading ? <p className="font-dm-sans text-sm text-charcoal">Loading...</p> : (
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="font-dm-sans text-sm text-charcoal/60">No reviews yet.</p>
          ) : reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-gold/20 bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-dm-sans text-sm font-semibold text-primary">
                  {r.author_name || "Anonymous"}
                </p>
                <span className="text-gold text-sm">{"⭐".repeat(r.rating)}</span>
              </div>
              <p className="font-dm-sans text-sm text-charcoal">{r.comment}</p>
              <p className="font-dm-sans text-xs text-charcoal/40 mt-2">
                {new Date(r.created_at).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}