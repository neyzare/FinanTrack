import { Card, CardContent } from "@/app/components/ui/card";
import { DollarSign, Target, TrendingDown, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalValue: number;
  totalGain: number;
  gainPercent: number;
}

export function StatsCards({
  totalValue,
  totalGain,
  gainPercent,
}: StatsCardsProps) {
  const isProfit = gainPercent >= 0;
  const stats = [
    {
      label: "Valeur totale",
      value: `${totalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      icon: DollarSign,
      color: "text-primary",
    },
    {
      label: "Plus-value",
      value: `${totalGain.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`,
      icon: isProfit ? TrendingUp : TrendingDown,
      color: isProfit ? "text-success" : "text-destructive",
    },
    {
      label: "Performance",
      value: `${isProfit ? "+" : ""}${gainPercent.toFixed(2)}%`,
      icon: Target,
      color: isProfit ? "text-success" : "text-destructive",
    },
  ];

  return (
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
  );
}
