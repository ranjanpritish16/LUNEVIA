import { ConciergeBanner } from "@/components/landing/ConciergeBanner";
import { FeaturedArtistsSection } from "@/components/landing/FeaturedArtistsSection";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsBar } from "@/components/landing/StatsBar";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <StatsBar />
      <HowItWorksSection />
      <FeaturedArtistsSection />
      <ConciergeBanner />
      <TestimonialsSection />
    </main>
  );
}
