import type { Metadata } from "next";

import { HairstyleAnalyzer } from "@/components/hairstyle/HairstyleAnalyzer";

export const metadata: Metadata = {
  title: "AI Hairstyle Analyzer — LUNÉVIA",
  description:
    "Upload your photo and let LUNÉVIA AI analyze your face shape and recommend perfect bridal hairstyles.",
};

export default function HairstylePage() {
  return (
    <main className="min-h-screen bg-cream">
      <HairstyleAnalyzer />
    </main>
  );
}
