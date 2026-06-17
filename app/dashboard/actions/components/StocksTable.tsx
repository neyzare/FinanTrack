"use client";

import { Trash2 } from "lucide-react";
import type { StockWithQuote } from "@/app/lib/stocks-db";

interface StocksTableProps {
    stocks: StockWithQuote[];
    onUpdateQuantity: (stockId: number, newQuantity: number) => void;
    onDelete: (stockId: number) => void;
}

export function StocksTable({ stocks, onUpdateQuantity, onDelete }: StocksTableProps) {
    if (stocks.length === 0) {
        return (
            <div className="py-8 text-center text-muted-foreground">
                Aucune action ajoutée. Recherchez une action ci-dessus.
            </div>
        );
    }

    return (
        <>
            <div className="hidden md:block max-h-[28rem] overflow-auto">
                <table className="w-full text-left border-collapse min-w-[680px]">
                    <thead>
                        <tr className="border-b border-border sticky top-0 bg-card">
                            <th className="py-3 px-4 text-muted-foreground font-semibold">Action</th>
                            <th className="py-3 px-4 text-muted-foreground font-semibold">Ticker</th>
                            <th className="py-3 px-4 text-muted-foreground font-semibold">Prix</th>
                            <th className="py-3 px-4 text-muted-foreground font-semibold">Variation</th>
                            <th className="py-3 px-4 text-muted-foreground font-semibold">Quantité</th>
                            <th className="py-3 px-4 text-muted-foreground font-semibold">Valeur</th>
                            <th className="py-3 px-4 text-muted-foreground font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stock) => {
                            const isUp = stock.variation != null && stock.variation >= 0;
                            return (
                                <tr key={stock.id} className="border-b border-border hover:bg-muted/50">
                                    <td className="py-3 px-4">{stock.name}</td>
                                    <td className="py-3 px-4">{stock.ticker}</td>
                                    <td className="py-3 px-4 tabular-nums">
                                        {stock.price != null ? `$${stock.price.toFixed(2)}` : "—"}
                                    </td>
                                    <td className={`py-3 px-4 tabular-nums ${isUp ? "text-green-500" : "text-red-500"}`}>
                                        {stock.variation != null ? `${stock.variation.toFixed(2)}%` : "—"}
                                    </td>
                                    <td className="py-3 px-4">
                                        <input
                                            type="number"
                                            min="0"
                                            value={stock.quantity}
                                            onChange={(e) => onUpdateQuantity(stock.id, Number(e.target.value))}
                                            className="w-24 px-2 py-1 bg-input-background text-foreground rounded border border-border focus:outline-none focus:border-primary"
                                        />
                                    </td>
                                    <td className="py-3 px-4 tabular-nums">
                                        ${stock.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="py-3 px-4 text-right">
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
                        })}
                    </tbody>
                </table>
            </div>

            <div className="md:hidden space-y-3 max-h-[28rem] overflow-y-auto">
                {stocks.map((stock) => {
                    const isUp = stock.variation != null && stock.variation >= 0;
                    return (
                        <div key={stock.id} className="rounded-lg border border-border p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="font-medium truncate">{stock.name}</p>
                                    <p className="text-sm text-muted-foreground">{stock.ticker}</p>
                                </div>
                                <button
                                    onClick={() => onDelete(stock.id)}
                                    className="shrink-0 text-destructive hover:opacity-80 hover:bg-destructive/10 p-2 rounded transition-colors"
                                    title="Supprimer cette action"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="mt-3 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Prix</span>
                                    <span className="tabular-nums">
                                        {stock.price != null ? `$${stock.price.toFixed(2)}` : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Variation</span>
                                    <span className={`tabular-nums ${isUp ? "text-green-500" : "text-red-500"}`}>
                                        {stock.variation != null ? `${stock.variation.toFixed(2)}%` : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Valeur</span>
                                    <span className="tabular-nums">
                                        ${stock.value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Quantité</span>
                                    <input
                                        type="number"
                                        min="0"
                                        value={stock.quantity}
                                        onChange={(e) => onUpdateQuantity(stock.id, Number(e.target.value))}
                                        className="w-24 px-2 py-1 bg-input-background text-foreground rounded border border-border focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}
