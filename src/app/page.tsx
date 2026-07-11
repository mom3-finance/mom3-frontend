import { redirect } from "next/navigation";

export const metadata = {
  title: "mom3 | AI Wallet for Yield, Lending, and Rebalancing",
  description:
    "Manage assets, discover lending markets, and rebalance your portfolio with mom3.",
};

const landingUrl = process.env.NEXT_PUBLIC_LANDING_URL || "http://localhost:3001";

export default function RootPage() {
  redirect(landingUrl);
}
