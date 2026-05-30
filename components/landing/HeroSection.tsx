"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { OrnamentalDivider } from "@/components/landing/OrnamentalDivider";
import { LuneviaButton } from "@/components/ui/LuneviaButton";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="shrink-0 text-charcoal/50"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function HeroSection() {
  const router = useRouter();

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center bg-cream px-4 pb-16 pt-28 md:pt-32"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(201, 147, 58, 0.04) 0%, transparent 70%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0 }}
        >
          <OrnamentalDivider />
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-8 font-cormorant text-4xl leading-tight text-primary md:text-6xl"
        >
          Your most beautiful day,
          <br />
          <span className="text-gold">designed by AI.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 font-dm-sans text-lg text-charcoal opacity-80"
        >
          Delhi&apos;s most trusted bridal beauty platform
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 w-full max-w-2xl"
        >
          <form
            role="search"
            className="flex items-center gap-2 rounded-full border border-gold bg-white py-1.5 pl-4 pr-1.5 shadow-warm"
            onSubmit={(e) => e.preventDefault()}
          >
            <SearchIcon />
            <input
              type="search"
              placeholder="Find your perfect bridal artist..."
              className="min-w-0 flex-1 bg-transparent font-dm-sans text-sm text-primary placeholder:text-charcoal/40 focus:outline-none"
              aria-label="Search bridal artists"
            />
            <LuneviaButton type="submit" size="sm" className="shrink-0">
              Search
            </LuneviaButton>
          </form>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <LuneviaButton
            size="lg"
            onClick={() => router.push("/concierge")}
          >
            Meet LUNÉVIA Concierge
          </LuneviaButton>
          <LuneviaButton
            variant="ghost"
            size="lg"
            onClick={() => router.push("/explore")}
          >
            Browse Salons
          </LuneviaButton>
        </motion.div>
      </div>
    </section>
  );
}
