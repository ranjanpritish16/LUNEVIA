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
  const isConcierge = pathname === "/concierge";

  if (isConcierge) {
    return <PageWrapper>{children}</PageWrapper>;
  }

  return (
    <>
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
      <Footer />
      <ConciergeWidget />
    </>
  );
}
