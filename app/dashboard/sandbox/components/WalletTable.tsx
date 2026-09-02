import { PackageOpen } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { Stock } from "@/app/types/stock";
import type { Position } from "@/app/types/Sandbox";
import { formatEur } from "../utils/format";

interface WalletTableProps {
  positionsList: Position[];
  stocks: Stock[];
  valeurActions: number;
  onSelectStock: (name: string) => void;
  onSell: (stock: Stock) => void;
}

export function WalletTable({
  positionsList,
  stocks,
  valeurActions,
  onSelectStock,
  onSell,
}: WalletTableProps) {
  const totalQuantity = positionsList.reduce((s, p) => s + p.quantity, 0);
  const totalCost = positionsList.reduce(
    (s, p) => s + p.avgBuyPrice * p.quantity,
    0,
  );
  const totalPl = valeurActions - totalCost;
  const totalPlPct = totalCost > 0 ? (totalPl / totalCost) * 100 : 0;
  const totalProfit = totalPl >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mes Positions</CardTitle>
        <span className="text-sm text-muted-foreground">
          Actions actuellement détenues
        </span>
      </CardHeader>
      <CardContent className={positionsList.length === 0 ? "" : "p-0"}>
        {positionsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <PackageOpen className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">
              Aucune position ouverte
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Achetez des actions dans l&#39;onglet Market pour commencer
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left px-6 py-3 font-medium">Action</th>
                    <th className="text-right px-6 py-3 font-medium">
                      Quantité
                    </th>
                    <th className="text-right px-6 py-3 font-medium">
                      Prix moyen
                    </th>
                    <th className="text-right px-6 py-3 font-medium">
                      Prix actuel
                    </th>
                    <th className="text-right px-6 py-3 font-medium">Valeur</th>
                    <th className="text-right px-6 py-3 font-medium">P/L</th>
                    <th className="text-right px-6 py-3 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {positionsList.map((pos) => {
                    const currentStock = stocks.find(
                      (s) => s.name === pos.stockName,
                    );
                    if (!currentStock) return null;

                    const currentValue = currentStock.price * pos.quantity;
                    const costBasis = pos.avgBuyPrice * pos.quantity;
                    const pl = currentValue - costBasis;
                    const plPercent =
                      costBasis > 0 ? (pl / costBasis) * 100 : 0;
                    const isProfit = pl >= 0;

                    return (
                      <tr
                        key={pos.stockName}
                        onClick={() => onSelectStock(pos.stockName)}
                        className="border-b last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold">{pos.stockName}</p>
                          <p className="text-xs text-muted-foreground">
                            {currentStock.secteur}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums font-medium">
                          {pos.quantity}
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          {formatEur(pos.avgBuyPrice)} €
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums">
                          {formatEur(currentStock.price)} €
                        </td>
                        <td className="px-6 py-4 text-right tabular-nums font-medium">
                          {formatEur(currentValue)} €
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div
                            className={`flex flex-col items-end tabular-nums font-medium ${isProfit ? "text-green-500" : "text-red-500"}`}
                          >
                            <span>
                              {isProfit ? "+" : ""}
                              {formatEur(pl)} €
                            </span>
                            <span className="text-xs">
                              {isProfit ? "+" : ""}
                              {plPercent.toFixed(2)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                onSell(currentStock);
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
                <tfoot>
                  <tr className="border-t-2 font-bold">
                    <td className="px-6 py-3">Total</td>
                    <td className="px-6 py-3 text-right tabular-nums">
                      {totalQuantity}
                    </td>
                    <td colSpan={2} />
                    <td className="px-6 py-3 text-right tabular-nums">
                      {formatEur(valeurActions)} €
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div
                        className={`flex flex-col items-end tabular-nums ${totalProfit ? "text-green-500" : "text-red-500"}`}
                      >
                        <span>
                          {totalProfit ? "+" : ""}
                          {formatEur(totalPl)} €
                        </span>
                        <span className="text-xs">
                          {totalProfit ? "+" : ""}
                          {totalPlPct.toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {positionsList.map((pos) => {
                const currentStock = stocks.find(
                  (s) => s.name === pos.stockName,
                );
                if (!currentStock) return null;

                const currentValue = currentStock.price * pos.quantity;
                const costBasis = pos.avgBuyPrice * pos.quantity;
                const pl = currentValue - costBasis;
                const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;
                const isProfit = pl >= 0;

                return (
                  <div
                    key={pos.stockName}
                    onClick={() => onSelectStock(pos.stockName)}
                    className="rounded-lg border border-border p-4 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold truncate">{pos.stockName}</p>
                        <p className="text-xs text-muted-foreground">
                          {currentStock.secteur}
                        </p>
                      </div>
                      <div
                        className={`flex flex-col items-end tabular-nums font-medium ${isProfit ? "text-green-500" : "text-red-500"}`}
                      >
                        <span>
                          {isProfit ? "+" : ""}
                          {formatEur(pl)} €
                        </span>
                        <span className="text-xs">
                          {isProfit ? "+" : ""}
                          {plPercent.toFixed(2)}%
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Quantité</span>
                        <span className="tabular-nums">{pos.quantity}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Prix moyen
                        </span>
                        <span className="tabular-nums">
                          {formatEur(pos.avgBuyPrice)} €
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">
                          Prix actuel
                        </span>
                        <span className="tabular-nums">
                          {formatEur(currentStock.price)} €
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Valeur</span>
                        <span className="tabular-nums font-medium">
                          {formatEur(currentValue)} €
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-3"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSell(currentStock);
                      }}
                    >
                      Vendre
                    </Button>
                  </div>
                );
              })}

              <div className="rounded-lg border-2 border-border p-4 text-sm font-bold space-y-2">
                <div className="flex items-center justify-between">
                  <span>Total positions</span>
                  <span className="tabular-nums">{totalQuantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Valeur</span>
                  <span className="tabular-nums">
                    {formatEur(valeurActions)} €
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>P/L</span>
                  <span
                    className={`tabular-nums ${totalProfit ? "text-green-500" : "text-red-500"}`}
                  >
                    {totalProfit ? "+" : ""}
                    {formatEur(totalPl)} € ({totalProfit ? "+" : ""}
                    {totalPlPct.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
