"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

interface DayHours {
  open: boolean;
  start: string;
  end: string;
}

type WorkingHours = Record<string, DayHours>;

const DEFAULT_HOURS: DayHours = { open: false, start: "09:00", end: "17:00" };

export default function AvailabilityPage() {
  const [salonId, setSalonId] = useState<string | null>(null);
  const [hours, setHours] = useState<WorkingHours>(
    DAYS.reduce((acc, d) => ({ ...acc, [d]: { ...DEFAULT_HOURS } }), {} as WorkingHours)
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchHours();
  }, []);

  async function fetchHours() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("salons")
      .select("id, working_hours")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (data) {
      setSalonId(data.id);
      if (data.working_hours) {
        // Merge with defaults so any missing days don't break the grid
        setHours((prev) => ({ ...prev, ...data.working_hours }));
      }
    }
    setLoading(false);
  }

  function toggleDay(day: string) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], open: !prev[day].open },
    }));
  }

  function updateTime(day: string, field: "start" | "end", value: string) {
    setHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  }

  async function saveHours() {
    if (!salonId) return;
    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("salons")
      .update({ working_hours: hours })
      .eq("id", salonId);

    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }

  const totalOpenDays = DAYS.filter((d) => hours[d]?.open).length;

  if (loading) {
    return (
      <div className="p-6 sm:p-10 space-y-4">
        <div className="h-9 w-56 animate-pulse rounded-lg bg-blush" />
        <div className="h-20 animate-pulse rounded-2xl bg-white/70" />
        <div className="space-y-2">
          {DAYS.map((d) => (
            <div key={d} className="h-16 animate-pulse rounded-xl bg-white/70" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-4xl">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="font-cormorant text-3xl text-primary">Availability</h1>
        <p className="font-dm-sans text-sm text-charcoal/60">
          Set the hours brides can book you. Save to apply changes to your public calendar.
        </p>
      </div>

      {/* Status strip */}
      <div className="mb-8 flex items-center gap-6 rounded-2xl border border-gold/15 bg-white/60 px-6 py-4">
        <div>
          <p className="font-playfair text-2xl italic text-primary">{totalOpenDays}/7</p>
          <p className="font-dm-sans text-xs text-charcoal/60">days open</p>
        </div>
      </div>

      {/* Weekly grid */}
      <div className="overflow-hidden rounded-2xl border border-gold/20 bg-white">
        {DAYS.map((d, i) => {
          const day = hours[d] ?? DEFAULT_HOURS;
          return (
            <div
              key={d}
              className={`flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between ${i !== DAYS.length - 1 ? "border-b border-gold/10" : ""
                }`}
            >
              <div className="flex items-center gap-4 sm:w-44">
                <button
                  onClick={() => toggleDay(d)}
                  role="switch"
                  aria-checked={day.open}
                  className={`relative h-7 w-12 flex-shrink-0 rounded-full border transition-colors ${day.open ? "border-gold bg-gold" : "border-charcoal/25 bg-white"
                    }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full shadow transition-transform ${day.open ? "translate-x-5 bg-white" : "translate-x-0 bg-charcoal/30"
                      }`}
                  />
                </button>
                <p className="font-cormorant text-lg text-primary">{d}</p>
              </div>

              {day.open ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.start}
                    onChange={(e) => updateTime(d, "start", e.target.value)}
                    className="rounded-lg border border-gold/20 px-3 py-1.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
                  />
                  <span className="font-dm-sans text-xs text-charcoal/40">to</span>
                  <input
                    type="time"
                    value={day.end}
                    onChange={(e) => updateTime(d, "end", e.target.value)}
                    className="rounded-lg border border-gold/20 px-3 py-1.5 font-dm-sans text-sm text-charcoal focus:border-gold focus:outline-none"
                  />
                </div>
              ) : (
                <p className="font-dm-sans text-xs italic text-charcoal/40">Closed</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Save */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={saveHours}
          disabled={saving}
          className="rounded-full bg-gold px-8 py-2.5 font-dm-sans text-sm font-medium text-white hover:bg-gold/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && (
          <span className="font-dm-sans text-xs text-green-700">Saved</span>
        )}
      </div>
    </div>
  );
}