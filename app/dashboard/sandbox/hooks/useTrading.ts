"use client";

import { useCallback, useState } from "react";
import type { Stock } from "@/app/types/stock";
import type { OrderType, Position, SandboxState, Transaction } from "@/app/types/Sandbox";
import { placeOrder, resetSandbox } from "@/app/lib/sandboxAction";

const CAPITAL_INITIAL = 10_000;

function toPositionsMap(list: Position[]): Record<string, Position> {
    const map: Record<string, Position> = {};
    for (const p of list) map[p.stockName] = p;
    return map;
}

export function useTrading(initialState: SandboxState) {
    const [liquidite, setLiquidite] = useState(initialState.liquidite);
    const [positions, setPositions] = useState<Record<string, Position>>(
        toPositionsMap(initialState.positions),
    );
    const [historique, setHistorique] = useState<Transaction[]>(initialState.historique);

    const passerOrdre = useCallback((type: OrderType, stock: Stock, quantite: number) => {
        if (quantite < 1) return;
        const prix = stock.price;
        const total = +(prix * quantite).toFixed(2);
        const nom = stock.name;

        const previousLiquidite = liquidite;
        const previousPositions = positions;
        const previousHistorique = historique;

        if (type === "achat") {
            if (liquidite < total) return;

            setLiquidite(prev => +(prev - total).toFixed(2));

            setPositions(prev => {
                const existing = prev[nom];
                if (existing) {
                    const newQty = existing.quantity + quantite;
                    const newAvg = (existing.avgBuyPrice * existing.quantity + prix * quantite) / newQty;
                    return { ...prev, [nom]: { ...existing, quantity: newQty, avgBuyPrice: +newAvg.toFixed(4) } };
                }
                return { ...prev, [nom]: { stockName: nom, quantity: quantite, avgBuyPrice: prix } };
            });
        } else {
            const held = positions[nom]?.quantity ?? 0;
            if (quantite > held) return;

            setLiquidite(prev => +(prev + total).toFixed(2));

            setPositions(prev => {
                const existing = prev[nom];
                if (!existing) return prev;
                const newQty = existing.quantity - quantite;
                if (newQty <= 0) {
                    const rest = { ...prev };
                    delete rest[nom];
                    return rest;
                }
                return { ...prev, [nom]: { ...existing, quantity: newQty } };
            });
        }

        const transaction: Transaction = {
            type, stockName: nom, quantity: quantite, unitPrice: prix, total, timestamp: new Date(),
        };
        setHistorique(prev => [transaction, ...prev]);

        placeOrder(type, nom, quantite, prix).then(result => {
            if (!result.success) {
                console.error("placeOrder a échoué :", result);
                setLiquidite(previousLiquidite);
                setPositions(previousPositions);
                setHistorique(previousHistorique);
            }
        });
    }, [liquidite, positions, historique]);

    const reinitialiserTrading = useCallback(() => {
        setLiquidite(CAPITAL_INITIAL);
        setPositions({});
        setHistorique([]);
        resetSandbox().then(result => {
            if (!result.success) console.error("resetSandbox a échoué :", result);
        });
    }, []);

    return { liquidite, positions, historique, passerOrdre, reinitialiserTrading };
}
