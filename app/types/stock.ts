export interface Stock {
    name: string;
    secteur: string;
    price: number;
    volatilite: number;
    drift: number;
}

export interface Bougie {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface BougieChart extends Bougie {
    isBullish: boolean;
    barDataKey: [number, number];
    whiskerDataKey: [number, number];
}

export type Timeframe = "1m" | "5m" | "1h" | "4h" | "1j" | "1M";

export const TIMEFRAME_LABELS: Record<Timeframe, string> = {
    "1m": "1 min",
    "5m": "5 min",
    "1h": "1 heure",
    "4h": "4 heures",
    "1j": "1 jour",
    "1M": "1 mois",
};

export const TIMEFRAME_DUREES_SEC: Record<Timeframe, number> = {
    "1m":  60,
    "5m":  300,
    "1h":  3600,
    "4h":  14400,
    "1j":  86400,
    "1M":  2592000,
};

export const TIMEFRAME_NB_BOUGIES: Record<Timeframe, number> = {
    "1m":  60,
    "5m":  48,
    "1h":  24,
    "4h":  30,
    "1j":  30,
    "1M":  12,
};
