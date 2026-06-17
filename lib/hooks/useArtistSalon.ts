"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// Matches the salons table schema from context.md + artist-side additions
export interface ArtistSalon {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  specialty: string[] | null;
  price_range: string | null;
  rating: number | null;
  review_count: number | null;
  verified: boolean;
  cover_image: string | null;
  gallery_images: string[] | null;
  services: Record<string, unknown>[] | null;
  team: { name: string; role: string }[] | null;
  contact: Record<string, string> | null;
  owner_id: string;
  working_hours: Record<string, unknown> | null;
  blocked_dates: string[] | null;
  is_published: boolean;
  created_at: string;
}

interface UseArtistSalonReturn {
  salon: ArtistSalon | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useArtistSalon(): UseArtistSalonReturn {
  const [salon, setSalon] = useState<ArtistSalon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalon = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Not authenticated");
        setSalon(null);
        return;
      }

      const { data, error: salonError } = await supabase
        .from("salons")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (salonError) {
        // PGRST116 = no rows found — not an error, just no salon yet
        if (salonError.code === "PGRST116") {
          setSalon(null);
        } else {
          setError(salonError.message);
        }
        return;
      }

      setSalon(data as ArtistSalon);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSalon();
  }, [fetchSalon]);

  return { salon, isLoading, error, refetch: fetchSalon };
}
