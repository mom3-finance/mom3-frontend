import { formatUnits } from "ethers";

export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function parseDecimalish(value: string | number | bigint | null | undefined, decimals = 18) {
  if (value === null || value === undefined || value === "") return 0;

  if (typeof value === "bigint") {
    try {
      return Number(formatUnits(value, decimals));
    } catch {
      return 0;
    }
  }

  if (typeof value === "number") return Number.isFinite(value) ? value : 0;

  const trimmed = value.trim();
  if (!trimmed) return 0;

  if (/^0x[0-9a-fA-F]+$/.test(trimmed)) {
    try {
      return Number(formatUnits(BigInt(trimmed), decimals));
    } catch {
      return 0;
    }
  }

  if (/^\d+$/.test(trimmed)) {
    try {
      return Number(formatUnits(BigInt(trimmed), decimals));
    } catch {
      return 0;
    }
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : 0;
}
