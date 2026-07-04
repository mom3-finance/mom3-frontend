import type { Metadata, Viewport } from "next";
import Dashboard from "./Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  appleWebApp: {
    capable: true,
    title: "Oni Dashboard",
    statusBarStyle: "black",
    startupImage: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function DashboardPage() {
  return <Dashboard />;
}
