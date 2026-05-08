"use client";

import { Trash2 } from "lucide-react";
import type { StockWithQuote } from "@/app/lib/stocks-db";

interface StocksTableProps {
    stocks: StockWithQuote[];
    onUpdateQuantity: (stockId: number, newQuantity: number) => void;
    onDelete: (stockId: number) => void;
}

export function StocksTable({ stocks, onUpdateQuantity, onDelete }: StocksTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
                <thead>
                    <tr className="border-b border-border">
                        <th className="py-3 px-4 text-muted-foreground font-semibold w-[18%]">Action</th>
                        <th className="py-3 px-4 text-muted-foreground font-semibold w-[12%]">Ticker</th>
                        <th className="py-3 px-4 text-muted-foreground font-semibold w-[13%]">Prix</th>
                        <th className="py-3 px-4 text-muted-foreground font-semibold w-[13%]">Variation</th>
                        <th className="py-3 px-4 text-muted-foreground font-semibold w-[14%]">Quantité</th>
                        <th className="py-3 px-4 text-muted-foreground font-semibold w-[20%]">Valeur</th>
                        <th className="py-3 px-4 text-muted-foreground font-semibold w-[10%]">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="py-8 text-center text-muted-foreground">
                                Aucune action ajoutée. Recherchez une action ci-dessus.
                            </td>
                        </tr>
                    ) : (
                        stocks.map((stock) => {
                            const isUp = stock.variation != null && stock.variation >= 0;
                            return (
                                <tr key={stock.id} className="border-b border-border hover:bg-muted/50">
                                    <td className="py-3 px-4">{stock.name}</td>
                                    <td className="py-3 px-4">{stock.ticker}</td>
                                    <td className="py-3 px-4">
                                        {stock.price != null ? `$${stock.price.toFixed(2)}` : "—"}
                                    </td>
                                    <td className={`py-3 px-4 ${isUp ? "text-green-500" : "text-red-500"}`}>
                                        {stock.variation != null ? `${stock.variation.toFixed(2)}%` : "—"}
                                    </td>
                                    <td className="py-3 px-4">
                                        <input
                                            type="number"
                                            min="0"
                                            value={stock.quantity}
                                            onChange={(e) => onUpdateQuantity(stock.id, Number(e.target.value))}
                                            className="w-full px-2 py-1 bg-input-background text-foreground rounded border border-border focus:outline-none focus:border-primary"
                                        />
                                    </td>
                                    <td className="py-3 px-4">
                                        ${stock.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4">
                                        <button
                                            onClick={() => onDelete(stock.id)}
                                            className="text-destructive hover:opacity-80 hover:bg-destructive/10 p-2 rounded transition-colors"
                                            title="Supprimer cette action"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
