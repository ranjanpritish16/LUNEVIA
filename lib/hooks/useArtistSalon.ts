"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface RecentBooking {
  id: string;
  customer_name: string | null;
  service_id: string | null;
  date: string | null;
  status: string | null;
}

export interface ArtistSalon {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  locality: string | null;
  specialty: string[] | null;
  price_range: string | null;
  rating: number | null;
  review_count: number | null;
  verified: boolean | null;
  cover_image: string | null;
  gallery_images: string[] | null;
  services: any[] | null;
  team: any[] | null;
  contact: Record<string, any> | null;
  working_hours: Record<string, any> | null;
  blocked_dates: string[] | null;
  is_published: boolean | null;
  created_at: string;
  // Derived/aggregated fields, not real columns on `salons`
  pending_bookings_count: number;
  monthly_bookings_count: number;
  recent_bookings: RecentBooking[];
}

export function useArtistSalon() {
  const [salon, setSalon] = useState<ArtistSalon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSalon = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSalon(null);
      setIsLoading(false);
      return;
    }

    const { data: salonRow, error: salonError } = await supabase
      .from("salons")
      .select("*")
      .eq("owner_id", user.id)
      .maybeSingle();

    if (salonError || !salonRow) {
      setSalon(null);
      setIsLoading(false);
      if (salonError) setError(salonError.message);
      return;
    }

    // Start of current calendar month, for the "this month" stat
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const [pendingRes, monthlyRes, recentRes] = await Promise.all([
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("salon_id", salonRow.id)
        .eq("status", "pending"),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("salon_id", salonRow.id)
        .gte("date", monthStart),
      supabase
        .from("bookings")
        .select("id, customer_name, service_id, date, status")
        .eq("salon_id", salonRow.id)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    setSalon({
      ...salonRow,
      pending_bookings_count: pendingRes.count ?? 0,
      monthly_bookings_count: monthlyRes.count ?? 0,
      recent_bookings: recentRes.data ?? [],
    });
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchSalon();
  }, [fetchSalon]);

  return { salon, isLoading, error, refetch: fetchSalon };
}