"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SalonPage() {
  const { slug } = useParams();
  const [salon, setSalon] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: salonData } = await supabase
        .from("salons")
        .select("*")
        .eq("slug", slug)
        .single();
      setSalon(salonData);

      if (salonData) {
        const { data: reviewData } = await supabase
          .from("reviews")
          .select("*")
          .eq("salon_id", salonData.id)
          .order("created_at", { ascending: false });
        setReviews(reviewData || []);
      }

      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    load();
  }, [slug]);

  async function submitReview() {
    if (!user || !salon) return;
    setSubmitting(true);
    await supabase.from("reviews").insert({
      salon_id: salon.id,
      customer_id: user.id,
      rating,
      comment,
      author_name: user.email,
    });
    setComment("");
    setRating(5);
    setSubmitted(true);
    setSubmitting(false);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("salon_id", salon.id)
      .order("created_at", { ascending: false });
    setReviews(data || []);
  }

  if (!salon) return (
    <div className="min-h-screen bg-cream pt-24 text-center">
      <p className="font-dm-sans text-charcoal">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-cream pt-20 md:pt-24">
      <div className="mx-auto max-w-4xl px-4 pb-16 md:px-6">

        {/* Hero */}
        <div className="relative h-64 w-full rounded-2xl overflow-hidden mb-8">
          <img src={salon.cover_image} alt={salon.name}
            className="h-full w-full object-cover" />
          {salon.verified && (
            <span className="absolute top-4 right-4 bg-gold text-white text-xs px-3 py-1 rounded-full font-dm-sans">
              Verified
            </span>
          )}
        </div>

        {/* Info */}
        <h1 className="font-cormorant text-4xl text-primary mb-2">{salon.name}</h1>
        <p className="font-dm-sans text-sm text-charcoal mb-1">{salon.location}</p>
        <p className="font-dm-sans text-sm text-gold mb-4">
          ⭐ {salon.rating} · {salon.review_count} reviews · {salon.price_range}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {salon.specialty?.map((s: string) => (
            <span key={s} className="rounded-full bg-blush border border-gold/20 px-3 py-1 text-xs font-dm-sans text-charcoal">
              {s}
            </span>
          ))}
        </div>
        {salon.ai_summary && (
          <p className="font-dm-sans text-sm text-charcoal/80 italic mb-8 border-l-2 border-gold pl-4">
            {salon.ai_summary}
          </p>
        )}

        {/* Reviews */}
        <h2 className="font-cormorant text-2xl text-primary mb-4">Reviews</h2>
        {reviews.length === 0 ? (
          <p className="font-dm-sans text-sm text-charcoal/60 mb-8">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-4 mb-8">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-gold/20 bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-dm-sans text-sm font-semibold text-primary">{r.author_name}</p>
                  <span className="text-gold text-sm">{"⭐".repeat(r.rating)}</span>
                </div>
                <p className="font-dm-sans text-sm text-charcoal">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Submit Review */}
        {user ? (
          <div className="rounded-2xl border border-gold/20 bg-white p-6">
            <h3 className="font-cormorant text-xl text-primary mb-4">Leave a Review</h3>
            {submitted && (
              <p className="text-green-600 font-dm-sans text-sm mb-3">Review submitted!</p>
            )}
            <label className="block font-dm-sans text-sm text-charcoal mb-2">Rating</label>
            <select value={rating} onChange={(e) => setRating(+e.target.value)}
              className="mb-4 rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans w-full focus:outline-none focus:border-gold">
              {[5,4,3,2,1].map((n) => (
                <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>
              ))}
            </select>
            <label className="block font-dm-sans text-sm text-charcoal mb-2">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              rows={4} placeholder="Share your experience..."
              className="mb-4 w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold resize-none" />
            <button onClick={submitReview} disabled={submitting || !comment}
              className="rounded-full bg-gold px-6 py-2 font-dm-sans text-sm text-white disabled:opacity-50">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        ) : (
          <p className="font-dm-sans text-sm text-charcoal/60">
            <a href="/login" className="text-gold underline">Log in</a> to leave a review.
          </p>
        )}
      </div>
    </div>
  );
}