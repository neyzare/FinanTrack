import { Activity } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import type { Transaction } from "@/app/types/Sandbox";
import { formatEur } from "../utils/format";

interface HistoryTableProps {
  historique: Transaction[];
}

function formatHeure(d: Date) {
  return d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function HistoryTable({ historique }: HistoryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des Transactions</CardTitle>
        <span className="text-sm text-muted-foreground">
          Toutes les opérations effectuées
        </span>
      </CardHeader>
      <CardContent className={historique.length === 0 ? "" : "p-0"}>
        {historique.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Activity className="w-12 h-12 text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground font-medium">
              Aucune transaction
            </p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Vos achats et ventes apparaîtront ici
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left px-6 py-3 font-medium">Heure</th>
                    <th className="text-left px-6 py-3 font-medium">Type</th>
                    <th className="text-left px-6 py-3 font-medium">Action</th>
                    <th className="text-right px-6 py-3 font-medium">
                      Quantité
                    </th>
                    <th className="text-right px-6 py-3 font-medium">
                      Prix unit.
                    </th>
                    <th className="text-right px-6 py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {historique.map((tx, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-6 py-4 text-muted-foreground text-xs tabular-nums">
                        {formatHeure(tx.timestamp)}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            tx.type === "achat"
                              ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                              : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                          }
                        >
                          {tx.type === "achat" ? "Achat" : "Vente"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium">{tx.stockName}</td>
                      <td className="px-6 py-4 text-right tabular-nums">
                        {tx.quantity}
                      </td>
                      <td className="px-6 py-4 text-right tabular-nums">
                        {formatEur(tx.unitPrice)} €
                      </td>
                      <td
                        className={`px-6 py-4 text-right tabular-nums font-medium ${tx.type === "achat" ? "text-green-500" : "text-red-500"}`}
                      >
                        {tx.type === "achat" ? "-" : "+"}
                        {formatEur(tx.total)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden p-4 space-y-3">
              {historique.map((tx, i) => (
                <div key={i} className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        tx.type === "achat"
                          ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                      }
                    >
                      {tx.type === "achat" ? "Achat" : "Vente"}
                    </Badge>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {formatHeure(tx.timestamp)}
                    </span>
                  </div>
                  <p className="mt-2 font-medium">{tx.stockName}</p>
                  <div className="mt-1 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground tabular-nums">
                      {tx.quantity} × {formatEur(tx.unitPrice)} €
                    </span>
                    <span
                      className={`tabular-nums font-medium ${tx.type === "achat" ? "text-green-500" : "text-red-500"}`}
                    >
                      {tx.type === "achat" ? "-" : "+"}
                      {formatEur(tx.total)} €
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
