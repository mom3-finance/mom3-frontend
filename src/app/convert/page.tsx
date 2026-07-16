import type { Metadata, Viewport } from "next";
import ConvertView from "@/modules/convert/ConvertView";

export const metadata: Metadata = {
  title: "Convert | Oni",
  description: "Convert your assets in mom3.",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function ConvertPage() {
  return <ConvertView />;
}
