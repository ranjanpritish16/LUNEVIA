import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { SalonCard } from "@/components/ui/SalonCard";

export async function FeaturedArtistsSection() {
  const { data: featuredSalons } = await supabase
    .from("salons")
    .select("*")
    .eq("is_published", true)
    .order("rating", { ascending: false })
    .limit(4);

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
          {featuredSalons?.map((salon) => (
            <div
              key={salon.id}
              className="w-[min(100%,320px)] shrink-0 snap-start"
            >
              <SalonCard
                id={salon.id}
                name={salon.name}
                location={salon.location}
                specialty={salon.specialty || []}
                rating={salon.rating || 0}
                reviewCount={salon.review_count || 0}
                priceRange={salon.price_range || "₹₹"}
                coverImage={salon.cover_image || "https://images.unsplash.com/photo-1595476108010-b4d1f10d5e43?q=80&w=600&auto=format&fit=crop"}
                verified={salon.verified}
                slug={salon.slug}
                mapUrl={salon.map_url}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
