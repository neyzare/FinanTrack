import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import type { StockWithQuoteAndIndustry } from "@/app/lib/stocks-db";

interface TopHoldingsProps {
    stocks: StockWithQuoteAndIndustry[];
    totalValue: number;
}

export function TopHoldings({ stocks, totalValue }: TopHoldingsProps) {
    const topStocks = [...stocks].sort((a, b) => b.value - a.value).slice(0, 5);

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle>Principales positions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {topStocks.map((stock, index) => {
                        const percentage = totalValue > 0 ? (stock.value / totalValue) * 100 : 0;
                        const changePercent = stock.variation ?? 0;
                        const isUp = changePercent >= 0;
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
                                                    <span className="ml-2 text-xs">• {stock.industry}</span>
                                                )}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p>{stock.value.toFixed(2)} €</p>
                                            <Badge
                                                variant={isUp ? "default" : "destructive"}
                                                className={isUp ? "bg-[#22C55E] hover:bg-[#22C55E]/90" : ""}
                                            >
                                                {isUp ? "+" : ""}{changePercent.toFixed(2)}%
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
    );
}
