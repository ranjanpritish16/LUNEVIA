"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PortfolioPage() {
  const [items, setItems] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPortfolio(); }, []);

  async function fetchPortfolio() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("artist_id", user.id)
      .order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  }

  async function addItem() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !imageUrl) return;
    await supabase.from("portfolio_items").insert({
      artist_id: user.id, image_url: imageUrl, caption
    });
    setImageUrl(""); setCaption("");
    fetchPortfolio();
  }

  async function deleteItem(id: string) {
    await supabase.from("portfolio_items").delete().eq("id", id);
    fetchPortfolio();
  }

  return (
    <div className="p-6">
      <h1 className="font-cormorant text-3xl text-primary mb-6">My Portfolio</h1>

      <div className="rounded-2xl border border-gold/20 bg-white p-6 mb-8">
        <h2 className="font-cormorant text-xl text-primary mb-4">Add Photo</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Image URL"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
          <input value={caption} onChange={(e) => setCaption(e.target.value)}
            placeholder="Caption (optional)"
            className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold" />
        </div>
        <button onClick={addItem}
          className="mt-4 rounded-full bg-gold px-6 py-2 font-dm-sans text-sm text-white hover:bg-gold/90">
          Add Photo
        </button>
      </div>

      {loading ? <p className="font-dm-sans text-sm text-charcoal">Loading...</p> : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {items.length === 0 ? (
            <p className="font-dm-sans text-sm text-charcoal/60 col-span-3">No portfolio items yet.</p>
          ) : items.map((item) => (
            <div key={item.id} className="relative rounded-xl overflow-hidden border border-gold/20 group">
              <img src={item.image_url} alt={item.caption}
                className="h-48 w-full object-cover" />
              {item.caption && (
                <p className="p-2 font-dm-sans text-xs text-charcoal">{item.caption}</p>
              )}
              <button onClick={() => deleteItem(item.id)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}