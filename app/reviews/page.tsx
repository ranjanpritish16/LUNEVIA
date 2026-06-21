"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const HARDCODED_TESTIMONIALS = [
  {
    initials: "PS",
    name: "Priya Sharma",
    meta: "South Delhi · September 2025",
    rating: 5,
    quote:
      "LUNÉVIA Concierge matched me to the perfect artist in minutes. I'd been searching for weeks before this.",
  },
  {
    initials: "AM",
    name: "Ankita Mehra",
    meta: "Gurugram · November 2025",
    rating: 5,
    quote:
      "The AI understood my aesthetic immediately. My bridal look was exactly what I had in mind but couldn't describe.",
  },
  {
    initials: "SK",
    name: "Simran Kaur",
    meta: "Delhi · January 2026",
    rating: 5,
    quote:
      "The bridal package builder saved me weeks of research and ₹15,000 by finding the right artist first time.",
  },
];

function StarRating({ rating = 5 }: { rating?: number }) {
  return (
    <div className="flex gap-0.5 text-gold">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? "text-gold" : "text-gold/30"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function PlatformReviewsPage() {
  const [reviews, setReviews] = useState<any[]>(HARDCODED_TESTIMONIALS);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    const { data } = await supabase
      .from("site_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const formatted = data.map((r: any) => ({
        initials: r.author_name.substring(0, 2).toUpperCase(),
        name: r.author_name,
        meta: r.location ? `${r.location} · Just now` : "Just now",
        rating: r.rating,
        quote: r.comment,
      }));
      setReviews([...formatted, ...HARDCODED_TESTIMONIALS]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase.from("site_reviews").insert({
      author_name: name,
      location,
      rating,
      comment,
    });

    if (error) {
      alert("Failed to submit: " + error.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
    setName("");
    setLocation("");
    setComment("");
    setRating(0);
    fetchReviews(); // Refresh the list
  }

  return (
    <div className="min-h-screen bg-blush pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-center font-cormorant text-5xl text-primary mb-4">
          Platform Reviews
        </h1>
        <p className="text-center font-dm-sans text-charcoal/70 mb-12 max-w-xl mx-auto">
          Read what brides have to say about their experience using the LUNÉVIA platform to find their dream makeup artists.
        </p>

        {/* Form Section */}
        <div className="bg-white rounded-2xl p-8 shadow-warm mb-16 max-w-2xl mx-auto border border-gold/10">
          <h2 className="font-cormorant text-2xl text-primary mb-6 text-center">Share Your Experience</h2>
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-cormorant text-2xl text-primary mb-2">Thank you!</h3>
              <p className="font-dm-sans text-charcoal/70">Your review has been successfully published.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-6 text-sm text-gold underline hover:text-primary transition-colors"
              >
                Write another review
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-dm-sans text-xs uppercase tracking-wider text-charcoal/60 mb-1">Your Name</label>
                  <input
                    required
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-cream/50 px-4 py-2 font-dm-sans text-sm focus:border-gold focus:outline-none"
                    placeholder="e.g. Simran"
                  />
                </div>
                <div>
                  <label className="block font-dm-sans text-xs uppercase tracking-wider text-charcoal/60 mb-1">Location (Optional)</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gold/20 bg-cream/50 px-4 py-2 font-dm-sans text-sm focus:border-gold focus:outline-none"
                    placeholder="e.g. South Delhi"
                  />
                </div>
              </div>

              <div>
                <label className="block font-dm-sans text-xs uppercase tracking-wider text-charcoal/60 mb-2">Rating</label>
                <div className="flex gap-1 mb-2" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star 
                        size={28} 
                        className={`${(hoverRating || rating) >= star ? "fill-gold text-gold" : "text-gold/30"} transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-dm-sans text-xs uppercase tracking-wider text-charcoal/60 mb-1">Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-xl border border-gold/20 bg-cream/50 px-4 py-2 font-dm-sans text-sm focus:border-gold focus:outline-none"
                  placeholder="How did LUNÉVIA help you?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="w-full rounded-full bg-primary px-4 py-3 font-dm-sans text-sm font-medium text-white transition-colors hover:bg-gold disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Publish Review"}
              </button>
            </form>
          )}
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((item, idx) => (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx}
              className="rounded-2xl border border-gold/20 bg-white p-6 shadow-warm"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 font-cormorant text-lg text-gold">
                  {item.initials}
                </div>
                <div>
                  <h3 className="font-cormorant text-lg text-primary leading-tight">
                    {item.name}
                  </h3>
                  <p className="font-dm-sans text-[11px] text-charcoal/50">
                    {item.meta}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <StarRating rating={item.rating} />
              </div>
              <p className="mt-3 font-dm-sans text-sm leading-relaxed text-charcoal/90">
                &ldquo;{item.quote}&rdquo;
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}
