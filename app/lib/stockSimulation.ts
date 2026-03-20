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
            stock.prix,
            stock.volatilite,
            stock.drift,
            chocs[stock.secteur],
        );
        return {
            ...stock,
            prix: nouveauPrix,
            variation: calculerVariation(nouveauPrix, stock.prixInitial),
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

// ─── Ajout d'une nouvelle bougie à un historique existant ────────────────────
// Appelé à chaque tick pour mettre à jour la dernière bougie ou en créer une.

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

export const STOCKS_INITIAUX: Stock[] = [
    { ticker: "AAPL",  name: "Apple Inc.",         secteur: "Technology",  prix: 179.75, prixInitial: 179.75, variation: 0, volatilite: 0.008,  drift: 0.0001  },
    { ticker: "MSFT",  name: "Microsoft Corp.",    secteur: "Technology",  prix: 372.79, prixInitial: 372.79, variation: 0, volatilite: 0.007,  drift: 0.00012 },
    { ticker: "TSLA",  name: "Tesla Inc.",         secteur: "Automotive",  prix: 241.10, prixInitial: 241.10, variation: 0, volatilite: 0.022,  drift: 0.0     },
    { ticker: "AMZN",  name: "Amazon.com Inc.",    secteur: "E-commerce",  prix: 147.39, prixInitial: 147.39, variation: 0, volatilite: 0.010,  drift: 0.00008 },
    { ticker: "NVDA",  name: "NVIDIA Corp.",       secteur: "Technology",  prix: 490.46, prixInitial: 490.46, variation: 0, volatilite: 0.020,  drift: 0.00015 },
    { ticker: "JPM",   name: "JPMorgan Chase",     secteur: "Finance",     prix: 157.63, prixInitial: 157.63, variation: 0, volatilite: 0.006,  drift: 0.00005 },
    { ticker: "META",  name: "Meta Platforms",     secteur: "Technology",  prix: 322.98, prixInitial: 322.98, variation: 0, volatilite: 0.015,  drift: 0.0001  },
    { ticker: "GOOGL", name: "Alphabet Inc.",      secteur: "Technology",  prix: 136.58, prixInitial: 136.58, variation: 0, volatilite: 0.009,  drift: 0.0001  },
    { ticker: "V",     name: "Visa Inc.",          secteur: "Finance",     prix: 279.45, prixInitial: 279.45, variation: 0, volatilite: 0.005,  drift: 0.00008 },
    { ticker: "WMT",   name: "Walmart Inc.",       secteur: "Retail",      prix: 68.90,  prixInitial: 68.90,  variation: 0, volatilite: 0.004,  drift: 0.00006 },
    { ticker: "XOM",   name: "ExxonMobil Corp.",   secteur: "Energy",      prix: 114.75, prixInitial: 114.75, variation: 0, volatilite: 0.012,  drift: 0.00003 },
    { ticker: "NFLX",  name: "Netflix Inc.",       secteur: "Technology",  prix: 628.90, prixInitial: 628.90, variation: 0, volatilite: 0.018,  drift: 0.00012 },
];
