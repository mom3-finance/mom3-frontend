import type { Viewport } from "next";
import LandingDetailView from "@/modules/landing-detail/LandingDetailView";

export const metadata = {
  title: "mom3 | AI Wallet for Yield, Lending, and Rebalancing",
  description:
    "Manage assets, discover lending markets, and rebalance your portfolio with mom3.",
};

export const viewport: Viewport = {
  themeColor: "#E6E1F0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootPage() {
  return <LandingDetailView />;
}
