"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";

export default function ServicesPage() {
  const { salon, isLoading, refetch } = useArtistSalon();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Bridal Makeup");
  const [isAdding, setIsAdding] = useState(false);

  // Extract services from salon JSON
  const services = (salon?.services || []) as any[];

  async function addService() {
    if (!salon || !name) return;
    setIsAdding(true);

    const newService = {
      id: Math.random().toString(36).slice(2),
      name: name.trim(),
      price: Number(price) || 0,
      duration: duration.trim(),
      description: description.trim(),
      category: category,
    };

    const updatedServices = [...services, newService];

    const { error } = await supabase
      .from("salons")
      .update({ services: updatedServices })
      .eq("id", salon.id);

    if (!error) {
      setName("");
      setPrice("");
      setDuration("");
      setDescription("");
      await refetch();
    }
    setIsAdding(false);
  }

  async function deleteService(id: string) {
    if (!salon) return;
    
    const updatedServices = services.filter((s: any) => s.id !== id);
    
    const { error } = await supabase
      .from("salons")
      .update({ services: updatedServices })
      .eq("id", salon.id);

    if (!error) {
      await refetch();
    }
  }

  if (isLoading) {
    return <p className="font-dm-sans text-sm text-charcoal">Loading services...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="font-cormorant text-3xl text-primary mb-6">My Services</h1>

      <div className="rounded-2xl border border-gold/20 bg-white p-6 mb-8">
        <h2 className="font-cormorant text-xl text-primary mb-4">Add New Service</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Service name *" 
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <input value={price} onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (₹) *" type="number"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <input value={duration} onChange={(e) => setDuration(e.target.value)}
            placeholder="Duration (e.g. 2 hrs)"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <select value={category} onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold">
            <option value="Bridal Makeup">Bridal Makeup</option>
            <option value="Pre-Bridal">Pre-Bridal</option>
            <option value="Hair">Hair</option>
            <option value="Mehendi">Mehendi</option>
            <option value="Other">Other</option>
          </select>
          <input value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            className="col-span-1 sm:col-span-2 rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
        </div>
        <button onClick={addService} disabled={isAdding || !name}
          className="mt-4 rounded-full bg-gold px-6 py-2 font-dm-sans text-sm text-white hover:bg-gold/90 disabled:opacity-50">
          {isAdding ? "Adding..." : "Add Service"}
        </button>
      </div>

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="font-dm-sans text-sm text-charcoal/60">No services yet. Add your first one above!</p>
        ) : services.map((s: any) => (
          <div key={s.id} className="rounded-2xl border border-gold/20 bg-white p-5 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cormorant text-lg font-semibold text-primary">{s.name}</h3>
                <span className="bg-blush px-2 py-0.5 rounded-full text-[10px] font-dm-sans text-charcoal/70 uppercase tracking-widest">{s.category}</span>
              </div>
              <p className="font-dm-sans text-sm text-charcoal mt-1">₹{s.price} {s.duration && `· ${s.duration}`}</p>
              {s.description && (
                <p className="font-dm-sans text-sm text-charcoal/60 mt-2">{s.description}</p>
              )}
            </div>
            <button onClick={() => deleteService(s.id)}
              className="text-red-400 font-dm-sans text-xs hover:text-red-600 transition-colors">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}