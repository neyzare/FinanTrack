import type { Stock, Bougie, BougieChart, Timeframe } from "@/app/types/stock";
import { TIMEFRAME_DUREES_SEC, TIMEFRAME_NB_BOUGIES } from "@/app/types/stock";

export function gaussienne(): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export function calculerNouveauPrix(
    prixActuel: number,
    volatilite: number,
    drift: number,
    chocSectoriel: number = 0,
): number {
    const chocNews = Math.random() < 0.005 ? (Math.random() - 0.5) * 0.10 : 0;
    const rendement = drift + chocSectoriel + gaussienne() * volatilite + chocNews;
    return Math.max(0.01, +(prixActuel * Math.exp(rendement)).toFixed(2));
}

export function genererChocsSectoriels(secteurs: string[]): Record<string, number> {
    const chocs: Record<string, number> = {};
    const uniques = [...new Set(secteurs)];
    for (const s of uniques) {
        chocs[s] = gaussienne() * 0.003;
    }
    return chocs;
}

export function calculerVariation(prixActuel: number, prixInitial: number): number {
    return +(((prixActuel - prixInitial) / prixInitial) * 100).toFixed(2);
}

export function tickStocks(stocks: Stock[]): Stock[] {
    const chocs = genererChocsSectoriels(stocks.map(s => s.secteur));
    return stocks.map(stock => {
        const nouveauPrix = calculerNouveauPrix(
            stock.price,
            stock.volatility,
            stock.drift,
            chocs[stock.secteur],
        );
        return {
            ...stock,
            price: nouveauPrix,
            variation: calculerVariation(nouveauPrix, stock.initialPrice),
        };
    });
}

const TICKS_PAR_BOUGIE = 20;

export function genererHistoriqueBougies(
    prixDepart: number,
    volatilite: number,
    drift: number,
    timeframe: Timeframe,
): Bougie[] {
    const nbBougies = TIMEFRAME_NB_BOUGIES[timeframe];
    const duree = TIMEFRAME_DUREES_SEC[timeframe];
    const now = Math.floor(Date.now() / 1000);
    const debutTotal = now - nbBougies * duree;

    const bougies: Bougie[] = [];
    let prixCourant = prixDepart;

    const volAjustee = volatilite * Math.sqrt(duree / 60);
    const driftAjuste = drift * (duree / 60);
    const volTick = volAjustee / Math.sqrt(TICKS_PAR_BOUGIE);
    const driftTick = driftAjuste / TICKS_PAR_BOUGIE;

    for (let i = 0; i < nbBougies; i++) {
        const open = prixCourant;
        let high = open;
        let low = open;
        let close = open;

        for (let t = 0; t < TICKS_PAR_BOUGIE; t++) {
            const r = driftTick + gaussienne() * volTick;
            close = Math.max(0.01, +(close * Math.exp(r)).toFixed(2));
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