import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/lib/types/campaign";

export async function fetchActiveCampaignsForSalon(salonId: string): Promise<Campaign[]> {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
        .from("artist_campaigns")
        .select("*")
        .eq("salon_id", salonId)
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("created_at", { ascending: false });
    return data ?? [];
}

export async function fetchFeaturedActiveCampaigns(
    limit = 6
): Promise<(Campaign & { salons: { name: string; slug: string } })[]> {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
        .from("artist_campaigns")
        .select("*, salons(name, slug)")
        .eq("is_active", true)
        .lte("start_date", today)
        .gte("end_date", today)
        .order("created_at", { ascending: false })
        .limit(limit);
    return (data as any) ?? [];
}

export async function incrementCampaignMetric(
    campaignId: string,
    metric: "views" | "clicks" | "bookings"
) {
    await supabase.rpc("increment_campaign_metric", { campaign_id: campaignId, metric });
}

export function applyCampaignDiscount(
    originalPrice: number,
    campaign: Pick<Campaign, "offer_type" | "discount_value">
): { finalPrice: number; discountAmount: number } {
    if (campaign.offer_type === "percentage_discount") {
        const discountAmount = Math.round((originalPrice * campaign.discount_value) / 100);
        return { finalPrice: Math.max(originalPrice - discountAmount, 0), discountAmount };
    }
    if (campaign.offer_type === "flat_discount") {
        const discountAmount = Math.min(campaign.discount_value, originalPrice);
        return { finalPrice: Math.max(originalPrice - discountAmount, 0), discountAmount };
    }
    return { finalPrice: originalPrice, discountAmount: 0 };
}