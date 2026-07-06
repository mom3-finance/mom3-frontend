"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { MagicProvider } from "@/providers/MagicProvider";
import { UniversalAccountProvider } from "@/providers/UniversalAccountProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export function WalletProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MagicProvider>
        <UniversalAccountProvider>{children}</UniversalAccountProvider>
      </MagicProvider>
    </QueryClientProvider>
  );
}
