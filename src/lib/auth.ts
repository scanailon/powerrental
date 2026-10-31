import { SignJWT, jwtVerify } from "jose";
import { scryptSync, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "pr_admin";

const ALG = "HS256";
const SESSION_TTL = 60 * 60 * 24 * 7; // 7 días

function getSecret() {
  const secret = process.env.PR_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "PR_JWT_SECRET no configurado o demasiado corto (mín. 32 caracteres).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signSession() {
  return new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL}s`)
    .sign(getSecret());
}

export async function verifySession(token: string | undefined) {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret(), { algorithms: [ALG] });
    return true;
  } catch {
    return false;
  }
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL,
  };
}

/** PR_ADMIN_HASH = "<salt hex>:<hash hex>" generado con scrypt (ver scripts/gen-admin-hash.mjs). */
export function verifyPassword(password: string) {
  const stored = process.env.PR_ADMIN_HASH;
  if (!stored || !stored.includes(":")) return false;
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  try {
    const salt = Buffer.from(saltHex, "hex");
    const expected = Buffer.from(hashHex, "hex");
    const actual = scryptSync(password, salt, expected.length);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

/* ── Rate limit de login (en memoria, por IP) ── */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const attempts = new Map<string, { count: number; firstAt: number }>();

export function getClientIP(h: Headers) {
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

export function loginRateLimit(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && now - entry.firstAt > WINDOW_MS) attempts.delete(ip);
  const current = attempts.get(ip);
  if (current && current.count >= MAX_ATTEMPTS) {
    return {
      ok: false,
      retryAfter: Math.ceil((current.firstAt + WINDOW_MS - now) / 1000),
    };
  }
  return { ok: true, retryAfter: 0 };
}

export function recordFailedLogin(ip: string) {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now });
  } else {
    entry.count += 1;
  }
}

export function clearFailedLogins(ip: string) {
  attempts.delete(ip);
}
