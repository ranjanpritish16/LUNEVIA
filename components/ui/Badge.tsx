import { cn } from "@/lib/utils";

type BadgeVariant = "gold" | "rose" | "blush" | "verified";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  gold: "bg-gold text-primary",
  rose: "bg-rose text-cream",
  blush: "bg-blush text-charcoal",
  verified: "bg-gold text-primary",
};

export function Badge({
  variant = "gold",
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5",
        "font-dm-sans text-xs font-medium leading-none",
        variantStyles[variant],
        className
      )}
    >
      {variant === "verified" && (
        <span aria-hidden="true" className="text-[10px]">
          ✓
        </span>
      )}
      {children}
    </span>
  );
}
