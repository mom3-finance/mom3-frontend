"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { MobileShell } from "@/components/ui/mobile-shell";
import { Typography } from "@/components/ui/typography";
import { useMagic } from "@/providers/magic/components/MagicProvider";

export default function SignoutView() {
  const router = useRouter();
  const { logout, session } = useMagic();
  const [error, setError] = React.useState<string | null>(null);

  const signOut = React.useCallback(async () => {
    setError(null);
    try {
      if (session) await logout();
      router.replace("/login");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to end this session.");
    }
  }, [logout, router, session]);

  React.useEffect(() => {
    void signOut();
  }, [signOut]);

  return (
    <MobileShell>
      <section className="flex flex-1 flex-col items-center justify-center px-5 text-center">
        <span className="h-10 w-10 animate-pulse rounded-full bg-[#ccff00] motion-reduce:animate-none" aria-hidden="true" />
        <Typography as="h1" variant="h2" className="mt-5">Signing out</Typography>
        <Typography variant="body-sm" color="muted" className="mt-2 max-w-xs">
          Ending your wallet session securely.
        </Typography>
        {error ? (
          <div className="mt-5 rounded-2xl bg-red-500/10 p-4" role="alert">
            <Typography variant="body-sm" color="danger">{error}</Typography>
            <Button type="button" color="primary" size="sm" rounded="full" className="mt-3" label="Try again" onClick={() => void signOut()} />
          </div>
        ) : null}
      </section>
    </MobileShell>
  );
}
