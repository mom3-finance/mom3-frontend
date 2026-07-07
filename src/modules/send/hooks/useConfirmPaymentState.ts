"use client";

import { useUniversalAccount } from "@/providers/UniversalAccountProvider";
import { parseDecimalish } from "@/lib/format";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { CHAIN_ID } from "@particle-network/universal-account-sdk";

import {
  addressBook,
  recentRecipients,
  scannedRecipient,
  ZERO_ADDRESS,
} from "@/modules/send/constants";
import type { Recipient, SendPreview, SendStatus, TokenRow } from "@/modules/send/type";
import {
  chainNameFromId,
  findPreferredToken,
  getAmountValidationMessage,
  getSendErrorMessage,
  isRecipientValidForToken,
  isUserRejectedError,
  matchesAsset,
  normalizeAssetQuery,
  resolveRecipient,
  tokenIcon,
} from "@/modules/send/utils";

export function useConfirmPaymentState() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const to = searchParams.get("to") ?? "";
  const asset = searchParams.get("asset") ?? "";
  const chain = searchParams.get("chain") ?? "";
  const amount = searchParams.get("amount") ?? "";

  const {
    universalAccount,
    primaryAssets,
    isLoading,
    error: accountError,
    ensureDelegated,
    isDelegated,
    refreshAccount,
    signAndSend,
  } = useUniversalAccount();

  const [sendStatus, setSendStatus] = React.useState<SendStatus>("idle");
  const [sendPreview, setSendPreview] = React.useState<SendPreview | null>(null);
  const [transactionId, setTransactionId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const tokenRows = React.useMemo<TokenRow[]>(() => {
    const assets = primaryAssets?.assets ?? [];
    const rowsById = new Map<string, TokenRow>();

    assets
      .flatMap((assetItem) => {
        const tokenType = String(assetItem.tokenType || "TOKEN").toUpperCase();
        return assetItem.chainAggregation.map((entry) => {
          const tokenSymbol = String(entry.token.symbol || tokenType).toUpperCase();
          const chainId = Number(entry.token.chainId ?? 0);
          const balance = parseDecimalish(entry.amount, Number(entry.token.realDecimals ?? entry.token.decimals ?? 18));
          const amountInUSD = parseDecimalish(entry.amountInUSD);
          const tokenAddress = String(entry.token.address ?? ZERO_ADDRESS);

          return {
            id: `${chainId}-${tokenAddress.toLowerCase()}-${tokenSymbol}`,
            symbol: tokenSymbol,
            name: String(entry.token.name || tokenSymbol),
            balance,
            amountInUSD,
            icon: tokenIcon(tokenSymbol),
            chainName: chainNameFromId(chainId),
            chainId,
            tokenAddress,
          };
        });
      })
      .forEach((token) => rowsById.set(token.id, token));

    return Array.from(rowsById.values()).sort((left, right) => {
      if (right.amountInUSD !== left.amountInUSD) return right.amountInUSD - left.amountInUSD;
      if (right.balance !== left.balance) return right.balance - left.balance;
      return left.symbol.localeCompare(right.symbol);
    });
  }, [primaryAssets]);

  const totalPrimaryAssetsInUSD =
    primaryAssets && "totalAmountInUSD" in primaryAssets
      ? Number(primaryAssets.totalAmountInUSD || 0)
      : null;

  const selectedToken = React.useMemo(
    () => findPreferredToken(tokenRows, asset, chain),
    [tokenRows, asset, chain],
  );

  const numericAmount = React.useMemo(() => Number(amount), [amount]);
  const amountValidationMessage = React.useMemo(
    () => getAmountValidationMessage(amount, selectedToken, totalPrimaryAssetsInUSD),
    [amount, selectedToken, totalPrimaryAssetsInUSD],
  );

  const [recipient, setRecipient] = React.useState<Recipient | null>(null);

  React.useEffect(() => {
    const resolved = resolveRecipient(to);
    if (resolved) {
      setRecipient(resolved);
    }
  }, [to]);

  const prepareTransaction = React.useCallback(async () => {
    if (!universalAccount || !recipient || !selectedToken) return;

    if (!isRecipientValidForToken(recipient, selectedToken)) {
      setError(
        selectedToken.chainId === CHAIN_ID.SOLANA_MAINNET
          ? "Alamat tujuan harus alamat Solana untuk token tujuan Solana."
          : "Alamat tujuan harus alamat EVM untuk token tujuan EVM.",
      );
      return;
    }

    if (amountValidationMessage || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError(amountValidationMessage ?? "Masukkan jumlah yang valid.");
      return;
    }

    setError(null);
    setSendStatus(isDelegated ? "preparing" : "delegating");

    try {
      if (!isDelegated) {
        await ensureDelegated();
      }

      setSendStatus("preparing");
      const transaction = await universalAccount.createTransferTransaction({
        token: {
          chainId: selectedToken.chainId,
          address: selectedToken.tokenAddress,
        },
        amount: amount.trim(),
        receiver: recipient.address,
      });

      setSendPreview({
        transaction,
        amount: amount.trim(),
        token: selectedToken,
        recipient,
      });
    } catch (cause) {
      if (!isUserRejectedError(cause)) {
        setError(getSendErrorMessage(cause));
      }
    } finally {
      setSendStatus("idle");
    }
  }, [
    universalAccount,
    recipient,
    selectedToken,
    amount,
    numericAmount,
    amountValidationMessage,
    isDelegated,
    ensureDelegated,
  ]);

  React.useEffect(() => {
    if (!recipient || !selectedToken || sendPreview || sendStatus !== "idle") return;
    void prepareTransaction();
  }, [recipient, selectedToken, sendPreview, sendStatus, prepareTransaction]);

  const handleConfirmSend = async () => {
    if (!sendPreview) {
      await prepareTransaction();
      return;
    }

    setError(null);
    setSendStatus("signing");

    try {
      const result = await signAndSend(sendPreview.transaction as any);
      setTransactionId(result.transactionId ?? sendPreview.transaction.transactionId);
      await refreshAccount();
    } catch (cause) {
      if (!isUserRejectedError(cause)) {
        setError(getSendErrorMessage(cause));
      }
    } finally {
      setSendStatus("idle");
    }
  };

  const handleBack = () => {
    const params = new URLSearchParams();
    if (to) params.set("to", to);
    if (asset) params.set("asset", asset);
    if (chain) params.set("chain", chain);
    router.push(`/send?${params.toString()}`);
  };

  const isReady = Boolean(recipient && selectedToken && !isLoading && !amountValidationMessage);
  const isSigning = sendStatus === "signing";
  const isPreparing = sendStatus === "preparing" || sendStatus === "delegating";

  return {
    to,
    asset,
    chain,
    amount,
    recipient,
    selectedToken,
    sendPreview,
    transactionId,
    error,
    accountError,
    isLoading,
    isReady,
    isSigning,
    isPreparing,
    totalPrimaryAssetsInUSD,
    amountValidationMessage,
    handleConfirmSend,
    handleBack,
    refreshAccount,
  };
}
