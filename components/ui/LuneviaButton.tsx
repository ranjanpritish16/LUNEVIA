"use client";

import { motion, type HTMLMotionProps } from "framer-motion";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "dark";
type ButtonSize = "sm" | "md" | "lg";

interface LuneviaButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-gold text-primary hover:bg-gold/90",
  ghost:
    "border border-gold bg-transparent text-gold hover:bg-gold/10",
  dark: "bg-primary text-cream hover:bg-primary/90",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function LuneviaButton({
  variant = "primary",
  size = "md",
  className,
  children,
  disabled,
  ...props
}: LuneviaButtonProps) {
  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center rounded-full font-dm-sans font-medium",
        "transition-colors duration-[400ms] ease-in-out",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
        "disabled:pointer-events-none disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
}
