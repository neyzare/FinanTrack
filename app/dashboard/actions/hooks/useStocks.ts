"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  addStock,
  deleteStock as deleteStockFromDB,
  updateStock,
} from "@/app/lib/stocks-db";
import type { StockWithQuote } from "@/app/lib/stocks-db";
import { getStocks } from "@/app/lib/Finnhub";

export function useStocks(initialStocks: StockWithQuote[]) {
  const router = useRouter();
  const [stocks, setStocks] = useState(initialStocks);
  const [errors, setErrors] = useState("");

  const updateQuantity = async (stockId: number, newQuantity: number) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (!stock) return;
    try {
      await updateStock(stock.ticker, newQuantity);
      setStocks((prev) =>
        prev.map((s) =>
          s.id === stockId
            ? {
                ...s,
                quantity: newQuantity,
                value: (s.price ?? 0) * newQuantity,
              }
            : s,
        ),
      );
    } catch (error) {
      console.error("Erreur mise à jour quantité:", error);
      setErrors("Impossible de mettre à jour la quantité");
    }
  };

  const deleteStockHandler = async (stockId: number) => {
    const stock = stocks.find((s) => s.id === stockId);
    if (!stock) return;
    try {
      await deleteStockFromDB(stock.ticker);
      setStocks((prev) => prev.filter((s) => s.id !== stockId));
      router.refresh();
    } catch (error) {
      console.error("Erreur suppression action:", error);
      setErrors("Impossible de supprimer l'action");
    }
  };

  const ajouterStock = async (symbole: string) => {
    const symbols = symbole.trim().toUpperCase();
    if (!symbols) {
      setErrors("Veuillez entrer un symbole d'action valide.");
      return false;
    }
    if (stocks.some((s) => s.ticker === symbols)) {
      setErrors("Cette action est déjà dans votre liste.");
      return false;
    }
    try {
      const data = await getStocks(symbols);
      if (!data) {
        setErrors("Symbole d'action invalide.");
        return false;
      }
      const prix = data.c;
      const variation = data.dp;
      if (prix == null || variation == null) {
        setErrors("Données de marché indisponibles pour ce symbole.");
        return false;
      }
      const result = await addStock(symbols, symbols, 0, prix, {
        price: prix,
        variation,
      });
      if (!result.success) {
        setErrors(result.error || "Erreur lors de l'ajout");
        return false;
      }
      setStocks((prev) => [
        ...prev,
        {
          id: result.stock!.id,
          name: symbols,
          ticker: symbols,
          price: prix,
          variation,
          quantity: 0,
          value: 0,
          buyPrice: prix,
        },
      ]);
      setErrors("");
      router.refresh();
      return true;
    } catch (error) {
      setErrors("Impossible de récupérer les données pour ce symbole.");
      console.error(error);
      return false;
    }
  };

  return {
    stocks,
    errors,
    setErrors,
    updateQuantity,
    deleteStockHandler,
    ajouterStock,
  };
}
