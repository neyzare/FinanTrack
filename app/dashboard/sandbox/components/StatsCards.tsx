import { Activity, ChartBar, DollarSign, Wallet } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { formatEur } from "../utils/format";

interface StatsCardsProps {
  valeurTotale: number;
  liquidite: number;
  valeurActions: number;
  nbTransactions: number;
}

export function StatsCards({
  valeurTotale,
  liquidite,
  valeurActions,
  nbTransactions,
}: StatsCardsProps) {
  const stats = [
    {
      name: "Valeur Totale",
      icon: Wallet,
      valeur: `${formatEur(valeurTotale)} €`,
    },
    {
      name: "Liquidité",
      icon: DollarSign,
      valeur: `${formatEur(liquidite)} €`,
      description: "Disponible pour le trading",
    },
    {
      name: "Valeur Actions",
      icon: ChartBar,
      valeur: `${formatEur(valeurActions)} €`,
    },
    {
      name: "Transactions",
      icon: Activity,
      valeur: `${nbTransactions}`,
      description: "total exécutées",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-2xl font-bold">{stat.valeur}</p>
              {"description" in stat && stat.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
