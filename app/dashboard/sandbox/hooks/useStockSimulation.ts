"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Stock } from "@/app/types/stock";
import type { BougiesMap, SavedCandle, Stocksandbox } from "@/app/types/Sandbox";
import {
    tickStocks,
    mettreAJourBougies,
    TICK_INTERVAL_MS,
} from "@/app/lib/stockSimulation";
import { saveCandles } from "@/app/lib/sandboxAction";
import { TIMEFRAMES, buildInitialBougiesMap } from "../utils/format";

const TICKS_PER_SAVE = 30;

export function useStockSimulation(stocksInitiaux: Stocksandbox[]) {
    const [stocks, setStocks] = useState<Stock[]>(stocksInitiaux);
    const bougiesRef = useRef<BougiesMap>(buildInitialBougiesMap(stocksInitiaux));
    const tickCountRef = useRef(0);

    const simulerTick = useCallback(() => {
        setStocks(prev => {
            const nouveaux = tickStocks(prev);
            for (const stock of nouveaux) {
                const nameMap = bougiesRef.current[stock.name];
                if (!nameMap) continue;
                for (const tf of TIMEFRAMES) {
                    nameMap[tf] = mettreAJourBougies(nameMap[tf], stock.price, tf);
                }
            }

            tickCountRef.current += 1;
            if (tickCountRef.current % TICKS_PER_SAVE === 0) {
                const candles: SavedCandle[] = [];
                for (const stock of nouveaux) {
                    const nameMap = bougiesRef.current[stock.name];
                    if (!nameMap) continue;
                    for (const tf of TIMEFRAMES) {
                        const bougies = nameMap[tf];
                        if (!bougies?.length) continue;
                        const last = bougies[bougies.length - 1];
                        candles.push({
                            stockName: stock.name,
                            timeframe: tf,
                            time: last.time,
                            open: last.open,
                            high: last.high,
                            low: last.low,
                            close: last.close,
                        });
                    }
                }
                saveCandles(candles).then(result => {
                    if (!result.success) console.error("saveCandles a échoué :", result);
                });
            }

            return nouveaux;
        });
    }, []);

    useEffect(() => {
        const id = setInterval(simulerTick, TICK_INTERVAL_MS);
        return () => clearInterval(id);
    }, [simulerTick]);

    const reinitialiserSimulation = useCallback(() => {
        setStocks(stocksInitiaux);
        bougiesRef.current = buildInitialBougiesMap(stocksInitiaux);
        tickCountRef.current = 0;
    }, [stocksInitiaux]);

    return { stocks, bougiesRef, reinitialiserSimulation };
}
