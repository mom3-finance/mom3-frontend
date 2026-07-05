import { notFound } from "next/navigation";

import { marketDetails } from "@/lib/portfolio-data";
import MarketDetailView from "./MarketDetailView";

export function generateStaticParams() {
  return marketDetails.map((market) => ({ id: market.slug }));
}

export default async function ExploreMarketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const market = marketDetails.find((item) => item.slug === id);

  if (!market) notFound();

  return <MarketDetailView market={market} />;
}
