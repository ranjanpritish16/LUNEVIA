"use client";

import { useState } from "react";
import { TrendingUp, Plus } from "lucide-react";
import { useArtistSalon } from "@/lib/hooks/useArtistSalon";
import { useArtistCampaigns } from "@/lib/hooks/useArtistCampaigns";
import { useCampaignAnalytics } from "@/lib/hooks/useCampaignAnalytics";
import { GrowthOverview } from "@/components/artist/growth/GrowthOverview";
import { CampaignList } from "@/components/artist/growth/CampaignList";
import { CreateCampaignModal } from "@/components/artist/growth/CreateCampaignModal";
import { AICampaignGenerator } from "@/components/artist/growth/AICampaignGenerator";
import type { Campaign } from "@/lib/types/campaign";

export default function GrowthStudioPage() {
    const { salon, isLoading: isSalonLoading } = useArtistSalon();
    const {
        campaigns,
        isLoading: isCampaignsLoading,
        createCampaign,
        updateCampaign,
        toggleActive,
        deleteCampaign,
    } = useArtistCampaigns();
    const analytics = useCampaignAnalytics(campaigns);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

    const services = (salon?.services ?? []).map((s: any) => ({ id: s.id, name: s.name }));

    function openCreate() {
        setEditingCampaign(null);
        setIsModalOpen(true);
    }

    function openEdit(campaign: Campaign) {
        setEditingCampaign(campaign);
        setIsModalOpen(true);
    }

    if (isSalonLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center bg-cream">
                <div className="flex flex-col items-center gap-4">
                    <span className="font-cormorant text-2xl font-semibold text-gold">
                        LUNÉVIA
                    </span>
                    <div className="h-1 w-24 overflow-hidden rounded-full bg-gold/20">
                        <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gold/60" />
                    </div>
                </div>
            </div>
        );
    }

    if (!salon) {
        return (
            <div className="p-6">
                <div className="rounded-2xl border border-gold/20 bg-white p-8 text-center shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
                    <p className="font-dm-sans text-sm text-charcoal/70">
                        Complete your salon profile before using Growth Studio.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6">
            {/* Header */}
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-gold" />
                        <span className="font-dm-sans text-xs font-medium uppercase tracking-wider text-gold">
                            Growth Studio
                        </span>
                    </div>
                    <h1 className="mt-1 font-cormorant text-3xl text-primary md:text-4xl">
                        Marketing & Campaigns
                    </h1>
                    <p className="mt-1 font-dm-sans text-sm text-charcoal/60">
                        Create offers, track performance, and grow your bookings.
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-1.5 rounded-full bg-gold px-6 py-2.5 font-dm-sans text-sm font-medium text-white shadow-[0_4px_24px_rgba(201,147,58,0.08)] transition-colors hover:bg-gold/90"
                >
                    <Plus size={16} />
                    New Campaign
                </button>
            </div>

            {/* Overview / stat cards */}
            <GrowthOverview analytics={analytics} />

            {/* Campaigns */}
            <section className="rounded-2xl border border-gold/20 bg-white p-6 shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="font-cormorant text-2xl text-primary">Your Campaigns</h2>
                    {!isCampaignsLoading && campaigns.length > 0 && (
                        <span className="font-dm-sans text-xs text-charcoal/50">
                            {campaigns.length} total
                        </span>
                    )}
                </div>

                {isCampaignsLoading ? (
                    <div className="flex flex-col items-center gap-3 py-10">
                        <div className="h-1 w-20 overflow-hidden rounded-full bg-gold/20">
                            <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gold/60" />
                        </div>
                        <p className="font-dm-sans text-sm text-charcoal/50">
                            Loading campaigns...
                        </p>
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gold/30 bg-blush/30 py-10 text-center">
                        <p className="font-dm-sans text-sm text-charcoal/60">
                            No campaigns yet. Create one above or let AI craft one for you below.
                        </p>
                    </div>
                ) : (
                    <CampaignList
                        campaigns={campaigns}
                        onEdit={openEdit}
                        onToggleActive={toggleActive}
                        onDelete={deleteCampaign}
                    />
                )}
            </section>

            {/* AI Generator */}
            <section className="rounded-2xl border border-gold/20 bg-white p-6 shadow-[0_4px_24px_rgba(201,147,58,0.08)]">
                <AICampaignGenerator salon={salon} onSave={createCampaign} />
            </section>

            <CreateCampaignModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                services={services}
                editingCampaign={editingCampaign}
                onCreate={createCampaign}
                onUpdate={updateCampaign}
            />
        </div>
    );
}