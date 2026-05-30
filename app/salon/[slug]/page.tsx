import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SalonDetailPage } from "@/components/salon/SalonDetailPage";
import { getAllSalonSlugs, getSalonBySlug } from "@/lib/data/salons";

interface SalonPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSalonSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: SalonPageProps): Metadata {
  const salon = getSalonBySlug(params.slug);

  if (!salon) {
    return { title: "Salon Not Found — LUNÉVIA" };
  }

  return {
    title: `${salon.name} — LUNÉVIA`,
    description: salon.bio[0],
  };
}

export default function SalonPage({ params }: SalonPageProps) {
  const salon = getSalonBySlug(params.slug);

  if (!salon) {
    notFound();
  }

  return <SalonDetailPage salon={salon} />;
}
