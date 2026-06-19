"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

export default function AvailabilityPage() {
  const [slots, setSlots] = useState<any[]>([]);
  const [day, setDay] = useState("Monday");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSlots(); }, []);

  async function fetchSlots() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("availability")
      .select("*")
      .eq("artist_id", user.id)
      .order("day_of_week");
    setSlots(data || []);
    setLoading(false);
  }

  async function addSlot() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("availability").insert({
      artist_id: user.id, day_of_week: day, start_time: start, end_time: end
    });
    fetchSlots();
  }

  async function deleteSlot(id: string) {
    await supabase.from("availability").delete().eq("id", id);
    fetchSlots();
  }

  return (
    <div className="p-6">
      <h1 className="font-cormorant text-3xl text-primary mb-6">My Availability</h1>

      <div className="rounded-2xl border border-gold/20 bg-white p-6 mb-8">
        <h2 className="font-cormorant text-xl text-primary mb-4">Add Time Slot</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <select value={day} onChange={(e) => setDay(e.target.value)}
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold">
            {DAYS.map((d) => <option key={d}>{d}</option>)}
          </select>
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)}
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)}
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
        </div>
        <button onClick={addSlot}
          className="mt-4 rounded-full bg-gold px-6 py-2 font-dm-sans text-sm text-white hover:bg-gold/90">
          Add Slot
        </button>
      </div>

      {loading ? <p className="font-dm-sans text-sm text-charcoal">Loading...</p> : (
        <div className="space-y-3">
          {slots.length === 0 ? (
            <p className="font-dm-sans text-sm text-charcoal/60">No availability set yet.</p>
          ) : slots.map((s) => (
            <div key={s.id} className="rounded-2xl border border-gold/20 bg-white p-4 flex justify-between items-center">
              <div>
                <p className="font-cormorant text-lg text-primary">{s.day_of_week}</p>
                <p className="font-dm-sans text-sm text-charcoal">{s.start_time} — {s.end_time}</p>
              </div>
              <button onClick={() => deleteSlot(s.id)}
                className="text-red-400 font-dm-sans text-xs hover:text-red-600">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}