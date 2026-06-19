import { ExplorePage } from "@/components/explore/ExplorePage";
import { supabase } from "@/lib/supabase";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Artists — LUNÉVIA",
  description: "Browse and filter Delhi's finest verified bridal beauty artists.",
};

export default async function Explore() {
  const { data: salons } = await supabase
    .from("salons")
    .select("*")
    .order("rating", { ascending: false });

  return <ExplorePage salons={salons || []} />;
}