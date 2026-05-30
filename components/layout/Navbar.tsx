"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { LuneviaButton } from "@/components/ui/LuneviaButton";
import { useScrollY } from "@/hooks/useScrollY";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/explore", label: "Explore" },
  { href: "/concierge", label: "AI Match" },
  { href: "/#how-it-works", label: "How it Works" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 12h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}

function UserAvatar() {
  return (
    <Link
      href="/profile"
      aria-label="Sign in"
      className="flex h-9 w-9 items-center justify-center rounded-full border border-gold/30 bg-blush text-gold transition-colors duration-[400ms] ease-in-out hover:border-gold/60 hover:bg-blush/80"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M5 20c0-3.866 3.134-7 7-7s7 3.134 7 7" />
      </svg>
    </Link>
  );
}

export function Navbar() {
  const { scrolled } = useScrollY(50);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-[400ms] ease-in-out",
        scrolled
          ? "border-b border-gold/10 bg-cream/95 shadow-warm backdrop-blur-md"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
        <Link
          href="/"
          className="font-cormorant text-2xl font-semibold tracking-wide text-gold"
        >
          LUNÉVIA
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="font-dm-sans text-sm text-charcoal transition-colors duration-[400ms] ease-in-out hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <LuneviaButton size="sm">Book Now</LuneviaButton>
          <UserAvatar />
        </div>

        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((prev) => !prev)}
          className="flex h-11 w-11 items-center justify-center rounded-full text-charcoal transition-colors duration-[400ms] ease-in-out hover:bg-blush md:hidden"
        >
          <MenuIcon open={mobileOpen} />
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden border-t border-gold/10 bg-cream md:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-xl px-3 py-3 font-dm-sans text-sm text-charcoal transition-colors duration-[400ms] ease-in-out hover:bg-blush hover:text-gold"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-3">
                <LuneviaButton size="sm" className="flex-1">
                  Book Now
                </LuneviaButton>
                <UserAvatar />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
