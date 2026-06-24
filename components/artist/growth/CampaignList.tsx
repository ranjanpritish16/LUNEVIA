"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Campaign } from "@/lib/types/campaign";
import { OFFER_TYPE_LABELS, conversionRate } from "@/lib/types/campaign";

interface CampaignListProps {
    campaigns: Campaign[];
    onEdit: (campaign: Campaign) => void;
    onToggleActive: (id: string, isActive: boolean) => Promise<{ error: string | null }>;
    onDelete: (id: string) => Promise<{ error: string | null }>;
}

export function CampaignList({ campaigns, onEdit, onToggleActive, onDelete }: CampaignListProps) {
    const [busyId, setBusyId] = useState<string | null>(null);

    async function handleToggle(c: Campaign) {
        setBusyId(c.id);
        await onToggleActive(c.id, !c.is_active);
        setBusyId(null);
    }

    async function handleDelete(c: Campaign) {
        if (!confirm(`Delete campaign "${c.title}"? This cannot be undone.`)) return;
        setBusyId(c.id);
        await onDelete(c.id);
        setBusyId(null);
    }

    if (campaigns.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gold/30 bg-blush/30 py-10 text-center">
                <p className="font-dm-sans text-sm text-charcoal/60">
                    No campaigns yet. Create one above, or generate one with AI below.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {campaigns.map((c, i) => {
                const rate = conversionRate(c.clicks, c.bookings);
                const isExpired = new Date(c.end_date) < new Date();

                return (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08, ease: "easeInOut" }}
                        className="rounded-2xl border border-gold/20 bg-white p-5 shadow-[0_4px_24px_rgba(201,147,58,0.08)] transition-shadow hover:shadow-[0_6px_28px_rgba(201,147,58,0.12)]"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-cormorant text-lg font-semibold text-primary">{c.title}</h3>
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-dm-sans uppercase tracking-widest ${c.is_active && !isExpired
                                            ? "bg-gold/20 text-gold"
                                            : "bg-charcoal/10 text-charcoal/60"
                                            }`}
                                    >
                                        {isExpired ? "Expired" : c.is_active ? "Active" : "Paused"}
                                    </span>
                                </div>
                                <p className="font-dm-sans text-sm text-charcoal/70 mt-1">
                                    {OFFER_TYPE_LABELS[c.offer_type]} · {c.discount_value}
                                    {c.offer_type === "percentage_discount" ? "%" : ""}
                                    {" · "}Valid until{" "}
                                    {new Date(c.end_date).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onEdit(c)}
                                    className="text-gold font-dm-sans text-xs font-medium hover:text-gold/80 transition-colors"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleToggle(c)}
                                    disabled={busyId === c.id || isExpired}
                                    className="text-charcoal font-dm-sans text-xs font-medium hover:text-primary transition-colors disabled:opacity-50"
                                >
                                    {c.is_active ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                    onClick={() => handleDelete(c)}
                                    disabled={busyId === c.id}
                                    className="text-red-400 font-dm-sans text-xs hover:text-red-600 transition-colors disabled:opacity-50"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-4 gap-3 border-t border-gold/10 pt-4">
                            {[
                                { label: "Views", value: c.views },
                                { label: "Clicks", value: c.clicks },
                                { label: "Bookings", value: c.bookings },
                                { label: "Conv. Rate", value: `${rate}%` },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="font-dm-sans text-[10px] uppercase tracking-widest text-charcoal/50">
                                        {stat.label}
                                    </p>
                                    <p className="font-cormorant text-xl text-primary">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}