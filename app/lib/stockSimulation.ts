import type { Stock, Bougie, BougieChart, Timeframe } from "@/app/types/stock";
import { TIMEFRAME_DUREES_SEC, TIMEFRAME_NB_BOUGIES } from "@/app/types/stock";

export const TICK_INTERVAL_MS = 3000;

const TICKS_PAR_BOUGIE = 20;
const VOLATILITE = 0.03;

function variationTick(prix: number): number {
    const pourcentage = (Math.random() - 0.5) * 2 * VOLATILITE;
    const nouveauPrix = prix * (1 + pourcentage);
    return Math.max(0.01, +nouveauPrix.toFixed(2));
}

export function calculerVariation(prixActuel: number, prixInitial: number): number {
    return +(((prixActuel - prixInitial) / prixInitial) * 100).toFixed(2);
}

export function tickStocks(stocks: Stock[]): Stock[] {
    return stocks.map(stock => {
        const nouveauPrix = variationTick(stock.price);
        return {
            ...stock,
            price: nouveauPrix,
            variation: calculerVariation(nouveauPrix, stock.initialPrice),
        };
    });
}

export function genererHistoriqueBougies(
    prixDepart: number,
    timeframe: Timeframe,
): Bougie[] {
    const nbBougies = TIMEFRAME_NB_BOUGIES[timeframe];
    const duree = TIMEFRAME_DUREES_SEC[timeframe];
    const now = Math.floor(Date.now() / 1000);
    const debutTotal = now - nbBougies * duree;

    const bougies: Bougie[] = [];
    let prixCourant = prixDepart;

    for (let i = 0; i < nbBougies; i++) {
        const open = prixCourant;
        let high = open;
        let low = open;
        let close = open;

        for (let t = 0; t < TICKS_PAR_BOUGIE; t++) {
            close = variationTick(close);
            if (close > high) high = close;
            if (close < low) low = close;
        }

        bougies.push({
            time: debutTotal + i * duree,
            open: +open.toFixed(2),
            high: +high.toFixed(2),
            low: +low.toFixed(2),
            close: +close.toFixed(2),
        });

        prixCourant = close;
    }

    return bougies;
}


export function mettreAJourBougies(
    bougies: Bougie[],
    nouveauPrix: number,
    timeframe: Timeframe,
): Bougie[] {
    const duree = TIMEFRAME_DUREES_SEC[timeframe];
    const maxBougies = TIMEFRAME_NB_BOUGIES[timeframe];
    const now = Math.floor(Date.now() / 1000);
    const copie = [...bougies];

    if (copie.length === 0) {
        copie.push({ time: now, open: nouveauPrix, high: nouveauPrix, low: nouveauPrix, close: nouveauPrix });
        return copie;
    }

    const derniere = copie[copie.length - 1];

    const tempsPasse = now - derniere.time;

    if (tempsPasse < duree) {
        copie[copie.length - 1] = {
            ...derniere,
            high: Math.max(derniere.high, nouveauPrix),
            low: Math.min(derniere.low, nouveauPrix),
            close: nouveauPrix,
        };
    } else {
        copie.push({
            time: derniere.time + duree,
            open: derniere.close,
            high: Math.max(derniere.close, nouveauPrix),
            low: Math.min(derniere.close, nouveauPrix),
            close: nouveauPrix,
        });
    }

    if (copie.length > maxBougies) {
        copie.splice(0, copie.length - maxBougies);
    }

    return copie;
}


export function bougiePourChart(b: Bougie): BougieChart {
    const bodyBottom = Math.min(b.open, b.close);
    const bodyTop = Math.max(b.open, b.close);
    const bodyCenter = (bodyBottom + bodyTop) / 2;
    return {
        ...b,
        isBullish: b.close >= b.open,
        barDataKey: [bodyBottom, bodyTop],
        whiskerDataKey: [bodyCenter - b.low, b.high - bodyCenter],
    };
}