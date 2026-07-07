import type { Metadata } from "next";
import { Suspense } from "react";

import ConfirmPaymentView from "@/modules/send/components/ConfirmPaymentView";

export const metadata: Metadata = {
  title: "Confirm Payment | Oni",
  description: "Review and confirm your payment.",
};

export default function ConfirmPaymentPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmPaymentView />
    </Suspense>
  );
}
