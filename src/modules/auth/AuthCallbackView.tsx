"use client";

import { Icon } from "@iconify/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

import { MobileShell } from "@/components/ui/mobile-shell";
import { useMagic } from "@/providers/MagicProvider";

export default function AuthCallbackView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { completeRedirectLogin, error, isReady } = useMagic();
  const hasOAuthParams =
    searchParams.has("magic_credential") || searchParams.has("state");

  useQuery({
    queryKey: ["auth", "magic-oauth-redirect", searchParams.toString()],
    queryFn: async () => {
      if (!hasOAuthParams) {
        router.replace("/login");
        return null;
      }

      const nextSession = await completeRedirectLogin();

      if (nextSession?.ownerAddress) {
        router.replace("/claim-username");
      }

      return nextSession;
    },
    enabled: isReady,
    retry: false,
  });

  return (
    <MobileShell
      className="overflow-hidden bg-[#3B33BD]"
      contentClassName="relative items-center justify-center pb-7 pt-5 text-center"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,#201B8F_0%,#3B33BD_42%,#6F7CFF_100%)]" />
      <div className="relative z-10 flex flex-col items-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#12111A] text-[#ccff00] shadow-[0_16px_42px_-24px_rgba(14,18,58,0.8)]">
          <Icon
            icon="lucide:loader-circle"
            aria-hidden="true"
            width={26}
            height={26}
            className="animate-spin"
          />
        </span>
        <h1 className="mt-5 text-2xl font-black text-white">
          Completing sign in
        </h1>
        <p className="mt-2 max-w-xs text-sm font-semibold leading-relaxed text-white/75">
          Hold on while mom3 finishes connecting your wallet.
        </p>
        {error ? (
          <p
            role="alert"
            className="mt-5 rounded-2xl bg-black/25 px-4 py-3 text-sm font-semibold text-white"
          >
            {error}
          </p>
        ) : null}
      </div>
    </MobileShell>
  );
}
