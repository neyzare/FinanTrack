import type { Bougie, Timeframe } from "@/app/types/stock";

export interface Stocksandbox {
  name: string;
  secteur: string;
  price: number;
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

export type CandlesMap = Record<string, Partial<Record<Timeframe, Bougie>>>;

export interface SandboxState {
  liquidite: number;
  positions: Position[];
  historique: Transaction[];
  candles: CandlesMap;
}

export interface SavedCandle {
  stockName: string;
  timeframe: Timeframe;
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}
