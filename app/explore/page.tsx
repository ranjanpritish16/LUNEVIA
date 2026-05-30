import type { Metadata } from "next";

import { ExplorePage } from "@/components/explore/ExplorePage";
import { getAllSalons } from "@/lib/data/salons";

export const metadata: Metadata = {
  title: "Explore Artists — LUNÉVIA",
  description:
    "Browse and filter Delhi's finest verified bridal beauty artists.",
};

export default function Explore() {
  const salons = getAllSalons();

  return <ExplorePage salons={salons} />;
}
