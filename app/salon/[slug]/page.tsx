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
    const { error } = await supabase.from("reviews").insert({
      salon_id: salon.id,
      customer_id: user.id,
      rating,
      comment,
      author_name: user.email,
    });
    if (error) {
      console.error("Review insert error:", error);
      alert(`Failed to submit review: ${error.message}`);
      setSubmitting(false);
      return;
    }
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
    <div className="min-h-screen bg-cream pt-20 md:pt-24 pb-32 relative">
      <div className="mx-auto max-w-4xl px-4 md:px-6">

        {/* Hero */}
        <div className="relative h-[400px] w-full rounded-3xl overflow-hidden mb-8 shadow-warm">
          <img src={salon.cover_image} alt={salon.name}
            className="h-full w-full object-cover" />
          {salon.verified && (
            <span className="absolute top-6 right-6 bg-gold text-white text-sm px-4 py-1.5 rounded-full font-dm-sans shadow-md">
              Verified
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="font-cormorant text-4xl md:text-5xl mb-2">{salon.name}</h1>
            <p className="font-dm-sans text-white/80">{salon.location}</p>
          </div>
        </div>

        {/* Info Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <p className="font-dm-sans text-sm text-gold font-medium mb-3">
              ⭐ {salon.rating} · {salon.review_count} reviews · {salon.price_range}
            </p>
            <div className="flex flex-wrap gap-2">
              {salon.specialty?.map((s: string) => (
                <span key={s} className="rounded-full bg-blush border border-gold/20 px-3 py-1 text-xs font-dm-sans text-charcoal">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <a
            href={`/book/${salon.slug}`}
            className="rounded-full bg-gold px-8 py-3 font-dm-sans text-sm font-medium text-white shadow-md hover:bg-gold/90 transition-colors shrink-0 text-center"
          >
            Book Now
          </a>
        </div>

        {salon.ai_summary && (
          <p className="font-dm-sans text-base text-charcoal/80 italic mb-12 border-l-2 border-gold pl-5 bg-gold/5 p-4 rounded-r-2xl">
            {salon.ai_summary}
          </p>
        )}

        {/* About */}
        {salon.bio && (
          <div className="mb-12">
            <h2 className="font-cormorant text-3xl text-primary mb-4">About</h2>
            <p className="font-dm-sans text-charcoal/80 whitespace-pre-wrap leading-relaxed">{salon.bio}</p>
          </div>
        )}

        {/* Services */}
        {salon.services && salon.services.length > 0 && (
          <div className="mb-12">
            <h2 className="font-cormorant text-3xl text-primary mb-6">Services</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {salon.services.map((service: any) => (
                <div key={service.id} className="rounded-2xl border border-gold/20 bg-white p-5 shadow-warm flex flex-col justify-between">
                  <div>
                    <h3 className="font-dm-sans font-medium text-primary text-lg">{service.name}</h3>
                    <p className="font-dm-sans text-sm text-charcoal/60 mt-1">{service.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-gold/10 pt-4">
                    <span className="font-dm-sans text-xs bg-blush px-2 py-1 rounded-full text-charcoal">{service.duration}</span>
                    <span className="font-cormorant text-xl text-gold">{service.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery */}
        {salon.gallery_images && salon.gallery_images.length > 0 && (
          <div className="mb-12">
            <h2 className="font-cormorant text-3xl text-primary mb-6">Portfolio</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {salon.gallery_images.map((url: string, idx: number) => (
                <img key={idx} src={url} alt="Gallery" className="w-full h-48 object-cover rounded-2xl shadow-sm border border-gold/10" />
              ))}
            </div>
          </div>
        )}

        {/* Working Hours */}
        {salon.working_hours && (
          <div className="mb-12 rounded-2xl bg-blush p-6 border border-gold/20">
            <h2 className="font-cormorant text-3xl text-primary mb-4">Working Hours</h2>
            <div className="space-y-2 max-w-sm">
              {Object.entries(salon.working_hours).map(([day, hrs]: [string, any]) => (
                <div key={day} className="flex justify-between font-dm-sans text-sm">
                  <span className="capitalize text-charcoal">{day}</span>
                  <span className="text-primary font-medium">{hrs.open ? `${hrs.start} - ${hrs.end}` : "Closed"}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <h2 className="font-cormorant text-3xl text-primary mb-6">Reviews</h2>
        {reviews.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 border border-gold/20 text-center mb-8 shadow-warm">
            <p className="font-dm-sans text-sm text-charcoal/60">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-4 mb-12">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-gold/20 bg-white p-6 shadow-warm">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-dm-sans font-semibold text-primary">{r.author_name}</p>
                  <span className="text-gold text-sm tracking-widest">{"⭐".repeat(r.rating)}</span>
                </div>
                <p className="font-dm-sans text-charcoal/80 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* Submit Review */}
        {user ? (
          <div className="rounded-3xl border border-gold/30 bg-white p-8 shadow-warm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-full pointer-events-none" />
            <h3 className="font-cormorant text-2xl text-primary mb-4 relative z-10">Leave a Review</h3>
            {submitted && (
              <p className="text-green-600 font-dm-sans text-sm mb-4 bg-green-50 p-3 rounded-lg border border-green-200">Review submitted successfully! Thank you.</p>
            )}
            <label className="block font-dm-sans text-sm font-medium text-primary mb-2">Rating</label>
            <select value={rating} onChange={(e) => setRating(+e.target.value)}
              className="mb-5 rounded-xl border border-gold/20 px-4 py-3 text-sm font-dm-sans w-full focus:outline-none focus:border-gold bg-cream/30">
              {[5,4,3,2,1].map((n) => (
                <option key={n} value={n}>{n} star{n !== 1 ? "s" : ""}</option>
              ))}
            </select>
            <label className="block font-dm-sans text-sm font-medium text-primary mb-2">Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              rows={4} placeholder="Share your experience..."
              className="mb-6 w-full rounded-xl border border-gold/20 px-4 py-3 text-sm font-dm-sans focus:outline-none focus:border-gold resize-none bg-cream/30" />
            <button onClick={submitReview} disabled={submitting || !comment}
              className="rounded-full bg-primary px-8 py-3 font-dm-sans text-sm font-medium text-white disabled:opacity-50 hover:bg-primary/90 transition-colors">
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-gold/20 bg-blush p-6 text-center">
            <p className="font-dm-sans text-charcoal">
              <a href="/login" className="text-gold font-medium hover:underline">Log in</a> to leave a review.
            </p>
          </div>
        )}
      </div>

      {/* Sticky Mobile Book Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-gold/10 md:hidden z-40">
        <a
          href={`/book/${salon.slug}`}
          className="block w-full rounded-full bg-gold px-6 py-3.5 text-center font-dm-sans font-medium text-white shadow-lg active:scale-[0.98] transition-transform"
        >
          Book Now
        </a>
      </div>

    </div>
  );
}