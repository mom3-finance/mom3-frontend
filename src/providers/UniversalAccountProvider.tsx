"use client";

import {
  UNIVERSAL_ACCOUNT_VERSION,
  UniversalAccount,
  type IAssetsResponse,
} from "@particle-network/universal-account-sdk";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Signature } from "ethers";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { useMagic } from "@/providers/MagicProvider";

const DEFAULT_CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_PARTICLE_7702_CHAIN_ID ||
    process.env.NEXT_PUBLIC_MAGIC_CHAIN_ID ||
    42161,
);

type AccountInfo = {
  ownerAddress: string;
  evmSmartAccount: string;
  solanaSmartAccount: string;
};

type UniversalAccountSnapshot = {
  accountInfo: AccountInfo;
  isDelegated: boolean;
  primaryAssets: IAssetsResponse | null;
};

type UniversalAccountContextType = {
  universalAccount: UniversalAccount | null;
  accountInfo: AccountInfo;
  primaryAssets: IAssetsResponse | null;
  isDelegated: boolean;
  isLoading: boolean;
  error: string | null;
  refreshAccount: () => Promise<void>;
  ensureDelegated: () => Promise<void>;
  signAndSend: (
    transaction: { rootHash: string; userOps?: Array<Record<string, any>> } & Record<string, any>,
  ) => Promise<{ transactionId: string }>;
};

const emptyAccountInfo: AccountInfo = {
  ownerAddress: "",
  evmSmartAccount: "",
  solanaSmartAccount: "",
};

const UniversalAccountContext = createContext<UniversalAccountContextType | null>(null);

const universalAccountQueryKeys = {
  root: ["universal-account"] as const,
  instance: (ownerAddress?: string) =>
    ["universal-account", "instance", ownerAddress || "anonymous"] as const,
  snapshot: (ownerAddress?: string) =>
    ["universal-account", "snapshot", ownerAddress || "anonymous"] as const,
};

function createUniversalAccount(ownerAddress: string) {
  const projectId = process.env.NEXT_PUBLIC_PARTICLE_PROJECT_ID;
  const projectClientKey = process.env.NEXT_PUBLIC_PARTICLE_CLIENT_KEY;
  const projectAppUuid = process.env.NEXT_PUBLIC_PARTICLE_APP_ID;

  if (!projectId || !projectClientKey || !projectAppUuid) {
    throw new Error("Particle env belum lengkap.");
  }

  return new UniversalAccount({
    projectId,
    projectClientKey,
    projectAppUuid,
    smartAccountOptions: {
      useEIP7702: true,
      name: "UNIVERSAL",
      version:
        process.env.NEXT_PUBLIC_UNIVERSAL_ACCOUNT_VERSION ||
        UNIVERSAL_ACCOUNT_VERSION,
      ownerAddress,
    },
    tradeConfig: {
      slippageBps: 100,
      universalGas: false,
    },
  });
}

async function loadUniversalAccountSnapshot(
  universalAccount: UniversalAccount,
  ownerAddress: string,
): Promise<UniversalAccountSnapshot> {
  const [options, assets, deployments] = await Promise.all([
    universalAccount.getSmartAccountOptions(),
    universalAccount.getPrimaryAssets(),
    universalAccount.getEIP7702Deployments(),
  ]);

  const targetChain = deployments.find(
    (deployment: { chainId?: number }) => deployment.chainId === DEFAULT_CHAIN_ID,
  );

  return {
    accountInfo: {
      ownerAddress,
      evmSmartAccount: options.smartAccountAddress || ownerAddress,
      solanaSmartAccount: options.solanaSmartAccountAddress || "",
    },
    isDelegated: Boolean((targetChain as { isDelegated?: boolean } | undefined)?.isDelegated),
    primaryAssets: assets,
  };
}

