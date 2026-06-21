"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SalonCard } from "@/components/ui/SalonCard";
import { CheckCircle2, LogOut, CalendarDays, Clock, Wallet, Heart, Sparkles } from "lucide-react";

// Helper for status badge colors
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-gold text-white",
  confirmed: "bg-green-600 text-white",
  declined: "bg-rose text-white",
  completed: "bg-charcoal text-white",
};

export default function CustomerDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Data
  const [profile, setProfile] = useState<any>({});
  const [bookings, setBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]); // For budget tracking
  const [savedSalons, setSavedSalons] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Form State
  const [fullName, setFullName] = useState("");
  const [weddingDate, setWeddingDate] = useState("");
  const [location, setLocation] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) { setLoading(false); return; }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setFullName(profileData.full_name || "");
        setWeddingDate(profileData.wedding_date || "");
        setLocation(profileData.location || "");
        setBudgetRange(profileData.budget_range || "");
      }

      const bookingsPromise = supabase
        .from("bookings")
        .select("*, salons(id, name, slug, services, cover_image, location)")
        .eq("customer_id", user.id)
        .order("date", { ascending: true });

      let savedSalonsPromise: any = Promise.resolve({ data: [] });
      if (profileData?.saved_salons && profileData.saved_salons.length > 0) {
        savedSalonsPromise = supabase
          .from("salons")
          .select("*")
          .in("id", profileData.saved_salons);
      }

      const [bookingsRes, savedSalonsRes] = await Promise.all([
        bookingsPromise,
        savedSalonsPromise
      ]);

      const fetchedBookings = bookingsRes.data || [];
      const now = new Date();

      const isBookingInPast = (b: any) => {
        const [datePart] = b.date.split('T');
        const timeRegex = /(\d+):(\d+)\s*(AM|PM)/i;
        const match = (b.time_slot || "").match(timeRegex);

        let endHour = 23;
        let endMin = 59;

        if (match) {
          let hour = parseInt(match[1]);
          let min = parseInt(match[2]);
          const period = match[3].toUpperCase();

          if (period === 'PM' && hour < 12) hour += 12;
          if (period === 'AM' && hour === 12) hour = 0;

          let durationHours = 3;
          const salonServices = b.salons?.services || [];
          const service = salonServices.find((s: any) => s.id === b.service_id);

          if (service && service.duration) {
            const durStr = service.duration.toLowerCase();
            const numMatch = durStr.match(/(\d+)/);
            if (numMatch) {
              const num = parseInt(numMatch[1]);
              if (durStr.includes('min')) {
                durationHours = num / 60;
              } else {
                durationHours = num;
              }
            }
          }

          const totalMins = (hour * 60) + min + (durationHours * 60);
          endHour = Math.floor(totalMins / 60);
          endMin = totalMins % 60;
        }

        const endDate = new Date(datePart);
        endDate.setHours(endHour, endMin, 0, 0);
        return now > endDate;
      };

      setAllBookings(fetchedBookings);
      setBookings(fetchedBookings.filter(b => !isBookingInPast(b)));
      setPastBookings(fetchedBookings.filter(b => isBookingInPast(b)));
      setSavedSalons(savedSalonsRes.data || []);

      if (profileData?.location) {
        const bookedIds = fetchedBookings.map(b => b.salon_id);
        const savedIds = profileData?.saved_salons || [];
        const excludeIds = Array.from(new Set([...bookedIds, ...savedIds]));

        let recsQuery = supabase
          .from("salons")
          .select("*")
          .ilike("location", `%${profileData.location}%`)
          .eq("is_published", true)
          .limit(3);

        if (excludeIds.length > 0) {
          recsQuery = recsQuery.not("id", "in", `(${excludeIds.join(',')})`);
        }

        const { data: recsData } = await recsQuery;
        setRecommendations(recsData || []);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  async function handleSaveProfile() {
    if (!user) return;
    setSavingProfile(true);
    setProfileSaved(false);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: fullName,
      wedding_date: weddingDate || null,
      location,
      budget_range: budgetRange,
    });

    setSavingProfile(false);
    if (!error) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2500);
      setProfile({ ...profile, wedding_date: weddingDate });
    }
  }

  const daysUntilWedding = profile.wedding_date
    ? Math.ceil((new Date(profile.wedding_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
    : null;

  const totalSpent = allBookings
    .filter(b => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

  const maxBudgetMatch = budgetRange.replace(/,/g, '').match(/(\d+)(?!.*\d)/);
  const maxBudget = maxBudgetMatch ? parseInt(maxBudgetMatch[0], 10) : null;
  const budgetPercentage = maxBudget && totalSpent > 0 ? Math.min((totalSpent / maxBudget) * 100, 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 space-y-8">
          <div className="h-40 w-full animate-pulse rounded-2xl bg-gold/10" />
          <div className="h-64 w-full animate-pulse rounded-2xl bg-white/50" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream pt-32 text-center">
        <h1 className="font-cormorant text-3xl text-primary mb-4">Please log in</h1>
        <Link href="/login" className="text-gold underline font-dm-sans">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-24">
      <div className="mx-auto max-w-5xl px-4 space-y-12">

        {/* 1. Header — countdown to the wedding */}
        <div className="rounded-2xl border border-gold/20 bg-white p-8 shadow-[0_4px_24px_rgba(201,147,58,0.08)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="font-dm-sans text-sm uppercase tracking-widest text-gold mb-2">My Wedding</p>
              <h1 className="font-cormorant text-4xl md:text-5xl text-primary mb-2">
                {profile.full_name ? `${profile.full_name}'s Big Day` : "Your Big Day"}
              </h1>
              {profile.wedding_date ? (
                <p className="font-dm-sans text-charcoal/70">
                  {new Date(profile.wedding_date).toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              ) : (
                <p className="font-dm-sans text-rose">Please set your wedding date in settings below.</p>
              )}
            </div>

            {daysUntilWedding !== null && daysUntilWedding >= 0 && (
              <div className="text-center md:text-right">
                <p className="font-playfair text-6xl italic text-gold">{daysUntilWedding}</p>
                <p className="font-dm-sans text-sm uppercase tracking-widest text-charcoal/50 mt-1">Days to go</p>
              </div>
            )}
            {daysUntilWedding !== null && daysUntilWedding < 0 && (
              <div className="text-center md:text-right">
                <p className="font-playfair text-4xl italic text-gold">Happily Ever After</p>
              </div>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-3">

          <div className="lg:col-span-2 space-y-12">
            {/* 2. Upcoming Bookings */}
            <section>
              <h2 className="font-cormorant text-3xl text-primary mb-6">Upcoming Bookings</h2>
              {bookings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gold/40 bg-white/50 p-8 text-center">
                  <p className="font-dm-sans text-charcoal/60 mb-4">No bookings yet — start exploring artists.</p>
                  <Link href="/explore" className="inline-block rounded-full bg-gold px-6 py-2.5 font-dm-sans text-sm font-medium text-white hover:bg-gold/90 transition-colors">
                    Explore Artists
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map((b) => {
                    const salonServices = b.salons?.services || [];
                    const matchedService = salonServices.find((s: any) => s.id === b.service_id);
                    const serviceName = matchedService ? matchedService.name : "Custom Service";

                    return (
                      <div key={b.id} className="rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_4px_24px_rgba(201,147,58,0.04)] flex flex-col sm:flex-row gap-5 hover:shadow-[0_4px_24px_rgba(201,147,58,0.08)] transition-shadow">
                        {b.salons?.cover_image && (
                          <img src={b.salons.cover_image} alt={b.salons.name} className="h-24 w-full sm:w-32 rounded-xl object-cover shrink-0" />
                        )}
                        <div className="flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="font-cormorant text-xl text-primary mb-1">{b.salons?.name}</h3>
                              <p className="font-dm-sans text-sm text-gold font-medium">{serviceName}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full font-dm-sans text-xs uppercase tracking-wider ${STATUS_COLORS[b.status] || STATUS_COLORS.pending}`}>
                              {b.status}
                            </span>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-4 font-dm-sans text-sm text-charcoal/70">
                            <span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-gold" /> {new Date(b.date).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1.5"><Clock size={14} className="text-gold" /> {b.time_slot}</span>
                            {b.total_amount && <span className="flex items-center gap-1.5"><Wallet size={14} className="text-gold" /> ₹{Number(b.total_amount).toLocaleString("en-IN")}</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 2.1 Recent Events & Reviews (Post-Event Prompt) */}
            {pastBookings.length > 0 && (
              <section className="pt-4">
                <h2 className="font-cormorant text-3xl text-primary mb-6">Recent Events</h2>
                <div className="space-y-4">
                  {pastBookings.map((b) => {
                    const salonServices = b.salons?.services || [];
                    const matchedService = salonServices.find((s: any) => s.id === b.service_id);
                    const serviceName = matchedService ? matchedService.name : "Custom Service";

                    return (
                      <div key={b.id} className="relative overflow-hidden rounded-2xl border border-gold bg-gold/5 p-6">
                        <div className="absolute right-0 top-0 h-full w-1.5 bg-gold"></div>
                        <div className="flex flex-col sm:flex-row gap-5 items-center justify-between">
                          <div className="flex items-center gap-5">
                            {b.salons?.cover_image && (
                              <img src={b.salons.cover_image} alt={b.salons.name} className="h-16 w-16 rounded-full object-cover shrink-0 border-2 border-gold/30" />
                            )}
                            <div>
                              <p className="font-dm-sans text-xs uppercase tracking-widest text-gold mb-1">Completed Event</p>
                              <h3 className="font-cormorant text-xl text-primary">{b.salons?.name}</h3>
                              <p className="font-dm-sans text-sm text-charcoal/70">{serviceName} on {new Date(b.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <Link href={`/salon/${b.salons?.slug}#reviews`} className="mt-4 sm:mt-0 whitespace-nowrap rounded-full bg-primary px-6 py-2.5 font-dm-sans text-sm font-medium text-gold hover:bg-primary/90 transition-colors">
                            Leave a Review
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. Saved / Wishlisted Salons */}
            <section className="pt-4">
              <div className="flex items-center gap-2 mb-6">
                <Heart size={20} className="text-rose" />
                <h2 className="font-cormorant text-3xl text-primary">Wishlisted Salons</h2>
              </div>
              {savedSalons.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gold/40 bg-white/50 p-8 text-center">
                  <p className="font-dm-sans text-charcoal/60">No saved salons yet.</p>
                </div>
              ) : (
                <div className="flex overflow-x-auto pb-6 -mx-4 px-4 gap-6 snap-x">
                  {savedSalons.map(salon => (
                    <div key={salon.id} className="w-[300px] shrink-0 snap-start">
                      <SalonCard
                        id={salon.id}
                        name={salon.name}
                        location={salon.location}
                        specialty={salon.specialty || []}
                        rating={salon.rating || 0}
                        reviewCount={salon.review_count || 0}
                        priceRange={salon.price_range || "₹₹"}
                        coverImage={salon.cover_image || "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=600&auto=format&fit=crop"}
                        verified={salon.is_published}
                        slug={salon.slug}
                        mapUrl={salon.map_url}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* 3.1 AI Proactive Recommendations */}
            {recommendations.length > 0 && (
              <section className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles size={18} className="text-rose" />
                  <h2 className="font-cormorant text-3xl text-primary">Curated For You</h2>
                </div>
                <p className="font-dm-sans text-sm text-charcoal/70 mb-4">Based on your location ({profile.location}) and budget.</p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {recommendations.slice(0, 2).map(salon => (
                    <div key={salon.id}>
                      <SalonCard
                        id={salon.id}
                        name={salon.name}
                        location={salon.location}
                        specialty={salon.specialty || []}
                        rating={salon.rating || 0}
                        reviewCount={salon.review_count || 0}
                        priceRange={salon.price_range || "₹₹"}
                        coverImage={salon.cover_image || "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=600&auto=format&fit=crop"}
                        verified={salon.is_published}
                        slug={salon.slug}
                        mapUrl={salon.map_url}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* 4. Budget Tracker */}
            <section className="rounded-2xl border border-gold/20 bg-white p-6 shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
              <h2 className="font-cormorant text-2xl text-primary mb-4">Budget Tracker</h2>
              <div className="space-y-2">
                <p className="font-dm-sans text-sm text-charcoal/60">Total Spent (Confirmed)</p>
                <p className="font-playfair text-3xl italic text-primary">₹{totalSpent.toLocaleString()}</p>

                {maxBudget ? (
                  <div className="pt-4">
                    <div className="flex justify-between font-dm-sans text-xs text-charcoal/50 mb-2">
                      <span>Spent</span>
                      <span>Target: ₹{maxBudget.toLocaleString()}</span>
                    </div>
                    <div className="h-2 w-full bg-blush rounded-full overflow-hidden">
                      <div
                        className={`h-full ${budgetPercentage > 100 ? 'bg-rose' : 'bg-gold'} transition-all duration-1000`}
                        style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <p className="font-dm-sans text-xs text-rose mt-2">Add a numeric budget range below to track progress.</p>
                )}
              </div>
            </section>

            {/* 4.1 Transactions & Payments */}
            <section className="rounded-2xl border border-gold/20 bg-white p-6">
              <h2 className="font-cormorant text-2xl text-primary mb-4">Transactions</h2>
              {allBookings.filter(b => b.total_amount).length === 0 ? (
                <p className="font-dm-sans text-xs text-charcoal/50 text-center py-4">No payments recorded yet.</p>
              ) : (
                <div className="space-y-4">
                  {allBookings.filter(b => b.total_amount).map((b) => {
                    const hasPaidField = b.amount_paid !== undefined && b.amount_paid !== null;
                    const paid = Number(b.amount_paid) || 0;
                    const total = Number(b.total_amount);
                    const due = total - paid;

                    return (
                      <div key={b.id} className="border-b border-gold/10 pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-dm-sans font-medium text-sm text-primary">{b.salons?.name}</p>
                            <p className="font-dm-sans text-xs text-charcoal/60">{new Date(b.date).toLocaleDateString()}</p>
                          </div>
                          {hasPaidField ? (
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${due <= 0 ? 'bg-green-100 text-green-700' : 'bg-rose/10 text-rose'}`}>
                              {due <= 0 ? 'Fully Paid' : 'Balance Due'}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-charcoal/10 text-charcoal/60">
                              {b.status === "completed" || b.status === "confirmed" ? "Booked" : b.status}
                            </span>
                          )}
                        </div>
                        {hasPaidField ? (
                          <div className="flex justify-between font-dm-sans text-xs">
                            <span className="text-charcoal/70">Total: ₹{total.toLocaleString("en-IN")}</span>
                            <span className="text-gold font-medium">Paid: ₹{paid.toLocaleString("en-IN")}</span>
                            <span className={due > 0 ? "text-rose font-bold" : "text-charcoal/50"}>
                              Due: ₹{Math.max(due, 0).toLocaleString("en-IN")}
                            </span>
                          </div>
                        ) : (
                          <p className="font-dm-sans text-xs text-charcoal/70">Total: ₹{total.toLocaleString("en-IN")}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 5. Wedding Prep Timeline (Optional Link Out) */}
            <section className="rounded-2xl bg-primary p-6 text-cream relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-10">
                <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
                  <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <h2 className="font-cormorant text-2xl mb-2">Bridal Timeline</h2>
              <p className="font-dm-sans text-sm text-cream/70 mb-6 max-w-[200px]">
                Stay on track with AI-generated milestones for your big day.
              </p>
              <Link href="/timeline" className="inline-flex items-center gap-2 font-dm-sans text-sm font-medium text-gold hover:text-white transition-colors">
                View Full Timeline &rarr;
              </Link>
            </section>

          </div>
        </div>

        {/* 6. Account Settings */}
        <section className="pt-8 border-t border-gold/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-cormorant text-2xl text-primary">Account Settings</h2>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full border border-rose/30 bg-rose/5 px-4 py-1.5 font-dm-sans text-xs font-medium text-rose hover:bg-rose hover:text-white transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-white p-6">
            <div className="grid gap-6 sm:grid-cols-2 max-w-3xl">
              <div>
                <label className="block text-xs font-dm-sans uppercase tracking-wider text-charcoal/60 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-gold/20 px-4 py-2.5 font-dm-sans text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-dm-sans uppercase tracking-wider text-charcoal/60 mb-2">Wedding Date</label>
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full rounded-lg border border-gold/20 px-4 py-2.5 font-dm-sans text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-dm-sans uppercase tracking-wider text-charcoal/60 mb-2">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. South Delhi"
                  className="w-full rounded-lg border border-gold/20 px-4 py-2.5 font-dm-sans text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-dm-sans uppercase tracking-wider text-charcoal/60 mb-2">Budget Range</label>
                <input
                  type="text"
                  value={budgetRange}
                  onChange={(e) => setBudgetRange(e.target.value)}
                  placeholder="e.g. ₹50,000"
                  className="w-full rounded-lg border border-gold/20 px-4 py-2.5 font-dm-sans text-sm focus:border-gold focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2 flex items-center gap-4 pt-2">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="rounded-full bg-gold px-8 py-2.5 font-dm-sans text-sm font-medium text-white disabled:opacity-50 hover:bg-gold/90 transition-colors"
                >
                  {savingProfile ? "Saving..." : "Save Settings"}
                </button>
                {profileSaved && (
                  <span className="flex items-center gap-1.5 font-dm-sans text-xs text-green-700">
                    <CheckCircle2 size={14} /> Saved
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}