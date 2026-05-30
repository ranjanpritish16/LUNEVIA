"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export type PriceRange = "₹" | "₹₹" | "₹₹₹";

export interface SalonCardProps {
  id: string;
  name: string;
  location: string;
  specialty: string[];
  rating: number;
  reviewCount: number;
  priceRange: PriceRange;
  coverImage: string;
  verified: boolean;
  slug: string;
  className?: string;
}

export function SalonCard({
  name,
  location,
  specialty,
  rating,
  reviewCount,
  priceRange,
  coverImage,
  verified,
  slug,
  className,
}: SalonCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gold/20",
        "bg-cream shadow-warm transition-shadow duration-[400ms] ease-in-out",
        "hover:shadow-[0_8px_32px_rgba(201,147,58,0.16)]",
        className
      )}
    >
      <Link href={`/salon/${slug}`} className="block">
        <div className="relative aspect-[3/2] overflow-hidden">
          <Image
            src={coverImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-[400ms] ease-in-out group-hover:scale-[1.02]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent"
            aria-hidden="true"
          />
          {verified && (
            <div className="absolute right-3 top-3">
              <Badge variant="verified">Verified</Badge>
            </div>
          )}
        </div>

        <div className="space-y-3 p-4">
          <div className="flex flex-wrap gap-1.5">
            {specialty.slice(0, 3).map((item) => (
              <Badge key={item} variant="rose">
                {item}
              </Badge>
            ))}
          </div>

          <div>
            <h3 className="font-cormorant text-2xl text-primary">{name}</h3>
            <p className="mt-0.5 font-dm-sans text-sm text-charcoal">
              {location}
            </p>
          </div>

          <div className="flex items-center justify-between font-dm-sans text-sm text-charcoal">
            <div className="flex items-center gap-1">
              <span className="text-gold" aria-hidden="true">
                ★
              </span>
              <span className="font-medium text-primary">{rating.toFixed(1)}</span>
              <span className="text-charcoal/70">({reviewCount})</span>
            </div>
            <span className="font-medium tracking-wide text-gold">
              {priceRange}
            </span>
          </div>

          <div className="opacity-0 transition-opacity duration-[400ms] ease-in-out group-hover:opacity-100">
            <span
              className={cn(
                "inline-flex w-full items-center justify-center rounded-full",
                "border border-gold bg-transparent px-3 py-1.5",
                "font-dm-sans text-xs font-medium text-gold"
              )}
            >
              View Profile
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
