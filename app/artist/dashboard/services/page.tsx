"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";

export default function ServicesPage() {
  const { salon, isLoading, refetch } = useArtistSalon();
  
  // Add new service state
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Bridal Makeup");
  const [isAdding, setIsAdding] = useState(false);

  // Edit service state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [isSavingEdit, setIsSavingEdit] = useState(false);

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

  function startEdit(service: any) {
    setEditingId(service.id);
    setEditData({ ...service });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditData({});
  }

  async function saveEdit() {
    if (!salon || !editingId) return;
    setIsSavingEdit(true);

    const updatedServices = services.map((s: any) => 
      s.id === editingId ? { ...editData, price: Number(editData.price) || 0 } : s
    );

    const { error } = await supabase
      .from("salons")
      .update({ services: updatedServices })
      .eq("id", salon.id);

    if (!error) {
      await refetch();
      setEditingId(null);
    }
    setIsSavingEdit(false);
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
    return <p className="font-dm-sans text-sm text-charcoal p-6">Loading services...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="font-cormorant text-3xl text-primary mb-6">My Services</h1>

      <div className="rounded-2xl border border-gold/20 bg-white p-6 mb-8 shadow-warm">
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
          className="mt-4 rounded-full bg-gold px-6 py-2 font-dm-sans text-sm font-medium text-white hover:bg-gold/90 transition-colors disabled:opacity-50">
          {isAdding ? "Adding..." : "Add Service"}
        </button>
      </div>

      <div className="space-y-4">
        {services.length === 0 ? (
          <p className="font-dm-sans text-sm text-charcoal/60">No services yet. Add your first one above!</p>
        ) : services.map((s: any) => (
          <div key={s.id} className="rounded-2xl border border-gold/20 bg-white p-5 shadow-sm transition-all">
            {editingId === s.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input value={editData.name || ""} onChange={(e) => setEditData({...editData, name: e.target.value})}
                    placeholder="Service name *" 
                    className="rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
                  <input value={editData.price || ""} onChange={(e) => setEditData({...editData, price: e.target.value})}
                    placeholder="Price (₹) *" type="number"
                    className="rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
                  <input value={editData.duration || ""} onChange={(e) => setEditData({...editData, duration: e.target.value})}
                    placeholder="Duration (e.g. 2 hrs)"
                    className="rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
                  <select value={editData.category || "Bridal Makeup"} onChange={(e) => setEditData({...editData, category: e.target.value})}
                    className="rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold">
                    <option value="Bridal Makeup">Bridal Makeup</option>
                    <option value="Pre-Bridal">Pre-Bridal</option>
                    <option value="Hair">Hair</option>
                    <option value="Mehendi">Mehendi</option>
                    <option value="Other">Other</option>
                  </select>
                  <input value={editData.description || ""} onChange={(e) => setEditData({...editData, description: e.target.value})}
                    placeholder="Description"
                    className="col-span-1 sm:col-span-2 rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <button onClick={cancelEdit}
                    className="text-charcoal/60 font-dm-sans text-xs hover:text-charcoal transition-colors">
                    Cancel
                  </button>
                  <button onClick={saveEdit} disabled={isSavingEdit || !editData.name}
                    className="rounded-full bg-gold px-5 py-1.5 font-dm-sans text-xs font-medium text-white hover:bg-gold/90 transition-colors disabled:opacity-50">
                    {isSavingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-4">
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
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button onClick={() => startEdit(s)}
                    className="text-gold font-dm-sans text-xs hover:text-gold/80 transition-colors font-medium">
                    Edit
                  </button>
                  <button onClick={() => deleteService(s.id)}
                    className="text-red-400 font-dm-sans text-xs hover:text-red-600 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}