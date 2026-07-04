import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export const metadata: Metadata = {
  applicationName: "Oni",
  title: {
    default: "Oni - Push your brand engagement, earn benefits",
    template: "%s | Oni",
  },
  description:
    "Earn coins, win collectibles, and get close to the brands you love.",
  manifest: "/manifest.json?v=3",
  appleWebApp: {
    capable: true,
    title: "Oni",
    statusBarStyle: "default",
    startupImage: "/apple-touch-icon.png",
  },
  icons: {
    icon: "/icon-192x192.png?v=3",
    apple: "/apple-touch-icon.png?v=3",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-rounded antialiased">
        {children}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
