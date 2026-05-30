"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { LuneviaButton } from "@/components/ui/LuneviaButton";
import type { Salon, SalonService } from "@/lib/data/salons";
import { cn } from "@/lib/utils";

type TabId = "overview" | "portfolio" | "services" | "reviews";

const TABS: { id: TabId; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "portfolio", label: "Portfolio" },
  { id: "services", label: "Services & Pricing" },
  { id: "reviews", label: "Reviews" },
];

interface SalonDetailPageProps {
  salon: Salon;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 text-gold">
      <span aria-hidden="true">★</span>
      <span className="font-dm-sans text-sm font-medium text-cream">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

function ServiceAccordionItem({
  service,
  slug,
  isOpen,
  onToggle,
}: {
  service: SalonService;
  slug: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const router = useRouter();

  return (
    <div className="border-b border-gold/20 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 py-5 text-left"
      >
        <div>
          <h4 className="font-cormorant text-xl text-primary">{service.name}</h4>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="font-cormorant text-xl text-gold">
              {service.price}
            </span>
            <Badge variant="blush">{service.duration}</Badge>
          </div>
        </div>
        <span className="font-dm-sans text-gold">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden pb-5"
        >
          <p className="font-dm-sans text-sm leading-relaxed text-charcoal">
            {service.description}
          </p>
          <LuneviaButton
            variant="ghost"
            size="sm"
            className="mt-4"
            onClick={() => router.push(`/book/${slug}`)}
          >
            Book This Service
          </LuneviaButton>
        </motion.div>
      )}
    </div>
  );
}

export function SalonDetailPage({ salon }: SalonDetailPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [openServiceId, setOpenServiceId] = useState(salon.services[0]?.id ?? "");
  const [showStickyBook, setShowStickyBook] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowStickyBook(latest > 380);
  });

  return (
    <div className="min-h-screen bg-cream pb-16 pt-16 md:pt-20">
      <div className="relative h-96 w-full">
        <Image
          src={salon.coverImage}
          alt={salon.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/10 to-transparent"
          aria-hidden="true"
        />

        <div className="absolute bottom-6 left-4 right-4 md:left-8 md:right-8">
          <div className="max-w-2xl">
            {salon.verified && (
              <Badge variant="verified" className="mb-3">
                Verified
              </Badge>
            )}
            <h1 className="font-cormorant text-4xl text-cream md:text-5xl">
              {salon.name}
            </h1>
            <p className="mt-1 font-dm-sans text-cream/70">{salon.location}</p>
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <StarRow rating={salon.rating} />
                <span className="font-dm-sans text-sm text-cream/70">
                  ({salon.reviewCount} reviews)
                </span>
              </div>
              <Badge variant="gold">{salon.priceRange}</Badge>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{
          opacity: showStickyBook ? 1 : 0,
          y: showStickyBook ? 0 : -8,
          pointerEvents: showStickyBook ? "auto" : "none",
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="fixed right-4 top-20 z-40 md:right-8 md:top-24"
      >
        <LuneviaButton
          size="md"
          onClick={() => router.push(`/book/${salon.slug}`)}
        >
          Book Now
        </LuneviaButton>
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="mt-8 flex gap-1 overflow-x-auto border-b border-gold/20">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "shrink-0 border-b-2 px-4 py-3 font-dm-sans text-sm transition-colors duration-[400ms] ease-in-out",
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-charcoal hover:text-gold"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="py-10">
          {activeTab === "overview" && (
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h2 className="font-cormorant text-3xl text-primary">
                  About the Studio
                </h2>
                {salon.bio.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-4 font-dm-sans text-sm leading-relaxed text-charcoal"
                  >
                    {paragraph}
                  </p>
                ))}
                <div className="mt-6 flex flex-wrap gap-2">
                  {salon.specialty.map((item) => (
                    <Badge key={item} variant="rose">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="font-cormorant text-3xl text-primary">Team</h2>
                <div className="mt-4 space-y-4">
                  {salon.team.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-center gap-4 rounded-2xl border border-gold/20 bg-white p-4 shadow-warm"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/10 font-cormorant text-lg text-gold">
                        {member.initials}
                      </div>
                      <div>
                        <p className="font-cormorant text-xl text-primary">
                          {member.name}
                        </p>
                        <p className="font-dm-sans text-sm text-charcoal">
                          {member.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className="columns-2 gap-4 md:columns-3">
              {salon.portfolio.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className="group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={src}
                      alt={`${salon.name} portfolio ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-[400ms] ease-in-out group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-gold/0 font-dm-sans text-sm font-medium text-cream opacity-0 transition-all duration-[400ms] ease-in-out group-hover:bg-gold/40 group-hover:opacity-100">
                      View
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "services" && (
            <div className="rounded-2xl border border-gold/20 bg-white px-5 shadow-warm md:px-8">
              {salon.services.map((service) => (
                <ServiceAccordionItem
                  key={service.id}
                  service={service}
                  slug={salon.slug}
                  isOpen={openServiceId === service.id}
                  onToggle={() =>
                    setOpenServiceId(
                      openServiceId === service.id ? "" : service.id
                    )
                  }
                />
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-gold bg-gold/5 p-6">
                <div className="flex items-start gap-3">
                  <span className="text-xl" aria-hidden="true">
                    ✨
                  </span>
                  <div>
                    <p className="font-dm-sans text-sm leading-relaxed text-charcoal">
                      {salon.aiSummary}
                    </p>
                    <p className="mt-3 font-dm-sans text-xs font-medium text-gold">
                      Summary by LUNÉVIA Concierge ✨
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {salon.reviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-2xl border border-gold/20 bg-white p-6 shadow-warm"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/10 font-cormorant text-gold">
                          {review.initials}
                        </div>
                        <div>
                          <p className="font-cormorant text-lg text-primary">
                            {review.author}
                          </p>
                          <p className="font-dm-sans text-xs text-charcoal/60">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-dm-sans text-[10px] font-medium uppercase tracking-wide text-emerald-800">
                        Verified Booking
                      </span>
                    </div>
                    <div className="mt-3 flex text-gold" aria-hidden="true">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <p className="mt-3 font-dm-sans text-sm leading-relaxed text-charcoal">
                      {review.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center pb-8 md:hidden">
          <LuneviaButton
            size="lg"
            className="w-full max-w-sm"
            onClick={() => router.push(`/book/${salon.slug}`)}
          >
            Book Now
          </LuneviaButton>
        </div>
      </div>
    </div>
  );
}
