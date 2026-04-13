import { createHmac, timingSafeEqual } from "node:crypto";

export type AdminSessionPayload = {
  userId: string;
  name: string;
  email: string;
  role: "ADMIN";
  exp: number;
};

const COOKIE_NAME = "giftflow_admin_session";
const ONE_DAY_SECONDS = 60 * 60 * 24;

function getSecret() {
  return process.env.ADMIN_SESSION_SECRET ?? "giftflow-dev-secret-change-me";
}

function sign(raw: string) {
  return createHmac("sha256", getSecret()).update(raw).digest("hex");
}

function safeCompare(a: string, b: string) {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

export function createAdminSessionToken(
  data: Omit<AdminSessionPayload, "exp">,
  maxAgeSeconds = ONE_DAY_SECONDS
) {
  const payload: AdminSessionPayload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null): AdminSessionPayload | null {
  if (!token) return null;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  if (!safeCompare(signature, expected)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8")
    ) as AdminSessionPayload;
    if (!payload?.exp || payload.exp < Math.floor(Date.now() / 1000)) return null;
    if (payload.role !== "ADMIN") return null;
    return payload;
  } catch {
    return null;
  }
}

export const adminSessionCookieName = COOKIE_NAME;

