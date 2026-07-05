import { notFound } from "next/navigation";

import { assetDetails } from "@/lib/portfolio-data";
import AssetDetailView from "./AssetDetailView";

export function generateStaticParams() {
  return assetDetails.map((asset) => ({ symbol: asset.slug }));
}

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const asset = assetDetails.find((item) => item.slug === symbol);

  if (!asset) notFound();

  return <AssetDetailView asset={asset} />;
}
