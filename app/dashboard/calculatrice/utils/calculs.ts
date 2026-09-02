import type { DonneesGraphique } from "../types";

export function formatEuros(valeur: number): string {
  return `${valeur.toLocaleString("fr-FR")} €`;
}

interface ParamsInteretsComposes {
  capital: number;
  apportMensuel: number;
  tauxAnnuel: number;
  annees: number;
}

export function calculerInteretsComposes(
  params: ParamsInteretsComposes,
): DonneesGraphique[] {
  const { capital, apportMensuel, tauxAnnuel, annees } = params;
  if (annees < 0)
    throw new Error("Le nombre d'années ne peut pas être négatif");
  if (capital < 0 || apportMensuel < 0)
    throw new Error("Les montants ne peuvent pas être négatifs");

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
  if (annees < 0)
    throw new Error("Le nombre d'années ne peut pas être négatif");
  if (investissementInitial < 0)
    throw new Error("L'investissement initial ne peut pas être négatif");

  const donnees: DonneesGraphique[] = [];
  let valeur = investissementInitial;
  const taux = rendementAttendu / 100;

  for (let annee = 0; annee <= annees; annee++) {
    donnees.push({ annee, valeur: Math.round(valeur) });
    valeur = valeur * (1 + taux);
  }
  return donnees;
}
