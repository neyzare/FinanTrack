import { TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { Stock } from "@/app/types/stock";
import type { OrderType, Position } from "@/app/types/Sandbox";
import { formatEur } from "../utils/format";

interface MarketTableProps {
  stocks: Stock[];
  positions: Record<string, Position>;
  liquidite: number;
  nameSelectionne: string;
  onSelectStock: (name: string) => void;
  onOrder: (stock: Stock, type: OrderType) => void;
}

export function MarketTable({
  stocks,
  positions,
  liquidite,
  nameSelectionne,
  onSelectStock,
  onOrder,
}: MarketTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions Disponibles</CardTitle>
        <p className="text-sm text-muted-foreground">
          Prix actualisés toutes les 3 secondes
        </p>
      </CardHeader>

      <CardContent className="p-0">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="text-left px-6 py-3 font-medium">Action</th>
                <th className="text-left px-6 py-3 font-medium">Secteur</th>
                <th className="text-right px-6 py-3 font-medium">Prix</th>
                <th className="text-right px-6 py-3 font-medium">Variation</th>
                <th className="text-center px-6 py-3 font-medium">Détenu</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const hausse = stock.variation >= 0;
                const estSelectionne = stock.name === nameSelectionne;
                const held = positions[stock.name]?.quantity ?? 0;
                return (
                  <tr
                    key={stock.name}
                    onClick={() => onSelectStock(stock.name)}
                    className={`border-b last:border-0 cursor-pointer transition-colors ${
                      estSelectionne ? "bg-primary/10" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-bold">{stock.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline">{stock.secteur}</Badge>
                    </td>
                    <td className="px-6 py-4 text-right font-medium tabular-nums">
                      {formatEur(stock.price)}€
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`flex items-center justify-end gap-1 font-medium tabular-nums ${hausse ? "text-green-500" : "text-red-500"}`}
                      >
                        {hausse ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {hausse ? "+" : ""}
                        {stock.variation.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center tabular-nums">
                      {held > 0 ? (
                        <Badge variant="secondary">{held}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-500/90 text-white"
                          disabled={liquidite < stock.price}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOrder(stock, "achat");
                          }}
                        >
                          Acheter
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={held === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOrder(stock, "vente");
                          }}
                        >
                          Vendre
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden p-4 space-y-3">
          {stocks.map((stock) => {
            const hausse = stock.variation >= 0;
            const estSelectionne = stock.name === nameSelectionne;
            const held = positions[stock.name]?.quantity ?? 0;
            return (
              <div
                key={stock.name}
                onClick={() => onSelectStock(stock.name)}
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                  estSelectionne
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{stock.name}</p>
                  <Badge variant="outline">{stock.secteur}</Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-medium tabular-nums">
                    {formatEur(stock.price)}€
                  </span>
                  <span
                    className={`flex items-center gap-1 text-sm font-medium tabular-nums ${hausse ? "text-green-500" : "text-red-500"}`}
                  >
                    {hausse ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    {hausse ? "+" : ""}
                    {stock.variation.toFixed(2)}%
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Détenu : {held > 0 ? held : "-"}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 bg-green-500 hover:bg-green-500/90 text-white"
                    disabled={liquidite < stock.price}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrder(stock, "achat");
                    }}
                  >
                    Acheter
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    disabled={held === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOrder(stock, "vente");
                    }}
                  >
                    Vendre
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
