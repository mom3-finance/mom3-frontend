import type { Metadata, Viewport } from "next";
import { allHistoryItems, getHistoryItemById } from "@/lib/history";
import HistoryDetailView from "@/modules/history-detail/HistoryDetailView";

type HistoryDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export function generateStaticParams() {
  return allHistoryItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({
  params,
}: HistoryDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = getHistoryItemById(id);

  return {
    title: item ? `${item.title} | History` : "History Detail | Oni",
    description: item?.note ?? "View activity detail.",
  };
}

export default async function HistoryDetailPage({
  params,
}: HistoryDetailPageProps) {
  const { id } = await params;
  const item = getHistoryItemById(id);

  return <HistoryDetailView item={item} activityId={id} />;
}
