import { ExplorePage } from "@/components/explore/ExplorePage";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Artists — LUNÉVIA",
  description: "Browse and filter Delhi's finest verified bridal beauty artists.",
};

export const revalidate = 0;

export default async function Explore() {
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: salons }, { data: campaigns }] = await Promise.all([
    supabase.from("salons").select("*").order("rating", { ascending: false }),
    supabase
      .from("artist_campaigns")
      .select("salon_id, offer_type, discount_value")
      .eq("is_active", true)
      .lte("start_date", today)
      .gte("end_date", today),
  ]);

  // Map salon_id → best campaign (first one wins, already ordered by recency)
  const campaignMap: Record<string, { offer_type: string; discount_value: number }> = {};
  for (const c of campaigns ?? []) {
    if (!campaignMap[c.salon_id]) campaignMap[c.salon_id] = c;
  }

  return <ExplorePage salons={salons || []} campaignMap={campaignMap} />;
}