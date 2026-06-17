"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageWrapper } from "@/components/ui/PageWrapper";

const ConciergeWidget = dynamic(
  () =>
    import("@/components/ai/ConciergeWidget").then((mod) => ({
      default: mod.ConciergeWidget,
    })),
  { ssr: false }
);

interface ClientShellProps {
  children: React.ReactNode;
}

export function ClientShell({ children }: ClientShellProps) {
  const pathname = usePathname();

  // Artist routes have their own layout (app/artist/layout.tsx) that renders
  // ArtistTopBar instead. Never show customer chrome (Navbar/Footer/Concierge)
  // on any /artist/* path.
  const isArtistRoute = pathname.startsWith("/artist");
  if (isArtistRoute) {
    return <>{children}</>;
  }

  // The full-page Concierge has its own chrome; skip Navbar/Footer there too.
  const isConcierge = pathname === "/concierge";
  if (isConcierge) {
    return <PageWrapper>{children}</PageWrapper>;
  }

  // All customer-facing routes: render full customer chrome.
  return (
    <>
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
      <Footer />
      <ConciergeWidget />
    </>
  );
}
