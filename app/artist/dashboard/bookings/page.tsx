"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { Phone, StickyNote } from "lucide-react";

const FILTERS = ["All", "Pending", "Confirmed", "Completed", "Declined"] as const;
type Filter = (typeof FILTERS)[number];

const STATUS_MAP: Record<Filter, string | null> = {
  All: null,
  Pending: "pending",
  Confirmed: "confirmed",
  Completed: "completed",
  Declined: "declined",
};

export default function ArtistBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("All");
  const [decliningId, setDecliningId] = useState<string | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  
  const [updatingPaymentId, setUpdatingPaymentId] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    fetchBookings();

    const subscription = supabase
      .channel("bookings-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        () => {
          // Re-fetch bookings when a new one is inserted
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  async function fetchBookings() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: salonData } = await supabase
      .from("salons")
      .select("id, services")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (!salonData) {
      setLoading(false);
      return;
    }

    setServices(salonData.services ?? []);

    const { data } = await supabase
      .from("bookings")
      .select("*")
      .eq("salon_id", salonData.id)
      .order("created_at", { ascending: false });

    // Auto-update confirmed bookings to completed if their time has passed
    const now = new Date();
    const servicesData = salonData.services ?? [];
    
    const processedData = (data || []).map((b) => {
      if (b.status === "confirmed" && b.date && b.time_slot) {
        const service = servicesData.find((s: any) => s.id === b.service_id);
        const durationStr = service?.duration || "";
        let durationHours = 0;
        
        if (durationStr !== "ongoing") {
          // Support decimal hours like "0.5 hrs"
          const match = durationStr.match(/(\d+(\.\d+)?)/);
          if (match) durationHours = parseFloat(match[1]);
        }

        // Even if we don't have duration hours, we add 4 hours by default as buffer if parsing fails completely
        if (durationHours === 0 && durationStr !== "ongoing") {
          durationHours = 4;
        }

        if (durationHours > 0) {
          const bookingDate = new Date(`${b.date} ${b.time_slot}`);
          if (!isNaN(bookingDate.getTime())) {
            const completionDate = new Date(bookingDate.getTime() + durationHours * 60 * 60 * 1000);
            if (now > completionDate) {
              b.status = "completed";
              // Fire and forget background DB update
              supabase.from("bookings").update({ status: "completed" }).eq("id", b.id).then();
            }
          }
        }
      }
      return b;
    });

    setBookings(processedData);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchBookings();
  }

  async function confirmDecline(id: string) {
    await supabase
      .from("bookings")
      .update({ status: "declined", notes: declineReason || null })
      .eq("id", id);
    setDecliningId(null);
    setDeclineReason("");
    fetchBookings();
  }

  async function confirmPaymentUpdate(id: string) {
    const amount = Number(paymentAmount) || 0;
    await supabase
      .from("bookings")
      .update({ amount_paid: amount })
      .eq("id", id);
    setUpdatingPaymentId(null);
    setPaymentAmount("");
    fetchBookings();
  }

  async function handleToggleFullyPaid(id: string, isChecked: boolean, totalAmount: number) {
    const newAmount = isChecked ? Number(totalAmount) : 0;
    await supabase
      .from("bookings")
      .update({ amount_paid: newAmount })
      .eq("id", id);
    fetchBookings();
  }

  function serviceLabel(serviceId: string) {
    const match = services.find((s: any) => s.id === serviceId);
    return match?.name ?? serviceId ?? "—";
  }

  // Pending bookings always surface first, regardless of date or filter sort order
  const sorted = useMemo(() => {
    const filtered =
      filter === "All" ? bookings : bookings.filter((b) => b.status === STATUS_MAP[filter]);
    return [...filtered].sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return 0;
    });
  }, [bookings, filter]);

  const pendingCount = bookings.filter((b) => b.status === "pending").length;

  const statusStyle: Record<string, string> = {
    pending: "bg-gold/15 text-gold",
    confirmed: "bg-green-100 text-green-700",
    declined: "bg-rose/15 text-rose",
    completed: "bg-charcoal/10 text-charcoal/70",
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
      <div className="flex flex-col gap-2 border-b border-gold/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <h1 className="font-cormorant text-3xl text-primary">Bookings</h1>
        {pendingCount > 0 && (
          <p className="font-dm-sans text-sm text-gold">
            {pendingCount} booking{pendingCount > 1 ? "s" : ""} need{pendingCount === 1 ? "s" : ""} your response
          </p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 font-dm-sans text-xs transition-colors ${filter === f
                ? "bg-gold text-white"
                : "bg-white border border-gold/20 text-charcoal/60 hover:border-gold/50"
              }`}
          >
            {f}
            {f === "Pending" && pendingCount > 0 && (
              <span className="ml-1.5">({pendingCount})</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/70" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-2xl border border-gold/20 bg-white p-10 text-center">
          <p className="font-dm-sans text-sm text-charcoal/50">
            {filter === "All" ? "No bookings yet." : `No ${filter.toLowerCase()} bookings.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border bg-white p-5 ${b.status === "pending" ? "border-gold/40" : "border-gold/20"
                }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-cormorant text-lg text-primary">{b.customer_name ?? "—"}</p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 font-dm-sans text-xs font-medium ${statusStyle[b.status] ?? "bg-charcoal/10 text-charcoal/70"
                        }`}
                    >
                      {b.status ?? "unknown"}
                    </span>
                  </div>

                  <p className="font-dm-sans text-sm text-charcoal">{serviceLabel(b.service_id)}</p>

                  <p className="font-dm-sans text-sm text-charcoal/70">
                    {b.date ?? "—"} {b.time_slot ? `· ${b.time_slot}` : ""}
                  </p>

                  {b.customer_phone && (
                    <p className="flex items-center gap-1.5 font-dm-sans text-xs text-charcoal/50">
                      <Phone size={12} /> {b.customer_phone}
                    </p>
                  )}

                  {b.notes && (
                    <p className="flex items-start gap-1.5 font-dm-sans text-xs text-charcoal/50">
                      <StickyNote size={12} className="mt-0.5 flex-shrink-0" /> {b.notes}
                    </p>
                  )}

                  {b.total_amount != null && (
                    <p className="font-playfair text-sm italic text-primary">
                      ₹{Number(b.total_amount).toLocaleString("en-IN")}
                    </p>
                  )}
                </div>

                {b.status === "pending" && (
                  <div className="flex flex-shrink-0 gap-2">
                    <button
                      onClick={() => updateStatus(b.id, "confirmed")}
                      className="rounded-full bg-green-600 px-4 py-1.5 font-dm-sans text-xs font-medium text-white hover:bg-green-700"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDecliningId(b.id)}
                      className="rounded-full border border-rose/40 px-4 py-1.5 font-dm-sans text-xs font-medium text-rose hover:bg-rose/5"
                    >
                      Decline
                    </button>
                  </div>
                )}
                
                {(b.status === "confirmed" || b.status === "completed") && (
                  <div className="flex flex-col items-end flex-shrink-0 gap-2">
                    {b.amount_paid != null && (
                      <p className="font-dm-sans text-xs text-charcoal/60">
                        Paid: ₹{Number(b.amount_paid).toLocaleString("en-IN")}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-3">
                      {b.total_amount != null && (
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={Number(b.amount_paid) >= Number(b.total_amount)}
                            onChange={(e) => handleToggleFullyPaid(b.id, e.target.checked, b.total_amount)}
                            className="accent-gold w-3.5 h-3.5 rounded border-gold/40 cursor-pointer"
                          />
                          <span className="font-dm-sans text-xs text-charcoal/70 select-none">Fully Paid</span>
                        </label>
                      )}

                      {(!b.total_amount || Number(b.amount_paid) < Number(b.total_amount)) && (
                        <button
                          onClick={() => {
                            setUpdatingPaymentId(b.id);
                            setPaymentAmount(b.amount_paid?.toString() || "");
                          }}
                          className="rounded-full border border-gold/40 px-3 py-1 font-dm-sans text-xs font-medium text-gold hover:bg-gold/5"
                        >
                          Update Payment
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {decliningId === b.id && (
                <div className="mt-4 flex flex-col gap-2 border-t border-gold/10 pt-4 sm:flex-row">
                  <input
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                    placeholder="Reason (optional)"
                    className="flex-1 rounded-lg border border-gold/20 px-3 py-2 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmDecline(b.id)}
                      className="rounded-full bg-rose px-4 py-2 font-dm-sans text-xs font-medium text-white hover:bg-rose/90"
                    >
                      Confirm decline
                    </button>
                    <button
                      onClick={() => {
                        setDecliningId(null);
                        setDeclineReason("");
                      }}
                      className="rounded-full border border-gold/20 px-4 py-2 font-dm-sans text-xs text-charcoal/60 hover:border-gold/50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {updatingPaymentId === b.id && (
                <div className="mt-4 flex flex-col gap-2 border-t border-gold/10 pt-4 sm:flex-row sm:items-center">
                  <label className="font-dm-sans text-sm text-charcoal/60 whitespace-nowrap">Amount Paid (₹):</label>
                  <input
                    type="number"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder={`e.g. ${b.total_amount ? Number(b.total_amount) / 2 : 5000}`}
                    className="flex-1 rounded-lg border border-gold/20 px-3 py-2 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => confirmPaymentUpdate(b.id)}
                      className="rounded-full bg-green-600 px-4 py-2 font-dm-sans text-xs font-medium text-white hover:bg-green-700"
                    >
                      Save Payment
                    </button>
                    <button
                      onClick={() => {
                        setUpdatingPaymentId(null);
                        setPaymentAmount("");
                      }}
                      className="rounded-full border border-gold/20 px-4 py-2 font-dm-sans text-xs text-charcoal/60 hover:border-gold/50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}