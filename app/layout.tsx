import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { ClientShell } from "@/components/providers/ClientShell";

import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LUNÉVIA — Your most beautiful day, designed by AI",
  description:
    "Delhi's premier AI-powered bridal beauty marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-cream">
        <ClientShell>{children}</ClientShell>
        <Footer />
      </body>
    </html>
  );
}
