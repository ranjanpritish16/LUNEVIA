"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";

// Gold ornamental divider reused from existing login pages
function OrnamentalDivider({ opacity = 0.5 }: { opacity?: number }) {
  return (
    <svg width="48" height="12" viewBox="0 0 120 24" fill="none" className="mx-auto" aria-hidden="true">
      <line x1="0" y1="12" x2="42" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity={opacity * 0.6} />
      <circle cx="52" cy="12" r="3" fill="#C9933A" fillOpacity={opacity * 0.8} />
      <circle cx="60" cy="12" r="5" fill="none" stroke="#C9933A" strokeWidth="1" strokeOpacity={opacity} />
      <circle cx="68" cy="12" r="3" fill="#C9933A" fillOpacity={opacity * 0.8} />
      <line x1="78" y1="12" x2="120" y2="12" stroke="#C9933A" strokeWidth="0.75" strokeOpacity={opacity * 0.6} />
    </svg>
  );
}

// Sparkle icon for the Bride card
function SparkleIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
      aria-hidden="true"
    >
      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3z" />
      <path d="M5 3l0.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75L5 3z" opacity="0.5" />
      <path d="M19 15l0.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75L19 15z" opacity="0.5" />
    </svg>
  );
}

// Palette/wand icon for the Artist card
function ArtistIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gold"
      aria-hidden="true"
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      <path d="M15 5l3 3" />
      <circle cx="6" cy="6" r="1.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="18" cy="18" r="1" fill="currentColor" fillOpacity="0.3" />
    </svg>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut", delay: i * 0.08 },
  }),
};

interface RoleCardProps {
  index: number;
  icon: React.ReactNode;
  heading: string;
  subtext: string;
  href: string;
}

function RoleCard({ index, icon, heading, subtext, href }: RoleCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const handleClick = () => {
    // Forward ?next param to the customer route so AuthGuard redirects still work
    const target = next ? `${href}?next=${encodeURIComponent(next)}` : href;
    router.push(target);
  };

  return (
    <motion.button
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={handleClick}
      className="group flex w-full flex-col items-center rounded-3xl border border-gold/20 bg-blush/60 px-8 py-10 text-center shadow-[0_4px_24px_rgba(201,147,58,0.08)] backdrop-blur-sm transition-all duration-300 hover:border-gold/40 hover:shadow-[0_8px_40px_rgba(201,147,58,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cream sm:max-w-[320px]"
      aria-label={heading}
    >
      {/* Icon circle */}
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-gold/25 bg-cream/80 shadow-[0_2px_12px_rgba(201,147,58,0.12)] transition-all duration-300 group-hover:border-gold/50 group-hover:shadow-[0_4px_20px_rgba(201,147,58,0.2)]">
        {icon}
      </div>

      {/* Heading */}
      <h2 className="mb-2 font-cormorant text-2xl font-semibold text-primary">
        {heading}
      </h2>

      {/* Subtext */}
      <p className="font-dm-sans text-sm leading-relaxed text-charcoal/60">
        {subtext}
      </p>

      {/* Subtle arrow hint */}
      <div className="mt-5 flex items-center gap-1.5 font-dm-sans text-xs font-medium text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        Continue
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </motion.button>
  );
}

function LoginGatewayContent() {
  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-cream px-4 py-16">
      {/* Decorative glow blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-gold/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-rose/10 blur-[120px]" />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-blush/40 blur-[100px]" />

      {/* Back link */}
      <Link
        href="/"
        className="absolute left-6 top-6 flex items-center gap-2 font-dm-sans text-sm text-charcoal/60 transition-colors hover:text-gold"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to LUNÉVIA
      </Link>

      {/* Content container */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
        {/* Top ornamental divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-6"
        >
          <OrnamentalDivider opacity={0.7} />
        </motion.div>

        {/* LUNÉVIA wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-2"
        >
          <Link href="/" className="font-cormorant text-4xl font-semibold tracking-wide text-gold">
            LUNÉVIA
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.06 }}
          className="mb-3 text-center font-cormorant text-3xl font-semibold text-primary"
        >
          Welcome to LUNÉVIA
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
          className="mb-10 text-center font-dm-sans text-sm text-charcoal/60"
        >
          Tell us who you are, and we&apos;ll take you there.
        </motion.p>

        {/* Role selection cards */}
        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <RoleCard
            index={0}
            icon={<SparkleIcon />}
            heading="I'm a Bride"
            subtext="Discover and book Delhi's finest bridal artists"
            href="/login/customer"
          />
          <RoleCard
            index={1}
            icon={<ArtistIcon />}
            heading="I'm an Artist"
            subtext="Showcase your work and manage bookings"
            href="/artist/login"
          />
        </div>

        {/* Bottom ornamental divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
          className="mt-12"
        >
          <OrnamentalDivider opacity={0.4} />
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.4 }}
          className="mt-4 font-dm-sans text-xs text-charcoal/40"
        >
          &copy; 2026 LUNÉVIA · Delhi&apos;s most trusted bridal beauty platform
        </motion.p>
      </div>
    </div>
  );
}

export default function LoginGatewayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <LoginGatewayContent />
    </Suspense>
  );
}