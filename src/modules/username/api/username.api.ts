export type UsernameIdentity = {
  username: string;
  owner_address: string;
  address: string | null;
  addresses: Record<string, string>;
};

export async function resolveUsername(username: string, chainId: number) {
  const response = await fetch(`/api/usernames/${encodeURIComponent(username)}?chain_id=${chainId}`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Username was not found on this chain.");
  return payload.identity as UsernameIdentity;
}

export async function claimUsername(username: string, ownerAddress: string, chainId: number, address: string) {
  const response = await fetch("/api/usernames", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, owner_address: ownerAddress, chain_id: chainId, address }), cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Unable to claim username.");
  return payload.identity as UsernameIdentity;
}

export async function getMyUsername(ownerAddress: string) {
  const response = await fetch(`/api/usernames/owner/${encodeURIComponent(ownerAddress)}`, { cache: "no-store" });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Unable to load username.");
  return payload.identity as UsernameIdentity | null;
}
