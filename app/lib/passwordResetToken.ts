import { randomBytes, createHash } from "crypto"

export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000 // 30 minutes

export function generateResetToken(): string {
    return randomBytes(32).toString("base64url")
}

export function hashToken(rawToken: string): string {
    return createHash("sha256").update(rawToken).digest("hex")
}

export function getResetTokenExpiry(): Date {
    return new Date(Date.now() + RESET_TOKEN_TTL_MS)
}