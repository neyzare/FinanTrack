"use client";

import type { StockWithQuoteAndIndustry } from "@/app/lib/stocks-db";
import { calculerStats, calculerDistributionSecteurs } from "./utils/calculs";
import { EmptyState } from "./components/EmptyState";
import { StatsCards } from "./components/StatsCards";
import { SectorAllocation } from "./components/SectorAllocation";
import { TopHoldings } from "./components/TopHoldings";

interface PortefeuilleProps {
    stocks: StockWithQuoteAndIndustry[];
}

export default function Portefeuille({ stocks }: PortefeuilleProps) {
    if (stocks.length === 0) return <EmptyState />;

    const { totalValue, totalGain, gainPercent } = calculerStats(stocks);
    const sectorDistribution = calculerDistributionSecteurs(stocks, totalValue);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl mb-2">Portefeuille</h1>
                <p className="text-muted-foreground">
                    Vue complète de votre portefeuille d&apos;investissement
                </p>
            </div>

            <StatsCards totalValue={totalValue} totalGain={totalGain} gainPercent={gainPercent} />
            <SectorAllocation sectors={sectorDistribution} />
            <TopHoldings stocks={stocks} totalValue={totalValue} />
        </div>
    );
}
