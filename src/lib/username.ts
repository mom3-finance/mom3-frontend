export function formatUsername(username?: string | null) {
  const value = String(username || "").trim().replace(/^@+/, "");
  return value ? `@${value}` : null;
}
