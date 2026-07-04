import type { Viewport } from "next";
import LandingDetail from "./(client)/landing-detail/_components/LandingDetail";

export const metadata = {
  title: "Push Your Brand Engagement, Earn Benefits",
  description:
    "Earn coins, win collectibles, and get close to the brands you love.",
};

export const viewport: Viewport = {
  themeColor: "#E6E1F0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootPage() {
  return <LandingDetail />;
}
