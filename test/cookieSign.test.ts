import { describe, it, expect } from "vitest";

process.env.AUTH_COOKIE_SECRET = "test-secret-cookie-key-min-32-characters";

import { signValue, verifySignedValue } from "@/app/lib/cookie-sign";

describe("verifySignedValue", () => {
    it("retourne la valeur d'origine pour un cookie signé valide", () => {
        const signed = signValue("user-123");
        expect(verifySignedValue(signed)).toBe("user-123");
    });

    it("retourne null si le cookie est absent", () => {
        expect(verifySignedValue(undefined)).toBeNull();
    });

    it("retourne null si le format est invalide (pas de séparateur)", () => {
        expect(verifySignedValue("valeur-sans-signature")).toBeNull();
    });
});
