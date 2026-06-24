"use client";

import { motion } from "framer-motion";
import type { CampaignAnalytics } from "@/lib/types/campaign";

interface GrowthOverviewProps {
    analytics: CampaignAnalytics;
}

const cards = [
    { key: "activeCampaigns", label: "Active Campaigns", format: (v: number) => v.toString() },
    { key: "totalViews", label: "Total Views", format: (v: number) => v.toLocaleString() },
    { key: "totalClicks", label: "Total Clicks", format: (v: number) => v.toLocaleString() },
    { key: "totalBookings", label: "Total Bookings", format: (v: number) => v.toLocaleString() },
    { key: "averageConversionRate", label: "Avg. Conversion Rate", format: (v: number) => `${v}%` },
] as const;

export function GrowthOverview({ analytics }: GrowthOverviewProps) {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cards.map((card, i) => (
                <motion.div
                    key={card.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.08, ease: "easeInOut" }}
                    className="rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_4px_24px_rgba(201,147,58,0.08)] transition-shadow hover:shadow-[0_6px_28px_rgba(201,147,58,0.12)]"
                >
                    <p className="font-dm-sans text-xs uppercase tracking-widest text-charcoal/60">
                        {card.label}
                    </p>
                    <p className="font-cormorant text-3xl text-primary mt-2">
                        {card.format(analytics[card.key])}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}