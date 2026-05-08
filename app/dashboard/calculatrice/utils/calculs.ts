import type { DonneesGraphique } from "../types";

export function formatEuros(valeur: number): string {
    return `${valeur.toLocaleString('fr-FR')} €`;
}

interface ParamsInteretsComposes {
    capital: number;
    apportMensuel: number;
    tauxAnnuel: number;
    annees: number;
}

export function calculerInteretsComposes(params: ParamsInteretsComposes): DonneesGraphique[] {
    const { capital, apportMensuel, tauxAnnuel, annees } = params;
    const donnees: DonneesGraphique[] = [];
    let solde = capital;
    const tauxMensuel = tauxAnnuel / 100 / 12;

    for (let annee = 0; annee <= annees; annee++) {
        donnees.push({ annee, valeur: Math.round(solde) });
        for (let mois = 0; mois < 12; mois++) {
            solde = solde * (1 + tauxMensuel) + apportMensuel;
        }
    }
    return donnees;
}

interface ParamsRendement {
    investissementInitial: number;
    rendementAttendu: number;
    annees: number;
}

export function calculerRendement(params: ParamsRendement): DonneesGraphique[] {
    const { investissementInitial, rendementAttendu, annees } = params;
    const donnees: DonneesGraphique[] = [];
    let valeur = investissementInitial;
    const taux = rendementAttendu / 100;

    for (let annee = 0; annee <= annees; annee++) {
        donnees.push({ annee, valeur: Math.round(valeur) });
        valeur = valeur * (1 + taux);
    }
    return donnees;
}
