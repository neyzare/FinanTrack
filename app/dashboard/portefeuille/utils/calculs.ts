import type { StockWithQuoteAndIndustry } from "@/app/lib/stocks-db";
import type { PortefeuilleStats, SectorSlice } from "../types";

const SECTOR_COLORS: Record<string, string> = {
  Technology: "#38BDF8",
  Healthcare: "#22C55E",
  Finance: "#8B5CF6",
  Automotive: "#F59E0B",
  "E-commerce": "#EC4899",
  Energy: "#EF4444",
  Consumer: "#06B6D4",
  Industrials: "#84CC16",
};

const FALLBACK_COLORS = ["#38BDF8", "#8B5CF6", "#22C55E", "#F59E0B", "#EC4899"];

export function getSectorColor(name: string, index: number): string {
  return SECTOR_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function calculerStats(
  stocks: StockWithQuoteAndIndustry[],
): PortefeuilleStats {
  const totalValue = stocks.reduce((acc, s) => acc + s.value, 0);
  const totalInvested = stocks.reduce(
    (acc, s) => acc + s.buyPrice * s.quantity,
    0,
  );
  const totalGain = totalValue - totalInvested;
  const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  return { totalValue, totalInvested, totalGain, gainPercent };
}

export function calculerDistributionSecteurs(
  stocks: StockWithQuoteAndIndustry[],
  totalValue: number,
): SectorSlice[] {
  const sectorMap = new Map<string, number>();
  for (const s of stocks) {
    const name = s.industry || "Autre";
    sectorMap.set(name, (sectorMap.get(name) ?? 0) + s.value);
  }
  return Array.from(sectorMap.entries())
    .map(([name], i) => ({
      name,
      value:
        totalValue > 0
          ? Math.round((sectorMap.get(name)! / totalValue) * 100)
          : 0,
      color: getSectorColor(name, i),
    }))
    .sort((a, b) => b.value - a.value);
}
