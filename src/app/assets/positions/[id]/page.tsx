import { notFound } from "next/navigation";

import { positionDetails } from "@/lib/portfolio-data";
import PositionDetailView from "./PositionDetailView";

export function generateStaticParams() {
  return positionDetails.map((position) => ({ id: position.slug }));
}

export default async function PositionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const position = positionDetails.find((item) => item.slug === id);

  if (!position) notFound();

  return <PositionDetailView position={position} />;
}
