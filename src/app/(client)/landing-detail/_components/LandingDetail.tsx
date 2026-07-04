import Hero from "./Hero";
import MarqueeStrip from "./MarqueeStrip";
import EarnSection from "./EarnSection";
import FindFavesSection from "./FindFavesSection";
import LovedBrands from "./LovedBrands";
import CtaFooter from "./CtaFooter";
import Navbar from "./Navbar";
import SmoothScroll from "@/components/SmoothScroll";

export default function LandingDetail() {
  return (
    <SmoothScroll>
      <main className="font-sans bg-[#E6E1F0] text-[#0A0A0A]">
        <Navbar />
        <Hero />
        <MarqueeStrip />
        <EarnSection />
        <FindFavesSection />
        <LovedBrands />
        <CtaFooter />
      </main>
    </SmoothScroll>
  );
}
