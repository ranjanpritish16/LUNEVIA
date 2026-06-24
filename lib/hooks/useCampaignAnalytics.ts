"use client";

import { useMemo } from "react";
import type { Campaign, CampaignAnalytics } from "@/lib/types/campaign";
import { conversionRate } from "@/lib/types/campaign";

export function useCampaignAnalytics(campaigns: Campaign[]): CampaignAnalytics {
    return useMemo(() => {
        const activeCampaigns = campaigns.filter((c) => c.is_active).length;
        const totalViews = campaigns.reduce((sum, c) => sum + (c.views || 0), 0);
        const totalClicks = campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0);
        const totalBookings = campaigns.reduce((sum, c) => sum + (c.bookings || 0), 0);
        const averageConversionRate = conversionRate(totalClicks, totalBookings);

        return { activeCampaigns, totalViews, totalClicks, totalBookings, averageConversionRate };
    }, [campaigns]);
}