"use client";

import type { StockWithQuote } from "@/app/lib/stocks-db";
import { useStocks } from "./hooks/useStocks";
import { StockSearchBar } from "./components/StockSearchBar";
import { StocksTable } from "./components/StocksTable";

export default function ActionsClient({
  initialStocks,
}: {
  initialStocks: StockWithQuote[];
}) {
  const { stocks, errors, updateQuantity, deleteStockHandler, ajouterStock } =
    useStocks(initialStocks);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes Actions</h1>
        <p className="text-muted-foreground">
          Suivez vos actions et leur performance
        </p>
      </div>

      <div className="p-6 border border-border rounded-lg bg-card text-card-foreground">
        <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:justify-between sm:items-center">
          <span className="font-semibold">Liste des actions</span>
          <StockSearchBar onSearch={ajouterStock} />
        </div>

        {errors && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded text-destructive">
            {errors}
          </div>
        )}

        <StocksTable
          stocks={stocks}
          onUpdateQuantity={updateQuantity}
          onDelete={deleteStockHandler}
        />
      </div>
    </div>
  );
}
