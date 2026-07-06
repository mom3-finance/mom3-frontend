export type Mom3AuthProvider = "google" | "apple" | "email" | "unknown";

export type Mom3WalletSession = {
  token: string;
  ownerAddress: string;
  email?: string;
  issuer?: string;
  provider: Mom3AuthProvider;
};

const SESSION_KEY = "mom3-wallet-session";

export function getWalletSession(): Mom3WalletSession | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Mom3WalletSession) : null;
  } catch {
    return null;
  }
}

export function saveWalletSession(session: Mom3WalletSession) {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.localStorage.setItem("token", session.token);
  window.localStorage.setItem("user", session.ownerAddress);
  window.localStorage.setItem("loginMethod", session.provider);
}

export function clearWalletSession() {
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem("token");
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("loginMethod");
}

export function truncateAddress(address: string, chars = 4) {
  if (!address) return "";
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