export function UniversalAccountProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { magic, session } = useMagic();
  const ownerAddress = session?.ownerAddress;

  const universalAccountQuery = useQuery({
    queryKey: universalAccountQueryKeys.instance(ownerAddress),
    queryFn: () => createUniversalAccount(ownerAddress as string),
    enabled: Boolean(ownerAddress),
    gcTime: Infinity,
    staleTime: Infinity,
  });

  const snapshotQuery = useQuery({
    queryKey: universalAccountQueryKeys.snapshot(ownerAddress),
    queryFn: () =>
      loadUniversalAccountSnapshot(
        universalAccountQuery.data as UniversalAccount,
        ownerAddress as string,
      ),
    enabled: Boolean(ownerAddress && universalAccountQuery.data),
  });

  const signEip7702Auth = async (contractAddress: string, chainId: number, nonce?: number) => {
    if (!magic) throw new Error("Magic belum siap.");

    return magic.wallet.sign7702Authorization({
      contractAddress,
      chainId,
      ...(nonce !== undefined ? { nonce } : {}),
    });
  };

  const ensureDelegatedMutation = useMutation({
    mutationFn: async () => {
      if (!universalAccountQuery.data || !magic || !ownerAddress) {
        throw new Error("Universal Account atau Magic wallet belum siap.");
      }

      const deployments = await universalAccountQuery.data.getEIP7702Deployments();
      const targetChain = deployments.find(
        (deployment: { chainId?: number }) => deployment.chainId === DEFAULT_CHAIN_ID,
      ) as { isDelegated?: boolean } | undefined;

      if (targetChain?.isDelegated) return;

      await magic.evm.switchChain(DEFAULT_CHAIN_ID);

      const [auth] = await universalAccountQuery.data.getEIP7702Auth([DEFAULT_CHAIN_ID]);
      const authorization = await signEip7702Auth(
        auth.address,
        DEFAULT_CHAIN_ID,
        Number(auth.nonce) + 1,
      );

      await magic.wallet.send7702Transaction({
        to: ownerAddress,
        data: "0x",
        authorizationList: [authorization],
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: universalAccountQueryKeys.snapshot(ownerAddress),
      });
    },
  });

  const signAndSend = async (
    transaction: { rootHash: string; userOps?: Array<Record<string, any>> } & Record<string, any>,
  ) => {
    if (!universalAccountQuery.data || !magic || !ownerAddress) {
      throw new Error("Universal Account atau Magic wallet belum siap.");
    }

    const authorizations: Array<{ userOpHash: string; signature: string }> = [];
    const nonceMap = new Map<number, string>();

    for (const userOp of transaction.userOps || []) {
      const auth = userOp.eip7702Auth;

      if (auth && !userOp.eip7702Delegated) {
        let serialized = nonceMap.get(Number(auth.nonce));

        if (!serialized) {
          const authorization = await signEip7702Auth(
            auth.address,
            Number(auth.chainId || userOp.chainId),
            Number(auth.nonce),
          );

          serialized = Signature.from({
            r: authorization.r,
            s: authorization.s,
            v: authorization.v,
          }).serialized;
          nonceMap.set(Number(auth.nonce), serialized);
        }

        authorizations.push({
          userOpHash: String(userOp.userOpHash),
          signature: serialized,
        });
      }
    }

    const signature = (await magic.rpcProvider.request({
      method: "eth_sign",
      params: [ownerAddress, transaction.rootHash],
    })) as string;

    return universalAccountQuery.data.sendTransaction(
      transaction as any,
      signature,
      authorizations.length > 0 ? authorizations : undefined,
    );
  };

  const refreshAccount = async () => {
    await queryClient.invalidateQueries({
      queryKey: universalAccountQueryKeys.snapshot(ownerAddress),
    });
  };

  const value = useMemo(
    () => ({
      universalAccount: universalAccountQuery.data ?? null,
      accountInfo: snapshotQuery.data?.accountInfo ?? {
        ...emptyAccountInfo,
        ownerAddress: ownerAddress || "",
      },
      primaryAssets: snapshotQuery.data?.primaryAssets ?? null,
      isDelegated: snapshotQuery.data?.isDelegated ?? false,
      isLoading:
        universalAccountQuery.isLoading ||
        snapshotQuery.isLoading ||
        snapshotQuery.isFetching ||
        ensureDelegatedMutation.isPending,
      error:
        universalAccountQuery.error?.message ||
        snapshotQuery.error?.message ||
        ensureDelegatedMutation.error?.message ||
        null,
      refreshAccount,
      ensureDelegated: ensureDelegatedMutation.mutateAsync,
      signAndSend,
    }),
    [
      universalAccountQuery.data,
      universalAccountQuery.error?.message,
      universalAccountQuery.isLoading,
      snapshotQuery.data,
      snapshotQuery.error?.message,
      snapshotQuery.isFetching,
      snapshotQuery.isLoading,
      ensureDelegatedMutation.error?.message,
      ensureDelegatedMutation.isPending,
      ensureDelegatedMutation.mutateAsync,
      ownerAddress,
    ],
  );

  return (
    <UniversalAccountContext.Provider value={value}>
      {children}
    </UniversalAccountContext.Provider>
  );
}

export function useUniversalAccount() {
  const context = useContext(UniversalAccountContext);

  if (!context) {
    throw new Error("useUniversalAccount must be used within UniversalAccountProvider");
  }

  return context;
}
