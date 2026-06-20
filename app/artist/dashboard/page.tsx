"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace("/artist/login"); return; }

      const { data: salon } = await supabase
        .from("salons")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (!salon) { router.replace("/artist/onboarding"); return; }

      fetchServices();
    }
    init();
  }, []);

  async function fetchServices() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("artist_id", user.id);
    setServices(data || []);
    setLoading(false);
  }

  async function addService() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !name) return;
    await supabase.from("services").insert({
      artist_id: user.id, name, price: +price, duration, description
    });
    setName(""); setPrice(""); setDuration(""); setDescription("");
    fetchServices();
  }

  async function deleteService(id: string) {
    await supabase.from("services").delete().eq("id", id);
    fetchServices();
  }

  return (
    <div className="p-6">
      <h1 className="font-cormorant text-3xl text-primary mb-6">My Services</h1>

      <div className="rounded-2xl border border-gold/20 bg-white p-6 mb-8">
        <h2 className="font-cormorant text-xl text-primary mb-4">Add New Service</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Service name"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <input value={price} onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (₹)" type="number"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <input value={duration} onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (e.g. 2 hrs)"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
        </div>
        <button onClick={addService}
          className="mt-4 rounded-full bg-gold px-6 py-2 font-dm-sans text-sm text-white hover:bg-gold/90">
          Add Service
        </button>
      </div>

      {loading ? (
        <p className="font-dm-sans text-sm text-charcoal">Loading...</p>
      ) : (
        <div className="space-y-4">
          {services.length === 0 ? (
            <p className="font-dm-sans text-sm text-charcoal/60">No services yet. Add your first one above!</p>
          ) : services.map((s) => (
            <div key={s.id} className="rounded-2xl border border-gold/20 bg-white p-5 flex justify-between items-start">
              <div>
                <h3 className="font-cormorant text-lg text-primary">{s.name}</h3>
                <p className="font-dm-sans text-sm text-charcoal">₹{s.price} · {s.duration}</p>
                <p className="font-dm-sans text-sm text-charcoal/60 mt-1">{s.description}</p>
              </div>
              <button onClick={() => deleteService(s.id)}
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