"use client";

import dynamic from "next/dynamic";

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
  return (
    <>
      <Navbar />
      <PageWrapper>{children}</PageWrapper>
      <ConciergeWidget />
    </>
  );
}
