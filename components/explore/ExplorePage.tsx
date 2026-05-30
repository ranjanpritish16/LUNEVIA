"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { SalonCard } from "@/components/ui/SalonCard";
import type { SalonCardProps } from "@/components/ui/SalonCard";
import { LuneviaButton } from "@/components/ui/LuneviaButton";
import {
  LOCATION_FILTERS,
  SPECIALTY_FILTERS,
} from "@/lib/data/filters";
import { cn } from "@/lib/utils";

const PRICE_OPTIONS = [
  { value: "₹", label: "₹ Budget-friendly" },
  { value: "₹₹", label: "₹₹ Mid-range" },
  { value: "₹₹₹", label: "₹₹₹ Luxury" },
] as const;

const RATING_OPTIONS = [
  { value: "4.5", label: "4.5+ stars" },
  { value: "4.0", label: "4.0+ stars" },
  { value: "any", label: "Any rating" },
] as const;

const MOBILE_FILTER_PILLS = [
  ...SPECIALTY_FILTERS.slice(0, 3),
  "₹₹",
  "4.5+",
  ...LOCATION_FILTERS.slice(0, 2),
] as const;

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-charcoal/50"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gold/20 py-5 last:border-b-0">
      <h3 className="mb-3 font-dm-sans text-xs font-semibold uppercase tracking-wider text-charcoal">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ExplorePage({ salons }: { salons: SalonCardProps[] }) {
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [rating, setRating] = useState("any");
  const [locations, setLocations] = useState<string[]>([]);
  const [mobilePills, setMobilePills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("top-rated");

  const toggleItem = (
    value: string,
    list: string[],
    setter: (v: string[]) => void
  ) => {
    setter(
      list.includes(value)
        ? list.filter((item) => item !== value)
        : [...list, value]
    );
  };

  const clearAll = () => {
    setSpecialties([]);
    setPrices([]);
    setRating("any");
    setLocations([]);
    setMobilePills([]);
  };

  const toggleMobilePill = (pill: string) => {
    setMobilePills((prev) =>
      prev.includes(pill) ? prev.filter((p) => p !== pill) : [...prev, pill]
    );
  };

  return (
    <div className="min-h-screen bg-cream pt-20 md:pt-24">
      <div className="mx-auto flex max-w-7xl gap-8 px-4 pb-16 md:px-6">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24 rounded-2xl border border-gold/20 bg-white p-5 shadow-warm">
            <h2 className="font-cormorant text-2xl text-primary">
              Filter & Discover
            </h2>

            <div className="mt-2">
              <FilterSection title="Specialty">
                <ul className="space-y-2.5">
                  {SPECIALTY_FILTERS.map((item) => (
                    <li key={item}>
                      <label className="flex cursor-pointer items-center gap-2.5 font-dm-sans text-sm text-charcoal">
                        <input
                          type="checkbox"
                          checked={specialties.includes(item)}
                          onChange={() =>
                            toggleItem(item, specialties, setSpecialties)
                          }
                          className="h-4 w-4 rounded border-gold/40 text-gold focus:ring-gold/30"
                        />
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              </FilterSection>

              <FilterSection title="Price Range">
                <div className="flex flex-col gap-2">
                  {PRICE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() =>
                        toggleItem(option.value, prices, setPrices)
                      }
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-left font-dm-sans text-xs transition-colors duration-[400ms] ease-in-out",
                        prices.includes(option.value)
                          ? "border-gold bg-gold/10 text-primary"
                          : "border-gold/20 bg-blush text-charcoal hover:border-gold/40"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </FilterSection>

              <FilterSection title="Rating">
                <ul className="space-y-2.5">
                  {RATING_OPTIONS.map((option) => (
                    <li key={option.value}>
                      <label className="flex cursor-pointer items-center gap-2.5 font-dm-sans text-sm text-charcoal">
                        <input
                          type="radio"
                          name="rating"
                          checked={rating === option.value}
                          onChange={() => setRating(option.value)}
                          className="h-4 w-4 border-gold/40 text-gold focus:ring-gold/30"
                        />
                        {option.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </FilterSection>

              <FilterSection title="Location">
                <ul className="space-y-2.5">
                  {LOCATION_FILTERS.map((item) => (
                    <li key={item}>
                      <label className="flex cursor-pointer items-center gap-2.5 font-dm-sans text-sm text-charcoal">
                        <input
                          type="checkbox"
                          checked={locations.includes(item)}
                          onChange={() =>
                            toggleItem(item, locations, setLocations)
                          }
                          className="h-4 w-4 rounded border-gold/40 text-gold focus:ring-gold/30"
                        />
                        {item}
                      </label>
                    </li>
                  ))}
                </ul>
              </FilterSection>
            </div>

            <button
              type="button"
              onClick={clearAll}
              className="mt-4 font-dm-sans text-sm text-gold transition-colors duration-[400ms] ease-in-out hover:text-gold/80"
            >
              Clear All
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 overflow-x-auto pb-2 md:hidden">
            {MOBILE_FILTER_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                onClick={() => toggleMobilePill(pill)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 font-dm-sans text-xs transition-colors duration-[400ms] ease-in-out",
                  mobilePills.includes(pill)
                    ? "border-gold bg-gold/10 text-primary"
                    : "border-gold/20 bg-blush text-charcoal"
                )}
              >
                {pill}
              </button>
            ))}
          </div>

          <form
            role="search"
            className="mb-6 flex items-center gap-2 rounded-full border border-gold bg-white py-1.5 pl-4 pr-1.5 shadow-warm"
            onSubmit={(e) => e.preventDefault()}
          >
            <SearchIcon />
            <input
              type="search"
              placeholder="Search artists, specialties, locations..."
              className="min-w-0 flex-1 bg-transparent font-dm-sans text-sm text-primary placeholder:text-charcoal/40 focus:outline-none"
              aria-label="Search salons"
            />
            <LuneviaButton type="submit" size="sm" className="shrink-0">
              Search
            </LuneviaButton>
          </form>

          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-dm-sans text-sm text-charcoal">
              24 Artists in Delhi
            </p>
            <label className="flex items-center gap-2 font-dm-sans text-sm text-charcoal">
              <span className="opacity-70">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cursor-pointer rounded-lg border border-gold/20 bg-white px-3 py-1.5 text-sm text-primary focus:border-gold focus:outline-none"
              >
                <option value="top-rated">Top Rated</option>
                <option value="most-reviewed">Most Reviewed</option>
                <option value="price-low">Price: Low to High</option>
              </select>
            </label>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {salons.map((salon) => (
              <motion.div
                key={salon.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: "easeInOut" },
                  },
                }}
              >
                <SalonCard
                  id={salon.id}
                  name={salon.name}
                  location={salon.location}
                  specialty={salon.specialty}
                  rating={salon.rating}
                  reviewCount={salon.reviewCount}
                  priceRange={salon.priceRange}
                  coverImage={salon.coverImage}
                  verified={salon.verified}
                  slug={salon.slug}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
