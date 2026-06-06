"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react"; // Wait, I should use lucide-react or custom SVG. Let's use custom SVG to avoid dependency issues if lucide-react isn't installed.

import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

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
  id,
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
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function checkSavedStatus() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('saved_salons')
        .eq('id', session.user.id)
        .single();
        
      if (data && data.saved_salons?.includes(id)) {
        setIsSaved(true);
      }
    }
    checkSavedStatus();
  }, [id]);

  const router = useRouter();

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('saved_salons')
        .eq('id', session.user.id)
        .single();
        
      let currentSaved = profile?.saved_salons || [];
      
      if (isSaved) {
        currentSaved = currentSaved.filter((salonId: string) => salonId !== id);
      } else {
        currentSaved = [...currentSaved, id];
      }
      
      await supabase
        .from('profiles')
        .update({ saved_salons: currentSaved })
        .eq('id', session.user.id);
        
      setIsSaved(!isSaved);
    } catch (error) {
      console.error("Error saving salon:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
          
          <div className="absolute left-3 top-3 z-10">
            <button
              onClick={toggleSave}
              disabled={isLoading}
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300",
                isSaved ? "bg-rose/90 text-cream" : "bg-charcoal/30 text-cream hover:bg-rose/80"
              )}
              aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

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
