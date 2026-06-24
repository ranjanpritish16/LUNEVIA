import { cn } from "@/lib/utils";
import type { Campaign } from "@/lib/types/campaign";

interface PromotionBadgeProps {
    campaign: Pick<Campaign, "offer_type" | "discount_value">;
    className?: string;
}

export function PromotionBadge({ campaign, className }: PromotionBadgeProps) {
    const label =
        campaign.offer_type === "percentage_discount"
            ? `${campaign.discount_value}% OFF`
            : campaign.offer_type === "flat_discount"
                ? `₹${campaign.discount_value} OFF`
                : campaign.offer_type === "free_addon"
                    ? "FREE ADD-ON"
                    : "COMBO DEAL";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
                "bg-rose text-cream font-dm-sans text-xs font-semibold leading-none shadow-sm",
                className
            )}
        >
            {label}
        </span>
    );
}