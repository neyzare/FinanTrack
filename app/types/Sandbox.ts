import type { Bougie, Timeframe } from "@/app/types/stock";

export interface Stocksandbox {
    name: string;
    secteur: string;
    price: number;
    volatility: number;
    drift: number;
    initialPrice: number;
    variation: number;
}

export interface Position {
    stockName: string;
    quantity: number;
    avgBuyPrice: number;
}

export type OrderType = "achat" | "vente";

export type BougiesMap = Record<string, Record<Timeframe, Bougie[]>>;

export interface Transaction {
    type: OrderType;
    stockName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    timestamp: Date;
}