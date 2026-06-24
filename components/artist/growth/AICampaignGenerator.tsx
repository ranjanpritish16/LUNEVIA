"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { AICampaignResponse, CampaignForm } from "@/lib/types/campaign";
import { OFFER_TYPE_LABELS } from "@/lib/types/campaign";
import type { ArtistSalon } from "@/lib/hooks/useArtistSalon";

interface AICampaignGeneratorProps {
    salon: ArtistSalon;
    onSave: (form: CampaignForm) => Promise<{ error: string | null }>;
}

export function AICampaignGenerator({ salon, onSave }: AICampaignGeneratorProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [result, setResult] = useState<AICampaignResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleGenerate() {
        setIsGenerating(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch("/api/ai/campaign-generator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    salonData: {
                        salonName: salon.name,
                        specialties: salon.specialty ?? [],
                        averageRating: salon.rating ?? 0,
                        priceRange: salon.price_range ?? "",
                        services: (salon.services ?? []).map((s: any) => ({
                            name: s.name,
                            price: s.price,
                            category: s.category,
                        })),
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Failed to generate campaign.");
                return;
            }
            setResult(data as AICampaignResponse);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    }

    async function handleSave() {
        if (!result) return;
        setIsSaving(true);

        const today = new Date();
        const endDate = new Date(today);
        endDate.setDate(endDate.getDate() + 30); // default 30-day window; editable afterward

        const form: CampaignForm = {
            title: result.campaignName,
            description: result.description,
            offer_type: result.offerType,
            discount_value: result.discountValue.replace(/[^\d.]/g, "") || "0",
            applicable_services: (salon.services ?? []).map((s: any) => s.id),
            start_date: today.toISOString().slice(0, 10),
            end_date: endDate.toISOString().slice(0, 10),
        };

        const { error: saveError } = await onSave(form);
        setIsSaving(false);
        if (!saveError) setResult(null);
        else setError(saveError);
    }

    return (
        <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-warm">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="font-cormorant text-xl text-primary">AI Campaign Generator</h2>
                    <p className="font-dm-sans text-sm text-charcoal/60 mt-1">
                        Let AI craft a campaign from your salon's profile, services, and reputation.
                    </p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="rounded-full bg-primary px-6 py-2 font-dm-sans text-sm font-medium text-cream hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isGenerating ? "Generating..." : "Generate Campaign With AI"}
                </button>
            </div>

            {error && <p className="text-red-500 text-xs font-dm-sans mt-4">{error}</p>}

            {result && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="mt-6 rounded-2xl border border-gold/30 bg-blush p-6"
                >
                    <h3 className="font-cormorant text-2xl text-primary">{result.campaignName}</h3>
                    <p className="font-dm-sans text-xs uppercase tracking-widest text-gold mt-1">
                        {OFFER_TYPE_LABELS[result.offerType]} · {result.discountValue}
                    </p>
                    <p className="font-dm-sans text-sm text-charcoal mt-4">{result.description}</p>

                    <div className="grid gap-4 mt-5 sm:grid-cols-2">
                        <div>
                            <p className="font-dm-sans text-[10px] uppercase tracking-widest text-charcoal/50">
                                Target Audience
                            </p>
                            <p className="font-dm-sans text-sm text-charcoal mt-1">{result.targetAudience}</p>
                        </div>
                        <div>
                            <p className="font-dm-sans text-[10px] uppercase tracking-widest text-charcoal/50">
                                Expected Impact
                            </p>
                            <p className="font-dm-sans text-sm text-charcoal mt-1">{result.expectedIncrease}</p>
                        </div>
                    </div>

                    <div className="mt-5 rounded-xl bg-white p-4">
                        <p className="font-dm-sans text-[10px] uppercase tracking-widest text-rose">
                            Instagram Caption
                        </p>
                        <p className="font-dm-sans text-sm text-charcoal mt-1 whitespace-pre-wrap">
                            {result.instagramCaption}
                        </p>
                    </div>

                    <div className="mt-3 rounded-xl bg-white p-4">
                        <p className="font-dm-sans text-[10px] uppercase tracking-widest text-rose">
                            WhatsApp Promotion Text
                        </p>
                        <p className="font-dm-sans text-sm text-charcoal mt-1 whitespace-pre-wrap">
                            {result.whatsappText}
                        </p>
                    </div>

                    <div className="flex items-center justify-end gap-3 mt-6">
                        <button
                            onClick={() => setResult(null)}
                            className="text-charcoal/60 font-dm-sans text-xs hover:text-charcoal transition-colors"
                        >
                            Discard
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="rounded-full bg-gold px-6 py-2 font-dm-sans text-sm font-medium text-white hover:bg-gold/90 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Campaign"}
                        </button>
                    </div>
                </motion.div>
            )}
        </div>
    );
}