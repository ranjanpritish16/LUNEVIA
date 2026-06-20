"use client";

import { useArtistSalon } from "@/lib/hooks/useArtistSalon";
import Link from "next/link";
import { List, Image as ImageIcon, Calendar, Star, Edit3, Clock, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DashboardOverviewPage() {
  const { salon, isLoading } = useArtistSalon();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6 sm:p-8">
        <div className="h-9 w-72 animate-pulse rounded-lg bg-blush" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <h1 className="font-cormorant text-3xl text-primary mb-4">Welcome to LUNÉVIA!</h1>
        <p className="font-dm-sans text-sm text-charcoal/70 mb-6">Let's set up your artist profile.</p>
        <Link href="/artist/onboarding" className="inline-flex rounded-full bg-gold px-6 py-2 font-dm-sans text-sm font-medium text-white hover:bg-gold/90">
          Complete Setup
        </Link>
      </div>
    );
  }

  const pendingCount = salon.pending_bookings_count ?? 0;
  const monthlyBookings = salon.monthly_bookings_count ?? 0;
  const recentBookings = salon.recent_bookings ?? [];
  const isPublished = salon.is_published ?? false;

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-gold/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-cormorant text-3xl text-primary leading-none">{salon.name}</h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-dm-sans text-xs font-medium ${isPublished ? "bg-green-100 text-green-700" : "bg-charcoal/10 text-charcoal/60"
              }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-green-600" : "bg-charcoal/40"}`} />
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>
        <p className="font-dm-sans text-sm text-charcoal/50">Welcome back</p>
      </div>

      {/* Publish status banner */}
      {!isPublished && (
        <div className="flex flex-col gap-3 rounded-2xl border border-gold/30 bg-blush/50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 flex-shrink-0 text-gold" />
            <div>
              <p className="font-dm-sans text-sm font-medium text-primary">
                Your profile is not visible to customers yet
              </p>
              <p className="font-dm-sans text-xs text-charcoal/60 mt-0.5">
                Publish your profile so brides can find and book you on LUNÉVIA.
              </p>
            </div>
          </div>
          <Link
            href="/artist/dashboard/profile"
            className="flex-shrink-0 rounded-full bg-gold px-5 py-2 text-center font-dm-sans text-sm font-medium text-white hover:bg-gold/90 transition-colors"
          >
            Publish now
          </Link>
        </div>
      )}

      {isPublished && (
        <div className="flex items-center gap-2.5 rounded-xl bg-green-50 px-4 py-3">
          <CheckCircle2 size={16} className="text-green-600" />
          <p className="font-dm-sans text-xs text-green-800">
            Your profile is live and visible to brides browsing LUNÉVIA.
          </p>
        </div>
      )}

      {/* Stats overview */}
      <section>
        <p className="mb-3 font-dm-sans text-xs uppercase tracking-[0.14em] text-charcoal/40">Overview</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gold/20 bg-white p-5 transition-shadow hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
            <p className="font-dm-sans text-xs uppercase tracking-widest text-charcoal/40">This month</p>
            <p className="font-playfair text-3xl italic text-primary mt-2">{monthlyBookings}</p>
            <p className="font-dm-sans text-xs text-charcoal/60 mt-1">total bookings</p>
          </div>

          <Link
            href="/artist/dashboard/bookings?status=pending"
            className={`rounded-2xl border p-5 transition-all ${pendingCount > 0
                ? "border-gold/50 bg-gold/5 hover:border-gold hover:shadow-[0_4px_24px_rgba(201,147,58,0.12)]"
                : "border-gold/20 bg-white hover:border-gold/50 hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]"
              }`}
          >
            <div className="flex items-center justify-between">
              <p className="font-dm-sans text-xs uppercase tracking-widest text-charcoal/40">Needs action</p>
              {pendingCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold font-dm-sans text-[10px] font-medium text-white">
                  {pendingCount}
                </span>
              )}
            </div>
            <p className="font-playfair text-3xl italic text-primary mt-2">{pendingCount}</p>
            <p className="font-dm-sans text-xs text-charcoal/60 mt-1">pending bookings</p>
          </Link>

          <div className="rounded-2xl border border-gold/20 bg-white p-5 transition-shadow hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
            <p className="font-dm-sans text-xs uppercase tracking-widest text-charcoal/40">Reputation</p>
            <p className="font-playfair text-3xl italic text-primary mt-2">{salon.rating || "—"}</p>
            <p className="font-dm-sans text-xs text-charcoal/60 mt-1">average rating · {salon.review_count ?? 0} reviews</p>
          </div>
        </div>
      </section>

      {/* Quick action links */}
      <section>
        <p className="mb-3 font-dm-sans text-xs uppercase tracking-[0.14em] text-charcoal/40">Manage</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/artist/dashboard/services" className="group flex flex-col gap-3 rounded-2xl border border-gold/20 bg-white p-5 transition-all hover:border-gold/50 hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
              <List size={20} />
            </div>
            <div>
              <p className="font-dm-sans text-sm font-medium text-primary">Services</p>
              <p className="font-dm-sans text-xs text-charcoal/60">{salon.services?.length || 0} active</p>
            </div>
          </Link>

          <Link href="/artist/dashboard/portfolio" className="group flex flex-col gap-3 rounded-2xl border border-gold/20 bg-white p-5 transition-all hover:border-gold/50 hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
              <ImageIcon size={20} />
            </div>
            <div>
              <p className="font-dm-sans text-sm font-medium text-primary">Portfolio</p>
              <p className="font-dm-sans text-xs text-charcoal/60">{salon.gallery_images?.length || 0} photos</p>
            </div>
          </Link>

          <Link href="/artist/dashboard/reviews" className="group flex flex-col gap-3 rounded-2xl border border-gold/20 bg-white p-5 transition-all hover:border-gold/50 hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
              <Star size={20} />
            </div>
            <div>
              <p className="font-dm-sans text-sm font-medium text-primary">Reviews</p>
              <p className="font-dm-sans text-xs text-charcoal/60">{salon.rating || "No"} average rating</p>
            </div>
          </Link>

          <Link href="/artist/dashboard/availability" className="group flex flex-col gap-3 rounded-2xl border border-gold/20 bg-white p-5 transition-all hover:border-gold/50 hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 text-gold transition-colors group-hover:bg-gold/20">
              <Calendar size={20} />
            </div>
            <div>
              <p className="font-dm-sans text-sm font-medium text-primary">Availability</p>
              <p className="font-dm-sans text-xs text-charcoal/60">Manage calendar</p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent activity */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-cormorant text-xl text-primary">Recent bookings</h2>
          <Link href="/artist/dashboard/bookings" className="font-dm-sans text-xs text-gold hover:text-gold/80 transition-colors">
            View all →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blush/60">
              <Clock size={20} className="text-gold/60" />
            </div>
            <p className="font-dm-sans text-sm text-charcoal/60 mt-1">No bookings yet</p>
            <p className="font-dm-sans text-xs text-charcoal/40 max-w-xs">
              Bookings will appear here as soon as a bride books with you.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="py-2 font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/40">Customer</th>
                  <th className="py-2 font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/40">Service</th>
                  <th className="py-2 font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/40">Date</th>
                  <th className="py-2 font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/40">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.slice(0, 5).map((b: any) => {
                  const matchedService = (salon.services ?? []).find(
                    (s: any) => s.id === b.service_id
                  );
                  const serviceLabel = matchedService?.name ?? b.service_id ?? "—";
                  return (
                    <tr key={b.id} className="border-b border-gold/5 last:border-0">
                      <td className="py-3 font-dm-sans text-sm text-charcoal">{b.customer_name ?? "—"}</td>
                      <td className="py-3 font-dm-sans text-sm text-charcoal/70">{serviceLabel}</td>
                      <td className="py-3 font-dm-sans text-sm text-charcoal/70">{b.date ?? "—"}</td>
                      <td className="py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 font-dm-sans text-xs font-medium ${b.status === "pending"
                              ? "bg-gold/15 text-gold"
                              : b.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : b.status === "declined"
                                  ? "bg-rose/15 text-rose"
                                  : "bg-charcoal/10 text-charcoal/70"
                            }`}
                        >
                          {b.status ?? "unknown"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile info */}
      <div className="rounded-2xl border border-gold/20 bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cormorant text-xl text-primary">Profile Info</h2>
          <Link href="/artist/dashboard/profile" className="flex items-center gap-1 font-dm-sans text-xs text-gold hover:text-gold/80 transition-colors">
            <Edit3 size={14} /> Edit
          </Link>
        </div>
        <div className="space-y-4">
          <div>
            <p className="font-dm-sans text-xs font-semibold uppercase tracking-widest text-charcoal/40">Description</p>
            <p className="font-dm-sans text-sm text-charcoal mt-1.5 leading-relaxed line-clamp-2">{salon.description || "No description provided."}</p>
          </div>
          <div>
            <p className="font-dm-sans text-xs font-semibold uppercase tracking-widest text-charcoal/40">Location</p>
            <p className="font-dm-sans text-sm text-charcoal mt-1.5">{salon.locality || salon.location || "Not set"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}