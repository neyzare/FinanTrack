import { Activity, Gauge, TrendingUp, Waves } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";

interface IndicatorCardsProps {
    rsi: number;
    macd: number;
    sma50: number;
    sma200: number;
    volatility: number;
}

export function IndicatorCards({ rsi, macd, sma50, sma200, volatility }: IndicatorCardsProps) {
    const indicators = [
        { name: "RSI (14)", icon: Gauge, valeur: rsi.toFixed(1), description: "surachat > 70, survente < 30" },
        { name: "MACD", icon: Activity, valeur: macd.toFixed(2) },
        { name: "SMA 50", icon: TrendingUp, valeur: `${sma50.toFixed(2)} $`, description: `SMA 200 : ${sma200.toFixed(2)} $` },
        { name: "Volatilité", icon: Waves, valeur: `${volatility.toFixed(1)} %`, description: "annualisée" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {indicators.map((indicator, index) => {
                const Icon = indicator.icon;
                return (
                    <Card key={index} className="border-2">
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-muted-foreground">{indicator.name}</p>
                                <Icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <p className="text-2xl font-bold">{indicator.valeur}</p>
                            {"description" in indicator && indicator.description && (
                                <p className="text-xs text-muted-foreground mt-1">{indicator.description}</p>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
