import {
  CHAIN_ID,
  type ITokenWithUSD,
  type ITransaction,
} from "@particle-network/universal-account-sdk";

import {
  addressBook,
  recentRecipients,
  scannedRecipient,
  ZERO_ADDRESS,
} from "@/modules/send/constants";
import type { Recipient, TokenRow } from "@/modules/send/type";
import { parseDecimalish } from "@/lib/format";

/* ── Address validation ────────────────────────────────────── */

export function isValidAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function isValidSolanaAddress(address: string) {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/* ── Token / chain helpers ─────────────────────────────────── */

export function tokenIcon(symbol: string) {
  switch (symbol.toUpperCase()) {
    case "USDC":
      return "cryptocurrency-color:usdc";
    case "USDT":
      return "cryptocurrency-color:usdt";
    case "ETH":
      return "cryptocurrency-color:eth";
    case "BNB":
      return "cryptocurrency-color:bnb";
    case "SOL":
      return "cryptocurrency-color:solana";
    default:
      return "solar:wallet-money-bold";
  }
}

export function chainNameFromId(chainId: number) {
  switch (chainId) {
    case 101:
      return "Solana";
    case 1:
      return "Ethereum";
    case 10:
      return "Optimism";
    case 56:
      return "BNB Chain";
    case 137:
      return "Polygon";
    case 146:
      return "Sonic";
    case 196:
      return "X Layer";
    case 42161:
      return "Arbitrum";
    case 43114:
      return "Avalanche";
    case 8453:
      return "Base";
    case 59144:
      return "Linea";
    case 80094:
      return "Berachain";
    default:
      return `Chain ${chainId}`;
  }
}

export function chainBadgeIconFromId(chainId: number) {
  switch (chainId) {
    case 101:
      return "token-branded:solana";
    case 1:
      return "simple-icons:ethereum";
    case 10:
      return "simple-icons:optimism";
    case 56:
      return "cryptocurrency-color:bnb";
    case 137:
      return "simple-icons:polygon";
    case 42161:
      return "token-branded:arbitrum";
    case 43114:
      return "simple-icons:avalanche";
    case 8453:
      return "token-branded:base";
    case 59144:
      return "simple-icons:linea";
    case 146:
      return "simple-icons:sonic";
    case 80094:
      return "simple-icons:berachain";
    default:
      return "material-symbols:public";
  }
}

/* ── Formatting ────────────────────────────────────────────── */

export function formatTokenBalance(balance: number) {
  if (balance === 0) return "0.00";
  if (balance >= 1) return balance.toFixed(4).replace(/\.?(0+)$/, "");
  return balance.toFixed(6).replace(/\.?(0+)$/, "");
}

export function formatUsd(value: number) {
  if (!Number.isFinite(value)) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value > 0 && value < 0.01 ? 4 : 2,
    maximumFractionDigits: value > 0 && value < 0.01 ? 6 : 2,
  }).format(value);
}

export function formatUsdValue(value: string | number | null | undefined) {
  return formatUsd(parseDecimalish(value));
}

/* ── Token price / amount ──────────────────────────────────── */

export function getTokenUsdPrice(token: TokenRow | null) {
  if (!token) return null;
  if (token.balance > 0 && token.amountInUSD > 0) return token.amountInUSD / token.balance;
  if (["USDC", "USDT"].includes(token.symbol.toUpperCase())) return 1;
  return null;
}

export function getEstimatedAmountInUSD(amount: number, token: TokenRow | null) {
  const price = getTokenUsdPrice(token);
  if (price === null) return null;
  return amount * price;
}

/* ── Fee helpers ───────────────────────────────────────────── */

export function getTransactionFeeQuote(transaction: ITransaction | null) {
  if (!transaction) return null;
  return transaction.gasless ?? transaction.feeQuotes?.[0] ?? null;
}

export function getFeeBreakdownRows(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  const totals = feeQuote?.fees.totals;

  if (!totals) {
    return [{ label: "Estimated fees", value: "Unavailable" }];
  }

  const rows = [
    {
      label: "Network + gas",
      value: feeQuote.fees.freeGasFee ? "Free" : formatUsdValue(totals.gasFeeTokenAmountInUSD),
    },
    {
      label: "Service fee",
      value: feeQuote.fees.freeServiceFee
        ? "Free"
        : formatUsdValue(totals.transactionServiceFeeTokenAmountInUSD),
    },
    {
      label: "LP / settlement",
      value: formatUsdValue(totals.transactionLPFeeTokenAmountInUSD),
    },
  ];

  const solanaRentFee = totals.solanaRentFeeInUSD ?? totals.solanaRentFeeAmountInUSD;
  if (parseDecimalish(solanaRentFee) > 0) {
    rows.push({ label: "Solana rent", value: formatUsdValue(solanaRentFee) });
  }

  if (parseDecimalish(totals.solanaMevTipFeeInUSD) > 0) {
    rows.push({ label: "Solana MEV tip", value: formatUsdValue(totals.solanaMevTipFeeInUSD) });
  }

  return rows;
}

export function getTotalFeeLabel(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  return formatUsdValue(
    feeQuote?.fees.totals.feeTokenAmountInUSD ?? transaction?.tokenChanges?.totalFeeInUSD,
  );
}

export function formatTokenChange(item: ITokenWithUSD) {
  const decimals = item.token.realDecimals ?? item.token.decimals ?? 18;
  const amount = parseDecimalish(item.amount, decimals);
  const symbol = item.token.symbol || item.token.type || "Token";
  const chain = chainNameFromId(Number(item.token.chainId));
  return `${formatTokenBalance(amount)} ${symbol.toUpperCase()} on ${chain}`;
}

