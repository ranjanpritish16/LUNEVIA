export type CampaignOfferType =
    | "percentage_discount"
    | "flat_discount"
    | "free_addon"
    | "combo_package";

export interface Campaign {
    id: string;
    salon_id: string;
    title: string;
    description: string | null;
    offer_type: CampaignOfferType;
    discount_value: number;
    applicable_services: string[]; // service ids from salon.services
    start_date: string; // ISO date
    end_date: string; // ISO date
    is_active: boolean;
    views: number;
    clicks: number;
    bookings: number;
    ai_generated: AICampaignResponse | null;
    created_at: string;
    updated_at: string;
}

export interface CampaignForm {
    title: string;
    description: string;
    offer_type: CampaignOfferType;
    discount_value: string; // controlled input as string, parsed on submit
    applicable_services: string[];
    start_date: string;
    end_date: string;
}

export interface CampaignAnalytics {
    activeCampaigns: number;
    totalViews: number;
    totalClicks: number;
    totalBookings: number;
    averageConversionRate: number; // percentage, 1 decimal
}

export interface AICampaignResponse {
    campaignName: string;
    offerType: CampaignOfferType;
    discountValue: string;
    targetAudience: string;
    description: string;
    instagramCaption: string;
    whatsappText: string;
    expectedIncrease: string;
}

export const OFFER_TYPE_LABELS: Record<CampaignOfferType, string> = {
    percentage_discount: "Percentage Discount",
    flat_discount: "Flat Discount",
    free_addon: "Free Add-on",
    combo_package: "Combo Package",
};

export function conversionRate(clicks: number, bookings: number): number {
    if (!clicks) return 0;
    return Math.round((bookings / clicks) * 1000) / 10;
}