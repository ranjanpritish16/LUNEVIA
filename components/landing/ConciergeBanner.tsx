"use client";

import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { LuneviaButton } from "@/components/ui/LuneviaButton";

export function ConciergeBanner() {
  const router = useRouter();

  return (
    <section className="bg-gradient-to-br from-cream to-blush py-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
        <div>
          <Badge variant="gold" className="uppercase tracking-widest">
            AI-Powered
          </Badge>
          <h2 className="mt-6 font-cormorant text-5xl leading-tight text-primary">
            Meet your AI beauty concierge
          </h2>
          <p className="mt-4 font-dm-sans text-sm leading-relaxed text-charcoal">
            LUNÉVIA Concierge understands your vision, skin tone, budget and
            aesthetic — and matches you to the perfect Delhi artist. Like having
            a luxury beauty editor on speed dial.
          </p>
          <LuneviaButton
            size="lg"
            className="mt-8"
            onClick={() => router.push("/concierge")}
          >
            Try LUNÉVIA Concierge →
          </LuneviaButton>
        </div>

        <div className="mx-auto w-full max-w-sm rounded-2xl border border-gold/20 bg-white p-6 shadow-warm lg:mx-0 lg:ml-auto">
          <div className="mb-5 flex items-center gap-2 font-dm-sans text-sm font-medium text-primary">
            <span
              className="h-2 w-2 rounded-full bg-gold"
              aria-hidden="true"
            />
            LUNÉVIA Concierge
          </div>

          <div className="space-y-4">
            <div className="ml-auto max-w-[90%] rounded-2xl bg-gold p-4 font-dm-sans text-sm leading-relaxed text-primary">
              I have a traditional Delhi wedding in October, wheatish
              complexion, budget ₹28,000...
            </div>
            <div className="mr-auto max-w-[95%] rounded-2xl border border-gold/30 bg-cream p-4 font-dm-sans text-sm leading-relaxed text-charcoal">
              Perfect — based on your preferences, I recommend Neha Kapoor
              Bridal Studio. Her HD and airbrush techniques are ideal for
              outdoor October light. ✨
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
