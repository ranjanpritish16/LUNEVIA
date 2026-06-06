import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LUNÉVIA Concierge — AI Bridal Consultant",
  description:
    "Describe your vision. Get matched to Delhi's finest bridal artists — personalised to your budget, complexion, and style.",
};

export default function ConciergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
