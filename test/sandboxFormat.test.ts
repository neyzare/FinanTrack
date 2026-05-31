import { describe, it, expect } from "vitest";
import { computeMaxQuantity, formatEur } from "@/app/dashboard/sandbox/utils/format";
import type { Stock } from "@/app/types/stock";
import type { Position } from "@/app/types/Sandbox";

const normalize = (s: string) => s.replace(/\s/g, " ");

const stock: Stock = {
    name: "Faizer",
    secteur: "Santé",
    price: 100,
    initialPrice: 100,
    variation: 0,
};

describe("formatEur", () => {
    it("formate un montant avec deux décimales", () => {
        expect(normalize(formatEur(1234.5))).toBe("1 234,50");
    });

    it("formate zéro", () => {
        expect(formatEur(0)).toBe("0,00");
    });

    it("formate un montant négatif", () => {
        expect(formatEur(-42.1)).toBe("-42,10");
    });
});

describe("computeMaxQuantity", () => {
    it("retourne 0 si aucune action n'est sélectionnée", () => {
        expect(computeMaxQuantity("achat", null, 1000, {})).toBe(0);
    });

    it("calcule la quantité maximale achetable selon la liquidité", () => {
        expect(computeMaxQuantity("achat", stock, 250, {})).toBe(2);
    });

    it("retourne 0 quand la liquidité est insuffisante pour une action", () => {
        expect(computeMaxQuantity("achat", stock, 50, {})).toBe(0);
    });

    it("retourne la quantité détenue pour une vente", () => {
        const positions: Record<string, Position> = {
            Faizer: { stockName: "Faizer", quantity: 5, avgBuyPrice: 90 },
        };
        expect(computeMaxQuantity("vente", stock, 0, positions)).toBe(5);
    });

    it("retourne 0 pour une vente sans position", () => {
        expect(computeMaxQuantity("vente", stock, 0, {})).toBe(0);
    });
});