export function getFundingRows(transaction: ITransaction | null) {
  if (!transaction) return [];

  const rows =
    transaction.depositTokens?.length > 0
      ? transaction.depositTokens
      : transaction.tokenChanges?.decr ?? [];

  return rows.slice(0, 3).map((item) => ({
    label: formatTokenChange(item),
    value: formatUsdValue(item.amountInUSD),
  }));
}

export function getFeeTokenRows(transaction: ITransaction | null) {
  const feeQuote = getTransactionFeeQuote(transaction);
  return (feeQuote?.fees.feeTokens ?? []).slice(0, 2).map((item) => ({
    label: formatTokenChange(item),
    value: formatUsdValue(item.amountInUSD),
  }));
}

/* ── Asset query helpers ───────────────────────────────────── */

export function normalizeAssetQuery(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function sanitizeAmountInput(value: string) {
  const normalized = value.replace(",", ".").replace(/[^0-9.]/g, "");
  const [whole, ...fractions] = normalized.split(".");

  if (fractions.length === 0) return whole;
  return `${whole}.${fractions.join("")}`;
}

export function matchesAsset(token: TokenRow, asset: string, chain = "") {
  const normalizedAsset = normalizeAssetQuery(asset);
  const normalizedChain = normalizeAssetQuery(chain);

  if (!normalizedAsset) return false;

  const assetMatches = [token.symbol, token.name]
    .map(normalizeAssetQuery)
    .some((value) => value === normalizedAsset || value.includes(normalizedAsset));

  if (!assetMatches) return false;
  if (!normalizedChain) return true;

  const tokenChain = normalizeAssetQuery(token.chainName);
  return tokenChain === normalizedChain || tokenChain.includes(normalizedChain);
}

export function findPreferredToken(tokens: TokenRow[], asset: string, chain = "") {
  if (!asset) return null;

  return (
    tokens.find((token) => matchesAsset(token, asset, chain)) ??
    tokens.find((token) => matchesAsset(token, asset)) ??
    null
  );
}

/* ── Amount validation ─────────────────────────────────────── */

export function getAmountValidationMessage(
  amount: string,
  selectedToken: TokenRow | null,
  totalPrimaryAssetsInUSD: number | null,
) {
  if (!amount.trim()) return null;

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return "Masukkan jumlah yang valid.";
  }

  const estimatedAmountInUSD = getEstimatedAmountInUSD(numericAmount, selectedToken);

  if (
    totalPrimaryAssetsInUSD !== null &&
    estimatedAmountInUSD !== null &&
    estimatedAmountInUSD > totalPrimaryAssetsInUSD
  ) {
    return `Universal Balance belum cukup. Estimasi kebutuhan ${formatUsd(estimatedAmountInUSD)}, tersedia ${formatUsd(totalPrimaryAssetsInUSD)}.`;
  }

  return null;
}

/* ── Recipient validation ──────────────────────────────────── */

export function isRecipientValidForToken(recipient: Recipient, selectedToken: TokenRow) {
  if (selectedToken.chainId === CHAIN_ID.SOLANA_MAINNET) {
    return isValidSolanaAddress(recipient.address);
  }
  return isValidAddress(recipient.address);
}

/* ── Error helpers ─────────────────────────────────────────── */

export function isUserRejectedError(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause);
  return /reject|denied|cancel/i.test(message);
}

export function getSendErrorMessage(cause: unknown) {
  const message = cause instanceof Error ? cause.message : String(cause || "");
  const normalized = message.toLowerCase();

  if (normalized.includes("insufficient")) {
    return "Saldo belum cukup untuk amount atau biaya jaringan.";
  }
  if (normalized.includes("blockhash")) {
    return "Jaringan sedang berubah cepat. Coba kirim ulang sebentar lagi.";
  }
  if (normalized.includes("timeout") || normalized.includes("network")) {
    return "Koneksi ke jaringan sedang lambat. Coba lagi dalam beberapa detik.";
  }

  return message || "Gagal mengirim transaksi.";
}

/* ── Recipient search / resolve ────────────────────────────── */

export function matchesRecipient(recipient: Recipient, query: string) {
  const normalized = query.toLowerCase();
  return (
    recipient.handle.toLowerCase().includes(normalized) ||
    recipient.name.toLowerCase().includes(normalized) ||
    recipient.address.toLowerCase().includes(normalized) ||
    recipient.network.toLowerCase().includes(normalized)
  );
}

export function resolveRecipient(query: string): Recipient | null {
  const trimmed = query.trim();
  if (!trimmed) return null;

  const known = [...addressBook, ...recentRecipients].find((recipient) => {
    return (
      recipient.handle.toLowerCase() === trimmed.toLowerCase() ||
      recipient.handle.toLowerCase().includes(trimmed.toLowerCase()) ||
      recipient.name.toLowerCase().includes(trimmed.toLowerCase())
    );
  });

  if (known) return known;

  if (isValidAddress(trimmed) || isValidSolanaAddress(trimmed)) {
    return {
      ...scannedRecipient,
      id: "typed-address",
      handle: "Wallet address",
      name: "External wallet",
      address: trimmed,
      network: isValidSolanaAddress(trimmed) ? "Solana" : "EVM",
    };
  }

  return null;
}

export { ZERO_ADDRESS };
