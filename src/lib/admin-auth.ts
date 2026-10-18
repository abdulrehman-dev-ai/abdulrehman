import { createHmac, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "portfolio_admin";
const TTL_SECONDS = 60 * 60 * 8;

function signingKey() {
  const key = process.env.ADMIN_SESSION_SECRET;
  if (!key || key.length < 32) throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters");
  return key;
}

export function verifyPassword(password: string) {
  const encoded = process.env.ADMIN_PASSWORD_SCRYPT;
  if (!encoded) return false;
  const [salt, hash] = encoded.split(":");
  if (!salt || !/^[a-f0-9]{128}$/i.test(hash || "")) return false;
  const derived = scryptSync(password, salt, 64);
  return timingSafeEqual(derived, Buffer.from(hash, "hex"));
}

export function sessionCookieName() { return COOKIE; }

export function mintSession() {
  const expires = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload = String(expires);
  const signature = createHmac("sha256", signingKey()).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

export async function isAdminAuthenticated() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [expiry, signature] = token.split(".");
  if (!/^\d+$/.test(expiry || "") || !/^[a-f0-9]{64}$/i.test(signature || "")) return false;
  if (Number(expiry) <= Math.floor(Date.now() / 1000)) return false;
  try {
    const expected = createHmac("sha256", signingKey()).update(expiry).digest();
    return timingSafeEqual(expected, Buffer.from(signature, "hex"));
  } catch { return false; }
}

export const adminCookieOptions = {
  httpOnly: true, secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const, path: "/", maxAge: TTL_SECONDS,
};
