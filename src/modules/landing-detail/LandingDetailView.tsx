import Hero from "./components/Hero";
import MarqueeStrip from "./components/MarqueeStrip";
import EarnSection from "./components/EarnSection";
import FindFavesSection from "./components/FindFavesSection";
import LovedBrands from "./components/LovedBrands";
import CtaFooter from "./components/CtaFooter";
import Navbar from "./components/Navbar";
import SmoothScroll from "./components/SmoothScroll";

export default function LandingDetailView() {
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
