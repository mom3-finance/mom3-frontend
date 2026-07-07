"use client";

import { Icon } from "@iconify/react";
import * as React from "react";

import { truncateAddress } from "@/lib/wallet-session";
import { cn } from "@/lib/utils";
import type { Recipient } from "@/modules/send/type";

export function RecipientHeader({ recipient }: { recipient: Recipient }) {
  return (
    <div className="rounded-[32px] bg-[#111217] p-5 shadow-[0_12px_44px_-24px_rgba(59,51,189,0.6)]">
      <div
        className={cn(
          "mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-2xl font-black text-white",
          recipient.color,
        )}
      >
        {recipient.name.slice(0, 1)}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2">
        <h2 className="text-2xl font-black tracking-tight text-white">{recipient.handle}</h2>
        {recipient.status === "Verified" ? (
          <Icon
            icon="material-symbols:verified-rounded"
            aria-hidden="true"
            width={22}
            height={22}
            className="text-[#ccff00]"
          />
        ) : null}
      </div>
      <p className="mt-2 text-center text-sm font-medium text-[#9A9AA2]">
        {recipient.name} • {truncateAddress(recipient.address, 5)}
      </p>
    </div>
  );
}
