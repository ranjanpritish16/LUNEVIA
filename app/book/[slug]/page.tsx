import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingFlow } from "@/components/booking/BookingFlow";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { supabase } from "@/lib/supabase";

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

  return (
    <AuthGuard>
      <main className="min-h-screen bg-cream">
        <BookingFlow salon={salon} />
      </main>
    </AuthGuard>
  );
}
