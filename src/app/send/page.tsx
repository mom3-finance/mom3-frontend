import type { Metadata } from "next";
import { Suspense } from "react";
import SendView from "@/modules/send/SendView";

export const metadata: Metadata = {
  title: "Send | Oni",
  description: "Send assets to a mom3 tag or wallet address.",
};

export default function SendPage() {
  return (
    <Suspense fallback={null}>
      <SendView />
    </Suspense>
  );
}
