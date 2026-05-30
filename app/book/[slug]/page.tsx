import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BookingFlow } from "@/components/booking/BookingFlow";
import { getSalonBySlug } from "@/lib/data/salons";

interface BookPageProps {
  params: { slug: string };
}

export function generateMetadata({ params }: BookPageProps): Metadata {
  const salon = getSalonBySlug(params.slug);
  return {
    title: salon
      ? `Book ${salon.name} — LUNÉVIA`
      : "Book — LUNÉVIA",
  };
}

export default function BookPage({ params }: BookPageProps) {
  const salon = getSalonBySlug(params.slug);

  if (!salon) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-cream">
      <BookingFlow salon={salon} />
    </main>
  );
}
