"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";

import { truncateAddress } from "@/lib/wallet-session";
import { useMagic } from "@/providers/MagicProvider";
import { useUniversalAccount } from "@/providers/UniversalAccountProvider";
import type {
  ProfileIdentityRow,
  UniversalAccountRow,
} from "@/modules/profile/type";

export function useProfileViewModel() {
  const router = useRouter();
  const { isLoading: isMagicLoading, logout: magicLogout, session } = useMagic();
  const {
    accountInfo,
    ensureDelegated,
    error: universalAccountError,
    isDelegated,
    isLoading: isUniversalAccountLoading,
    primaryAssets,
    refreshAccount,
    universalAccount,
  } = useUniversalAccount();
  const [copiedAddress, setCopiedAddress] = React.useState<string | null>(null);
  const [universalAccountOpen, setUniversalAccountOpen] = React.useState(false);

  useQuery({
    queryKey: ["profile", "missing-session", session?.ownerAddress || "anonymous"],
    queryFn: async () => {
      router.replace("/login");
      return true;
    },
    enabled: !isMagicLoading && !session?.ownerAddress,
    staleTime: Infinity,
  });

  const delegateMutation = useMutation({
    mutationFn: async () => {
      await ensureDelegated();
      await refreshAccount();
    },
  });

  const totalUsd =
    primaryAssets && "totalAmountInUSD" in primaryAssets
      ? Number(primaryAssets.totalAmountInUSD || 0)
      : 0;

  const ownerAddress = accountInfo.ownerAddress || session?.ownerAddress || "";

  const identityRows: ProfileIdentityRow[] = [
    {
      icon: "solar:wallet-money-bold",
      label: "Universal Balance",
      value: isUniversalAccountLoading ? "Loading" : `$${totalUsd.toFixed(2)}`,
    },
    {
      icon: "solar:shield-check-bold",
      label: "EIP-7702",
      value: isDelegated ? "Delegated" : "Ready to upgrade",
    },
    {
      icon: "solar:global-bold",
      label: "Owner EOA",
      value: truncateAddress(session?.ownerAddress || ""),
    },
  ];

  const universalAccountRows: UniversalAccountRow[] = [
    {
      icon: "solar:user-id-bold",
      label: "Owner EOA",
      description: "Magic signer",
      address: ownerAddress,
    },
    {
      icon: "solar:global-bold",
      label: "EVM account",
      description: "Universal EVM smart account",
      address: accountInfo.evmSmartAccount,
    },
    {
      icon: "token-branded:solana",
      label: "Solana account",
      description: "Universal Solana address",
      address: accountInfo.solanaSmartAccount,
    },
  ];

  const logout = async () => {
    await magicLogout();
    router.replace("/landing-detail");
  };

  const copyAddress = async (address: string, label: string) => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopiedAddress(label);
    window.setTimeout(() => setCopiedAddress(null), 1200);
  };

  const openUniversalAccountSheet = () => setUniversalAccountOpen(true);

  return {
    copiedAddress,
    delegateErrorMessage: delegateMutation.error?.message || null,
    identityRows,
    isDelegated,
    isUpgradeDisabled:
      !universalAccount || isDelegated || delegateMutation.isPending,
    isUpgradePending: delegateMutation.isPending,
    logout,
    onUpgrade: () => delegateMutation.mutate(),
    openUniversalAccountSheet,
    ownerAddress,
    profileEmail: session?.email || null,
    setUniversalAccountOpen,
    universalAccountError,
    universalAccountOpen,
    universalAccountRows,
    copyAddress,
  };
}
