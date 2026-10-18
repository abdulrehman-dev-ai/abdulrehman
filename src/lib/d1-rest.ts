// Server-side Cloudflare D1 REST client; never import in client components.
type D1Result = { results?: Record<string, unknown>[]; success?: boolean; error?: string };
export async function d1Query(sql: string, params: (string | number | null)[] = []) {
  const { CLOUDFLARE_ACCOUNT_ID: account, CLOUDFLARE_D1_DATABASE_ID: database, CLOUDFLARE_API_TOKEN: token } = process.env;
  if (!account || !database || !token) throw new Error("Durable database not configured");
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(account)}/d1/database/${encodeURIComponent(database)}/query`,
    { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ sql, params }), cache: "no-store" },
  );
  const payload = await response.json();
  const row = payload?.result?.[0] as D1Result | undefined;
  if (!response.ok || !payload?.success || !row?.success) {
    throw new Error("Cloudflare D1 query failed");
  }
  return row.results || [];
}
