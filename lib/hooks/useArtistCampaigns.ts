"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";
import type { Campaign, CampaignForm } from "@/lib/types/campaign";

export function useArtistCampaigns() {
    const { salon } = useArtistSalon();
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCampaigns = useCallback(async () => {
        if (!salon) {
            setCampaigns([]);
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
            .from("artist_campaigns")
            .select("*")
            .eq("salon_id", salon.id)
            .order("created_at", { ascending: false });

        if (fetchError) {
            setError(fetchError.message);
            setCampaigns([]);
        } else {
            setCampaigns(data ?? []);
        }
        setIsLoading(false);
    }, [salon]);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    async function createCampaign(form: CampaignForm) {
        if (!salon) return { error: "No salon found" };

        const { error: insertError } = await supabase.from("artist_campaigns").insert({
            salon_id: salon.id,
            title: form.title.trim(),
            description: form.description.trim(),
            offer_type: form.offer_type,
            discount_value: Number(form.discount_value) || 0,
            applicable_services: form.applicable_services,
            start_date: form.start_date,
            end_date: form.end_date,
            is_active: true,
        });

        if (!insertError) await fetchCampaigns();
        return { error: insertError?.message ?? null };
    }

    async function updateCampaign(id: string, updates: Partial<CampaignForm>) {
        const payload: Record<string, any> = { ...updates };
        if (updates.discount_value !== undefined) {
            payload.discount_value = Number(updates.discount_value) || 0;
        }

        const { error: updateError } = await supabase
            .from("artist_campaigns")
            .update(payload)
            .eq("id", id);

        if (!updateError) await fetchCampaigns();
        return { error: updateError?.message ?? null };
    }

    async function toggleActive(id: string, isActive: boolean) {
        const { error: toggleError } = await supabase
            .from("artist_campaigns")
            .update({ is_active: isActive })
            .eq("id", id);

        if (!toggleError) await fetchCampaigns();
        return { error: toggleError?.message ?? null };
    }

    async function deleteCampaign(id: string) {
        const { error: deleteError } = await supabase
            .from("artist_campaigns")
            .delete()
            .eq("id", id);

        if (!deleteError) await fetchCampaigns();
        return { error: deleteError?.message ?? null };
    }

    return {
        campaigns,
        isLoading,
        error,
        refetch: fetchCampaigns,
        createCampaign,
        updateCampaign,
        toggleActive,
        deleteCampaign,
    };
}