import type { Stock, Bougie, Timeframe } from "@/app/types/stock";
import type { BougiesMap, OrderType, Position } from "@/app/types/Sandbox";
import { genererHistoriqueBougies } from "@/app/lib/stockSimulation";

export const TIMEFRAMES: Timeframe[] = ["1m", "5m", "1h", "4h", "1j", "1M"];

export function buildInitialBougiesMap(stocks: Stock[]): BougiesMap {
  const map: BougiesMap = {};
  for (const stock of stocks) {
    const parTimeframe = {} as Record<Timeframe, Bougie[]>;
    for (const tf of TIMEFRAMES) {
      parTimeframe[tf] = genererHistoriqueBougies(stock.price, tf);
    }
    map[stock.name] = parTimeframe;
  }
  return map;
}

export function formatTimeLabel(ts: number, timeframe: Timeframe): string {
  const d = new Date(ts * 1000);
  if (timeframe === "1j" || timeframe === "1M") {
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
  }
  return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

export function formatEur(n: number): string {
  return n.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function computeMaxQuantity(
  type: OrderType,
  stock: Stock | null,
  liquidite: number,
  positions: Record<string, Position>,
): number {
  if (!stock) return 0;
  if (type === "achat") return Math.floor(liquidite / stock.price);
  return positions[stock.name]?.quantity ?? 0;
}
