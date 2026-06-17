"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";
import { DashboardShell } from "@/components/artist/DashboardShell";
import { CalendarDays, Clock, Star, MessageSquare, ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Auth guard ───────────────────────────────────────────────────────
function useArtistAuth() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/artist/login"); return; }
      const { data: profile } = await supabase
        .from("profiles").select("role").eq("id", user.id).single();
      if (profile?.role !== "artist") { router.replace("/login/customer"); return; }
      setChecking(false);
    }
    check();
  }, [router]);

  return checking;
}

// ── Skeleton ─────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-blush/60" />)}
      </div>
      <div className="h-12 w-64 rounded-xl bg-blush/60" />
      <div className="h-48 rounded-2xl bg-blush/60" />
    </div>
  );
}

// ── Onboarding empty state ───────────────────────────────────────────
function OnboardingEmptyState() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-gold/25 bg-blush/60">
        <Star size={32} className="text-gold/60" />
      </div>
      <h1 className="mb-2 font-cormorant text-3xl font-semibold text-primary">Welcome to LUNÉVIA</h1>
      <p className="mb-8 max-w-sm font-dm-sans text-sm text-charcoal/60">
        Let&apos;s set up your salon profile so Delhi&apos;s brides can discover you.
      </p>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/artist/onboarding"
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-dm-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(201,147,58,0.35)] transition-all hover:bg-gold/90"
        >
          Start Onboarding <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────
function StatCard({ label, value, icon, highlight, delay }: {
  label: string; value: string | number; icon: React.ReactNode;
  highlight?: boolean; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-cream p-5 shadow-warm",
        highlight ? "border-gold/40" : "border-gold/15"
      )}
    >
      {highlight && <span className="absolute inset-y-0 left-0 w-1 rounded-r bg-gold" />}
      <div className="mb-3 flex items-center justify-between">
        <span className="font-dm-sans text-xs font-medium uppercase tracking-widest text-charcoal/50">{label}</span>
        <span className={cn("text-charcoal/30", highlight && "text-gold/60")}>{icon}</span>
      </div>
      <p className={cn("font-cormorant text-3xl font-semibold", highlight ? "text-gold" : "text-primary")}>
        {value}
      </p>
    </motion.div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-gold/15 text-gold",
  confirmed: "bg-emerald-50 text-emerald-700",
  declined: "bg-rose/15 text-rose",
  completed: "bg-charcoal/10 text-charcoal",
};

interface Booking {
  id: string; created_at: string; status: string; date: string;
  time_slot: string; total_amount: number | null;
  profiles?: { full_name: string | null } | null;
  service_id?: string | null;
}

// ── Page ─────────────────────────────────────────────────────────────
export default function ArtistDashboardPage() {
  const checking = useArtistAuth();
  const { salon, isLoading } = useArtistSalon();
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  useEffect(() => {
    if (!salon) return;
    async function fetchStats() {
      if (!salon) return;
      setBookingsLoading(true);
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const [monthlyRes, pendingRes, recentRes] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true })
          .eq("salon_id", salon.id).gte("created_at", startOfMonth.toISOString()),
        supabase.from("bookings").select("id", { count: "exact", head: true })
          .eq("salon_id", salon.id).eq("status", "pending"),
        supabase.from("bookings")
          .select("id, created_at, status, date, time_slot, total_amount, profiles(full_name), service_id")
          .eq("salon_id", salon.id).order("created_at", { ascending: false }).limit(5),
      ]);
      setMonthlyCount(monthlyRes.count ?? 0);
      setPendingCount(pendingRes.count ?? 0);
      setRecentBookings((recentRes.data ?? []) as unknown as Booking[]);
      setBookingsLoading(false);
    }
    fetchStats();
  }, [salon]);

  if (checking || isLoading) {
    return <DashboardShell><DashboardSkeleton /></DashboardShell>;
  }

  if (!salon) {
    return <DashboardShell><OnboardingEmptyState /></DashboardShell>;
  }

  return (
    <DashboardShell pendingBookingsCount={pendingCount} salonName={salon.name} isPublished={salon.is_published}>
      {/* Draft banner */}
      {!salon.is_published && !dismissedBanner && (
        <motion.div
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-gold/30 bg-gold/[0.06] px-5 py-3"
        >
          <p className="font-dm-sans text-sm text-charcoal/80">
            <span className="font-semibold text-gold">Your profile is saved as a draft</span>{" "}
            and not visible to customers yet.
          </p>
          <div className="flex flex-shrink-0 items-center gap-3">
            <Link href="/artist/dashboard/profile"
              className="whitespace-nowrap rounded-lg bg-gold px-3 py-1.5 font-dm-sans text-xs font-semibold text-cream hover:bg-gold/90">
              Go to Profile to Publish
            </Link>
            <button onClick={() => setDismissedBanner(true)} aria-label="Dismiss" className="text-charcoal/40 hover:text-charcoal">
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="This Month's Bookings" value={monthlyCount} icon={<CalendarDays size={18} />} delay={0} />
        <StatCard label="Pending Bookings" value={pendingCount} icon={<Clock size={18} />} highlight={pendingCount > 0} delay={0.06} />
        <StatCard label="Average Rating" value={salon.rating ? `${salon.rating.toFixed(1)} ★` : "—"} icon={<Star size={18} />} delay={0.12} />
        <StatCard label="Total Reviews" value={salon.review_count ?? 0} icon={<MessageSquare size={18} />} delay={0.18} />
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.24 }} className="mb-8">
        <h2 className="mb-3 font-cormorant text-xl font-semibold text-primary">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "View Pending Bookings", href: "/artist/dashboard/bookings" },
            { label: "Add New Service", href: "/artist/dashboard/services" },
            { label: "Upload Photos", href: "/artist/dashboard/portfolio" },
          ].map(({ label, href }) => (
            <Link key={href} href={href}
              className="inline-flex items-center gap-2 rounded-xl border border-gold/25 bg-blush/40 px-4 py-2.5 font-dm-sans text-sm text-charcoal transition-all hover:border-gold/50 hover:bg-blush/60 hover:text-gold">
              {label} <ArrowRight size={14} />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent bookings */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <h2 className="mb-3 font-cormorant text-xl font-semibold text-primary">Recent Bookings</h2>
        <div className="overflow-hidden rounded-2xl border border-gold/15 bg-cream shadow-warm">
          {bookingsLoading ? (
            <div className="space-y-3 p-5">{[...Array(3)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-blush/60" />)}</div>
          ) : recentBookings.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <p className="font-dm-sans text-sm text-charcoal/50">No bookings yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full font-dm-sans text-sm">
                <thead>
                  <tr className="border-b border-gold/10">
                    {["Customer", "Service", "Date", "Status"].map(h => (
                      <th key={h} className="whitespace-nowrap px-5 py-3 text-left text-xs font-medium uppercase tracking-widest text-charcoal/40">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, i) => (
                    <tr key={b.id} className={cn("transition-colors hover:bg-blush/30", i !== recentBookings.length - 1 && "border-b border-gold/8")}>
                      <td className="px-5 py-3.5 text-charcoal">{b.profiles?.full_name ?? "—"}</td>
                      <td className="px-5 py-3.5 text-charcoal/70">{b.service_id ?? "—"}</td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-charcoal/70">
                        {b.date ? new Date(b.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize", STATUS_STYLES[b.status] ?? "bg-blush text-charcoal")}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    </DashboardShell>
  );
}
