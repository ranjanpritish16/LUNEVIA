"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import {
  Home,
  User,
  List,
  Image,
  Calendar,
  Inbox,
  Star,
  LogOut,
  MoreHorizontal,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  mobileVisible?: boolean; // show in bottom tab bar
}

interface DashboardShellProps {
  children: React.ReactNode;
  pendingBookingsCount?: number;
  salonName?: string;
  isPublished?: boolean;
}

// Publish status pill
function StatusPill({ isPublished }: { isPublished?: boolean }) {
  if (isPublished === undefined) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-dm-sans text-xs font-medium",
        isPublished
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
          : "bg-gold/10 text-gold ring-1 ring-gold/30"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isPublished ? "bg-emerald-500" : "bg-gold"
        )}
      />
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

export function DashboardShell({
  children,
  pendingBookingsCount = 0,
  salonName,
  isPublished,
}: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      href: "/artist/dashboard",
      label: "Dashboard",
      icon: <Home size={18} />,
      mobileVisible: true,
    },
    {
      href: "/artist/dashboard/profile",
      label: "Profile",
      icon: <User size={18} />,
      mobileVisible: true,
    },
    {
      href: "/artist/dashboard/services",
      label: "Services",
      icon: <List size={18} />,
      mobileVisible: true,
    },
    {
      href: "/artist/dashboard/portfolio",
      label: "Portfolio",
      icon: <Image size={18} />,
      mobileVisible: false,
    },
    {
      href: "/artist/dashboard/availability",
      label: "Availability",
      icon: <Calendar size={18} />,
      mobileVisible: false,
    },
    {
      href: "/artist/dashboard/bookings",
      label: "Bookings",
      icon: (
        <span className="relative">
          <Inbox size={18} />
          {pendingBookingsCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-bold text-cream">
              {pendingBookingsCount > 9 ? "9+" : pendingBookingsCount}
            </span>
          )}
        </span>
      ),
      mobileVisible: true,
    },
    {
      href: "/artist/dashboard/reviews",
      label: "Reviews",
      icon: <Star size={18} />,
      mobileVisible: true,
    },
  ];

  const moreItems = navItems.filter((item) => !item.mobileVisible);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const isActive = (href: string) => {
    if (href === "/artist/dashboard") return pathname === "/artist/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-cream">
      {/* ── Desktop Sidebar ─────────────────────────── */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-gold/15 bg-cream/95 backdrop-blur-sm md:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-gold/10 px-6">
          <Link
            href="/artist/dashboard"
            className="font-cormorant text-xl font-semibold tracking-wide text-gold"
          >
            LUNÉVIA
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 font-dm-sans text-sm transition-all duration-200",
                  active
                    ? "bg-blush/40 text-gold"
                    : "text-charcoal/60 hover:bg-blush/20 hover:text-charcoal"
                )}
              >
                {/* Active indicator bar */}
                {active && (
                  <span className="absolute inset-y-0 left-0 w-[3px] rounded-r-full bg-gold" />
                )}
                <span
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    active ? "text-gold" : "text-charcoal/40 group-hover:text-charcoal/70"
                  )}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="border-t border-gold/10 p-3">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 font-dm-sans text-sm text-charcoal/50 transition-all hover:bg-rose/10 hover:text-rose"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main wrapper (offset for sidebar on desktop) ── */}
      <div className="flex flex-1 flex-col md:pl-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-gold/10 bg-cream/95 px-4 backdrop-blur-sm md:px-8">
          <div className="flex items-center gap-3">
            <span className="font-cormorant text-base font-semibold text-primary md:text-lg">
              {salonName ?? (
                <span className="text-charcoal/40">Complete your profile</span>
              )}
            </span>
            <StatusPill isPublished={isPublished} />
          </div>
          {/* Mobile logo */}
          <Link
            href="/artist/dashboard"
            className="font-cormorant text-lg font-semibold tracking-wide text-gold md:hidden"
          >
            LUNÉVIA
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 md:p-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>

      {/* ── Mobile bottom tab bar ───────────────────── */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-gold/15 bg-cream/98 backdrop-blur-md md:hidden">
        {navItems
          .filter((item) => item.mobileVisible)
          .map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-1.5 transition-colors",
                  active ? "text-gold" : "text-charcoal/40"
                )}
                aria-label={item.label}
              >
                <span className="relative flex-shrink-0">{item.icon}</span>
                <span className="font-dm-sans text-[9px] font-medium tracking-wider uppercase">
                  {item.label}
                </span>
              </Link>
            );
          })}

        {/* More overflow button */}
        <button
          onClick={() => setMoreOpen(true)}
          className="flex flex-col items-center gap-1 px-3 py-1.5 text-charcoal/40"
          aria-label="More"
        >
          <MoreHorizontal size={18} />
          <span className="font-dm-sans text-[9px] font-medium tracking-wider uppercase">
            More
          </span>
        </button>
      </nav>

      {/* Mobile "More" drawer */}
      <AnimatePresence>
        {moreOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMoreOpen(false)}
              className="fixed inset-0 z-40 bg-primary/30 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-gold/20 bg-cream px-6 pb-10 pt-5 md:hidden"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="font-cormorant text-lg font-semibold text-primary">
                  More Options
                </span>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="text-charcoal/40"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-1">
                {moreItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 font-dm-sans text-sm transition-all",
                        active
                          ? "bg-blush/40 text-gold"
                          : "text-charcoal/70 hover:bg-blush/20"
                      )}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-dm-sans text-sm text-rose transition-all hover:bg-rose/10"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Push mobile content above bottom tab bar */}
      <div className="h-16 md:hidden" aria-hidden="true" />
    </div>
  );
}
