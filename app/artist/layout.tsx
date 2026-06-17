"use client";

import { usePathname } from "next/navigation";
import { ArtistTopBar } from "@/components/artist/ArtistTopBar";

/**
 * Layout applied to ALL /artist/* routes.
 * - Does NOT render <Navbar />, <Footer />, or <ConciergeWidget /> (customer-only).
 * - Renders <ArtistTopBar /> only on /artist/login and /artist/onboarding.
 * - /artist/dashboard/* pages use <DashboardShell> which provides its own
 *   sidebar + top bar, so ArtistTopBar is intentionally hidden there.
 */
export default function ArtistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ArtistLayoutInner>{children}</ArtistLayoutInner>;
}

function ArtistLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // DashboardShell renders its own top bar; don't double-render ArtistTopBar there.
  const showTopBar = !pathname.startsWith("/artist/dashboard");

  return (
    <div className="min-h-screen bg-cream">
      {showTopBar && <ArtistTopBar />}
      {children}
    </div>
  );
}

