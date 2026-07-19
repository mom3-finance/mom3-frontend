"use client";

import * as React from "react";
import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TokenAssetBadge } from "@/modules/send/components/TokenAssetBadge";
import type { TokenRow } from "@/modules/send/types/send.types";
import { formatTokenBalance, formatUsd } from "@/lib/format";

export function AmountInput({
  token,
  amount,
  amountValidationMessage,
  totalPrimaryAssetsInUSD,
  onAmountChange,
  onMaxAmount,
}: {
  token: TokenRow;
  amount: string;
  amountValidationMessage: string | null;
  totalPrimaryAssetsInUSD: number | null;
  onAmountChange: (value: string) => void;
  onMaxAmount: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3 rounded-[22px] bg-black/20 p-3">
        <TokenAssetBadge token={token} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-black text-white">{token.symbol}</span>
          <span className="block text-xs font-medium text-[#9A9AA2]">
            Balance {formatTokenBalance(token.balance)} {token.symbol}
          </span>
        </span>
      </div>

      <label htmlFor="send-amount" className="mt-8 block text-center text-xs font-black uppercase tracking-[0.14em] text-[#77777f]">
        You send
      </label>
      <div className="relative mt-3 flex min-h-28 items-center justify-center gap-2 rounded-[26px] bg-black/25 px-3 transition-shadow focus-within:ring-2 focus-within:ring-[#3B33BD]">
        <input
          id="send-amount"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          placeholder="0.00"
          aria-invalid={amountValidationMessage ? "true" : undefined}
          aria-describedby={amountValidationMessage ? "send-amount-error" : undefined}
          className="min-w-0 max-w-[78%] bg-transparent text-center font-mono text-[clamp(2.75rem,14vw,4.25rem)] font-black leading-none tracking-[-0.06em] tabular-nums text-white placeholder:text-[#66666D] focus:outline-none"
        />
        <span className="shrink-0 font-mono text-xl font-black text-[#ccff00]">{token.symbol}</span>
        <Button
          type="button"
          onClick={onMaxAmount}
          isDisabled={token.balance <= 0}
          label="Max"
          color="transparent"
          size="compact"
          rounded="full"
          className="absolute bottom-[-20px] right-3 flex h-10 min-w-10 items-center justify-center rounded-full bg-[#3B33BD]/20 px-3 text-xs font-black text-[#8F89FF] transition-colors hover:bg-[#3B33BD]/30 focus-visible:ring-2 focus-visible:ring-[#3B33BD] disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2" role="group" aria-label="Amount keypad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "backspace"].map((key) => (
          <button
            key={key}
            type="button"
            aria-label={key === "backspace" ? "Delete last digit" : key === "." ? "Decimal point" : `Number ${key}`}
            disabled={(key === "backspace" && amount.length === 0) || (key === "." && amount.includes("."))}
            onClick={() => onAmountChange(key === "backspace" ? amount.slice(0, -1) : key === "." ? (amount ? `${amount}.` : "0.") : amount === "0" ? key : `${amount}${key}`)}
            className="flex h-12 items-center justify-center rounded-full bg-white/[0.03] font-mono text-xl font-black tabular-nums text-white transition-colors hover:bg-[#3B33BD]/20 active:scale-95 disabled:opacity-25 focus-visible:ring-2 focus-visible:ring-[#3B33BD] motion-reduce:transition-none"
          >
            {key === "backspace" ? <Delete className="h-5 w-5" aria-hidden="true" /> : key}
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs font-semibold text-[#9A9AA2]">
        <span>
          Receive: <span className="text-white">{token.chainName}</span>
        </span>
        <span>
          UA balance:{" "}
          <span className="text-white">
            {totalPrimaryAssetsInUSD === null ? "Loading" : formatUsd(totalPrimaryAssetsInUSD)}
          </span>
        </span>
      </div>

      {amountValidationMessage ? (
        <p id="send-amount-error" className="mt-2 text-xs font-semibold text-red-200">
          {amountValidationMessage}
        </p>
      ) : null}
    </>
  );
}
