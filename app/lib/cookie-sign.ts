import { createHmac, timingSafeEqual } from "crypto";

let cachedSecret: string | null = null;

function getSecret(): string {
  if (cachedSecret !== null) return cachedSecret;
  const value = process.env.AUTH_COOKIE_SECRET;
  if (!value || value.length < 32) {
    throw new Error(
      "AUTH_COOKIE_SECRET manquant ou trop court (>= 32 caractères)",
    );
  }
  cachedSecret = value;
  return cachedSecret;
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function signValue(value: string): string {
  return `${value}.${sign(value)}`;
}

export function verifySignedValue(signed: string | undefined): string | null {
  if (!signed) return null;

  const dot = signed.lastIndexOf(".");
  if (dot < 0) return null;

  const value = signed.slice(0, dot);
  const sig = signed.slice(dot + 1);
  const expected = sign(value);

  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length) return null;

  if (!timingSafeEqual(sigBuf, expBuf)) return null;

  return value;
}
