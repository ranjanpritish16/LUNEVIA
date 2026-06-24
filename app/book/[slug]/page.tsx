import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingFlow } from "@/components/booking/BookingFlow";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

interface BookPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { data: salon } = await supabase
    .from("salons")
    .select("name")
    .eq("slug", params.slug)
    .single();

  return {
    title: salon
      ? `Book ${salon.name} — LUNÉVIA`
      : "Book — LUNÉVIA",
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { data: salon } = await supabase
    .from("salons")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (!salon) {
    notFound();
  }
  const today = new Date().toISOString().slice(0, 10);
  const { data: activeCampaign } = await supabase
    .from("artist_campaigns")
    .select("*")
    .eq("salon_id", salon.id)
    .eq("is_active", true)
    .lte("start_date", today)
    .gte("end_date", today)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return (
    <AuthGuard>
      <main className="min-h-screen bg-cream">
        <BookingFlow salon={salon} activeCampaign={activeCampaign ?? null} />
      </main>
    </AuthGuard>
  );
}
