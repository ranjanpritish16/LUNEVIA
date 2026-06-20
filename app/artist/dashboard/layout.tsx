"use client";

import { useArtistSalon } from "@/lib/hooks/useArtistSalon";
import { DashboardShell } from "@/components/artist/DashboardShell";

export default function ArtistDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { salon, isLoading } = useArtistSalon();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <span className="font-cormorant text-2xl font-semibold text-gold">
            LUNÉVIA
          </span>
          <div className="h-1 w-24 overflow-hidden rounded-full bg-gold/20">
            <div className="h-full w-1/2 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gold/60" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      salonName={salon?.name}
      isPublished={salon?.is_published ?? undefined}
      pendingBookingsCount={salon?.pending_bookings_count ?? 0}
    >
      {children}
    </DashboardShell>
  );
}
