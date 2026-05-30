import Link from "next/link";

import { SalonCard } from "@/components/ui/SalonCard";
import { getAllSalons } from "@/lib/data/salons";

const featuredSalons = getAllSalons().slice(0, 4);

export function FeaturedArtistsSection() {
  return (
    <section className="bg-blush py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="font-cormorant text-5xl text-primary">
            Featured Artists
          </h2>
          <Link
            href="/explore"
            className="font-dm-sans text-sm text-gold transition-colors duration-[400ms] ease-in-out hover:text-gold/80"
          >
            Browse All Artists →
          </Link>
        </div>

        <div className="-mx-4 flex gap-6 overflow-x-auto px-4 pb-4 snap-x snap-mandatory scrollbar-hide md:mx-0 md:px-0">
          {featuredSalons.map((salon) => (
            <div
              key={salon.id}
              className="w-[min(100%,320px)] shrink-0 snap-start"
            >
              <SalonCard {...salon} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
