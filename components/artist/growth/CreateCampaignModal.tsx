"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Campaign, CampaignForm, CampaignOfferType } from "@/lib/types/campaign";

interface ServiceOption {
    id: string;
    name: string;
}

interface CreateCampaignModalProps {
    isOpen: boolean;
    onClose: () => void;
    services: ServiceOption[];
    editingCampaign?: Campaign | null;
    onCreate: (form: CampaignForm) => Promise<{ error: string | null }>;
    onUpdate: (id: string, form: Partial<CampaignForm>) => Promise<{ error: string | null }>;
}

const emptyForm: CampaignForm = {
    title: "",
    description: "",
    offer_type: "percentage_discount",
    discount_value: "",
    applicable_services: [],
    start_date: "",
    end_date: "",
};

export function CreateCampaignModal({
    isOpen,
    onClose,
    services,
    editingCampaign,
    onCreate,
    onUpdate,
}: CreateCampaignModalProps) {
    const [form, setForm] = useState<CampaignForm>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (editingCampaign) {
            setForm({
                title: editingCampaign.title,
                description: editingCampaign.description ?? "",
                offer_type: editingCampaign.offer_type,
                discount_value: String(editingCampaign.discount_value),
                applicable_services: editingCampaign.applicable_services ?? [],
                start_date: editingCampaign.start_date,
                end_date: editingCampaign.end_date,
            });
        } else {
            setForm(emptyForm);
        }
        setErrors({});
        setSubmitError(null);
    }, [editingCampaign, isOpen]);

    function validate(): boolean {
        const next: Record<string, string> = {};
        if (!form.title.trim()) next.title = "Campaign name is required";
        if (!form.discount_value || Number.isNaN(Number(form.discount_value)))
            next.discount_value = "Enter a valid discount value";
        if (!form.start_date) next.start_date = "Start date is required";
        if (!form.end_date) next.end_date = "End date is required";
        if (form.start_date && form.end_date && form.end_date < form.start_date)
            next.end_date = "End date must be after start date";
        if (form.applicable_services.length === 0)
            next.applicable_services = "Select at least one service";

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function toggleService(id: string) {
        setForm((f) => ({
            ...f,
            applicable_services: f.applicable_services.includes(id)
                ? f.applicable_services.filter((s) => s !== id)
                : [...f.applicable_services, id],
        }));
    }

    async function handleSubmit() {
        if (!validate()) return;
        setIsSaving(true);
        setSubmitError(null);

        const result = editingCampaign
            ? await onUpdate(editingCampaign.id, form)
            : await onCreate(form);

        setIsSaving(false);
        if (result.error) {
            setSubmitError(result.error);
            return;
        }
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-warm"
                    >
                        <h2 className="font-cormorant text-2xl text-primary mb-4">
                            {editingCampaign ? "Edit Campaign" : "Create Campaign"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <input
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    placeholder="Campaign name *"
                                    className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold"
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs font-dm-sans mt-1">{errors.title}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <select
                                    value={form.offer_type}
                                    onChange={(e) =>
                                        setForm({ ...form, offer_type: e.target.value as CampaignOfferType })
                                    }
                                    className="rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold"
                                >
                                    <option value="percentage_discount">Percentage Discount</option>
                                    <option value="flat_discount">Flat Discount</option>
                                    <option value="free_addon" disabled>Free Add-on (Coming Soon)</option>
                                    <option value="combo_package" disabled>Combo Package (Coming Soon)</option>
                                </select>
                                <div>
                                    <input
                                        value={form.discount_value}
                                        onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                                        placeholder={
                                            form.offer_type === "percentage_discount" ? "Discount % *" : "Discount value *"
                                        }
                                        className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold"
                                    />
                                    {errors.discount_value && (
                                        <p className="text-red-500 text-xs font-dm-sans mt-1">{errors.discount_value}</p>
                                    )}
                                </div>
                            </div>

                            <textarea
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Description"
                                rows={3}
                                className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold"
                            />

                            <div>
                                <p className="font-dm-sans text-xs text-charcoal/60 mb-2">Applicable Services *</p>
                                <div className="flex flex-wrap gap-2">
                                    {services.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => toggleService(s.id)}
                                            className={`rounded-full px-3 py-1 text-xs font-dm-sans transition-colors ${form.applicable_services.includes(s.id)
                                                ? "bg-gold text-white"
                                                : "bg-blush text-charcoal/70"
                                                }`}
                                        >
                                            {s.name}
                                        </button>
                                    ))}
                                </div>
                                {errors.applicable_services && (
                                    <p className="text-red-500 text-xs font-dm-sans mt-1">
                                        {errors.applicable_services}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="date"
                                        value={form.start_date}
                                        onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                                        className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold"
                                    />
                                    {errors.start_date && (
                                        <p className="text-red-500 text-xs font-dm-sans mt-1">{errors.start_date}</p>
                                    )}
                                </div>
                                <div>
                                    <input
                                        type="date"
                                        value={form.end_date}
                                        onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                                        className="w-full rounded-lg border border-gold/20 px-3 py-2 text-sm font-dm-sans focus:outline-none focus:border-gold"
                                    />
                                    {errors.end_date && (
                                        <p className="text-red-500 text-xs font-dm-sans mt-1">{errors.end_date}</p>
                                    )}
                                </div>
                            </div>

                            {submitError && <p className="text-red-500 text-xs font-dm-sans">{submitError}</p>}

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    onClick={onClose}
                                    className="text-charcoal/60 font-dm-sans text-xs hover:text-charcoal transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSaving}
                                    className="rounded-full bg-gold px-6 py-2 font-dm-sans text-sm font-medium text-white hover:bg-gold/90 transition-colors disabled:opacity-50"
                                >
                                    {isSaving ? "Saving..." : editingCampaign ? "Save Changes" : "Save Campaign"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}