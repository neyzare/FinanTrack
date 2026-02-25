"use client";

import type { StockWithQuoteAndIndustry } from "@/app/lib/stocks-db";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    PieChart,
    Target,
    Sparkles,
} from "lucide-react";

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

function getSectorColor(name: string, index: number): string {
    return SECTOR_COLORS[name] ?? ["#38BDF8", "#8B5CF6", "#22C55E", "#F59E0B", "#EC4899"][index % 5];
}

interface PortefeuilleProps {
    stocks: StockWithQuoteAndIndustry[];
}

export default function Portefeuille({ stocks }: PortefeuilleProps) {
    if (stocks.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl mb-2">Portefeuille</h1>
                    <p className="text-muted-foreground">
                        Vue complète de votre portefeuille d&apos;investissement
                    </p>
                </div>
                <div className="p-12 text-center text-muted-foreground border rounded-lg">
                    <p className="text-lg">Aucune action en portefeuille</p>
                    <p className="text-sm mt-2">Ajoutez des actions depuis la page Mes Actions</p>
                </div>
            </div>
        );
    }

    const totalValue = stocks.reduce((acc, s) => acc + s.value, 0);
    const totalInvested = stocks.reduce((acc, s) => acc + s.buyPrice * s.quantity, 0);
    const totalGain = totalValue - totalInvested;
    const gainPercent = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

    const sectorMap = new Map<string, number>();
    for (const s of stocks) {
        const name = s.industry || "Autre";
        sectorMap.set(name, (sectorMap.get(name) ?? 0) + s.value);
    }
    const sectorDistribution = Array.from(sectorMap.entries())
        .map(([name], i) => ({
            name,
            value: totalValue > 0 ? Math.round((sectorMap.get(name)! / totalValue) * 100) : 0,
            color: getSectorColor(name, i),
        }))
        .sort((a, b) => b.value - a.value);

    const stats = [
        {
            label: "Valeur totale",
            value: `${totalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
            icon: DollarSign,
            color: "text-[#38BDF8]",
        },
        {
            label: "Plus-value",
            value: `${totalGain.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
            icon: gainPercent >= 0 ? TrendingUp : TrendingDown,
            color: gainPercent >= 0 ? "text-[#22C55E]" : "text-[#EF4444]",
        },
        {
            label: "Performance",
            value: `${gainPercent >= 0 ? "+" : ""}${gainPercent.toFixed(2)}%`,
            icon: Target,
            color: gainPercent >= 0 ? "text-[#22C55E]" : "text-[#EF4444]",
        },
    ];

    const topStocks = [...stocks].sort((a, b) => b.value - a.value).slice(0, 5);

    const techPct = sectorDistribution.find((s) => s.name === "Technology")?.value ?? 0;
    const autoPct = sectorDistribution.find((s) => s.name === "Automotive")?.value ?? 0;
    const ecomPct = sectorDistribution.find((s) => s.name === "E-commerce")?.value ?? 0;
    const financePct = sectorDistribution.find((s) => s.name === "Finance")?.value ?? 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl mb-2">Portefeuille</h1>
                <p className="text-muted-foreground">
                    Vue complète de votre portefeuille d&apos;investissement
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-2">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                                <p className={`text-2xl ${stat.color}`}>{stat.value}</p>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card className="border-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Allocation par secteur
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {sectorDistribution.map((sector) => (
                        <div key={sector.name} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: sector.color }}
                                    />
                                    <span>{sector.name}</span>
                                </div>
                                <span className="text-muted-foreground">{sector.value}%</span>
                            </div>
                            <Progress value={sector.value} className="h-2" />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Top Holdings */}
            <Card className="border-2">
                <CardHeader>
                    <CardTitle>Principales positions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {topStocks.map((stock, index) => {
                            const percentage = totalValue > 0 ? (stock.value / totalValue) * 100 : 0;
                            const changePercent = stock.variation ?? 0;
                            return (
                                <div key={stock.id} className="flex items-center gap-4">
                                    <div className="w-8 h-8 bg-gradient-to-br from-[#38BDF8] to-[#22C55E] rounded-lg flex items-center justify-center text-white text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <div>
                                                <p>{stock.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {stock.ticker}
                                                    {stock.industry && (
                                                        <span className="ml-2 text-xs">
                                                            • {stock.industry}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p>{stock.value.toFixed(2)} €</p>
                                                <Badge
                                                    variant={changePercent >= 0 ? "default" : "destructive"}
                                                    className={
                                                        changePercent >= 0
                                                            ? "bg-[#22C55E] hover:bg-[#22C55E]/90"
                                                            : ""
                                                    }
                                                >
                                                    {changePercent >= 0 ? "+" : ""}
                                                    {changePercent.toFixed(2)}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <Progress value={percentage} className="h-1.5" />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {percentage.toFixed(1)}% du portefeuille
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
