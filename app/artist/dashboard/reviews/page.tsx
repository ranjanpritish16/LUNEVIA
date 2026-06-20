"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Star, MessageSquareQuote } from "lucide-react";

export default function ArtistReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avgRating, setAvgRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, []);

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

  // Distribution for the breakdown bars, 5 -> 1 stars
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { star, count, pct };
  });

  if (loading) {
    return (
      <div className="p-6 sm:p-8 space-y-8 max-w-3xl">
        <div className="h-9 w-40 animate-pulse rounded-lg bg-blush" />
        <div className="h-36 animate-pulse rounded-2xl bg-white/70" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-3xl">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gold/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-dm-sans text-xs uppercase tracking-wide text-charcoal/40 mb-1">
            Artist dashboard
          </p>
          <h1 className="font-cormorant text-3xl text-primary">Reviews</h1>
        </div>
        <p className="font-dm-sans text-sm text-charcoal/50">
          {reviews.length === 0
            ? "What brides are saying"
            : `${reviews.length} review${reviews.length === 1 ? "" : "s"} from real brides`}
        </p>
      </div>

      {/* Rating summary */}
      {reviews.length > 0 && (
        <div className="rounded-2xl border border-gold/20 bg-white p-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* Big average */}
            <div className="flex flex-col items-center justify-center sm:border-r sm:border-gold/15 sm:pr-6">
              <p className="font-playfair text-5xl italic text-gold">{avgRating}</p>
              <div className="mt-1 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.round(avgRating)
                        ? "fill-gold text-gold"
                        : "fill-transparent text-charcoal/20"
                    }
                  />
                ))}
              </div>
              <p className="mt-1 font-dm-sans text-xs text-charcoal/50">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>

            {/* Distribution bars */}
            <div className="flex-1 space-y-1.5">
              {distribution.map(({ star, count, pct }) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="w-3 font-dm-sans text-xs text-charcoal/50">{star}</span>
                  <Star size={11} className="fill-gold/60 text-gold/60" />
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-blush/50">
                    <div
                      className="h-full rounded-full bg-gold transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right font-dm-sans text-xs text-charcoal/40">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gold/25 bg-white/60 py-16 text-center">
          <MessageSquareQuote size={28} className="text-gold/40" />
          <p className="font-cormorant text-lg text-primary">No reviews yet</p>
          <p className="max-w-xs font-dm-sans text-xs text-charcoal/50">
            Once brides start booking and leaving feedback, their reviews will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-gold/20 bg-white p-5 transition-shadow hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="font-dm-sans text-sm font-semibold text-primary">
                  {r.author_name || "Anonymous"}
                </p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={
                        i < r.rating
                          ? "fill-gold text-gold"
                          : "fill-transparent text-charcoal/15"
                      }
                    />
                  ))}
                </div>
              </div>
              {r.comment && (
                <p className="font-dm-sans text-sm leading-relaxed text-charcoal">{r.comment}</p>
              )}
              <p className="mt-3 font-dm-sans text-xs text-charcoal/40">
                {new Date(r.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}