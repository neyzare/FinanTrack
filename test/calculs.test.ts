import { describe, it, expect } from "vitest";
import {
    calculerInteretsComposes,
    calculerRendement,
    formatEuros,
} from "@/app/dashboard/calculatrice/utils/calculs";

const normalize = (s: string) => s.replace(/\s/g, " ");

describe("calculerInteretsComposes", () => {
    it("retourne uniquement le capital initial quand annees = 0", () => {
        const r = calculerInteretsComposes({ capital: 1000, apportMensuel: 0, tauxAnnuel: 5, annees: 0 });
        expect(r).toEqual([{ annee: 0, valeur: 1000 }]);
    });

    it("capitalise sur un an sans apport", () => {
        const r = calculerInteretsComposes({ capital: 1000, apportMensuel: 0, tauxAnnuel: 12, annees: 1 });
        expect(r).toHaveLength(2);
        expect(r[0]).toEqual({ annee: 0, valeur: 1000 });
        expect(r[1]).toEqual({ annee: 1, valeur: 1127 });
    });

    it("ajoute les apports mensuels sans intérêts", () => {
        const r = calculerInteretsComposes({ capital: 0, apportMensuel: 100, tauxAnnuel: 0, annees: 1 });
        expect(r[1]).toEqual({ annee: 1, valeur: 1200 });
    });
});

describe("calculerRendement", () => {
    it("retourne uniquement l'investissement initial quand annees = 0", () => {
        const r = calculerRendement({ investissementInitial: 1000, rendementAttendu: 10, annees: 0 });
        expect(r).toEqual([{ annee: 0, valeur: 1000 }]);
    });

    it("applique le rendement composé sur plusieurs années", () => {
        const r = calculerRendement({ investissementInitial: 1000, rendementAttendu: 10, annees: 2 });
        expect(r).toEqual([
            { annee: 0, valeur: 1000 },
            { annee: 1, valeur: 1100 },
            { annee: 2, valeur: 1210 },
        ]);
    });
});

describe("gestion d'erreur", () => {
    it("refuse un nombre d'années négatif (intérêts composés)", () => {
        expect(() =>
            calculerInteretsComposes({ capital: 1000, apportMensuel: 0, tauxAnnuel: 5, annees: -1 })
        ).toThrow("Le nombre d'années ne peut pas être négatif");
    });

    it("refuse un capital négatif (intérêts composés)", () => {
        expect(() =>
            calculerInteretsComposes({ capital: -100, apportMensuel: 0, tauxAnnuel: 5, annees: 1 })
        ).toThrow("Les montants ne peuvent pas être négatifs");
    });

    it("refuse un nombre d'années négatif (rendement)", () => {
        expect(() =>
            calculerRendement({ investissementInitial: 1000, rendementAttendu: 10, annees: -1 })
        ).toThrow("Le nombre d'années ne peut pas être négatif");
    });

    it("refuse un investissement initial négatif", () => {
        expect(() =>
            calculerRendement({ investissementInitial: -1000, rendementAttendu: 10, annees: 2 })
        ).toThrow("L'investissement initial ne peut pas être négatif");
    });
});

describe("formatEuros", () => {
    it("ajoute le symbole euro après la valeur", () => {
        expect(normalize(formatEuros(1234))).toBe("1 234 €");
    });

    it("formate zéro", () => {
        expect(formatEuros(0)).toBe("0 €");
    });
});
