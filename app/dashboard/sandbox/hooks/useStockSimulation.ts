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
    const [bougies, setBougies] = useState<BougiesMap>(() => buildInitialBougiesMap(stocksInitiaux));
    const tickCountRef = useRef(0);

    const simulerTick = useCallback(() => {
        setStocks(prevStocks => {
            const nouveaux = tickStocks(prevStocks);

            setBougies(prevBougies => {
                const next: BougiesMap = { ...prevBougies };
                for (const stock of nouveaux) {
                    const nameMap = next[stock.name];
                    if (!nameMap) continue;
                    const updated = { ...nameMap };
                    for (const tf of TIMEFRAMES) {
                        updated[tf] = mettreAJourBougies(nameMap[tf], stock.price, tf);
                    }
                    next[stock.name] = updated;
                }

                tickCountRef.current += 1;
                if (tickCountRef.current % TICKS_PER_SAVE === 0) {
                    const candles: SavedCandle[] = [];
                    for (const stock of nouveaux) {
                        const nameMap = next[stock.name];
                        if (!nameMap) continue;
                        for (const tf of TIMEFRAMES) {
                            const series = nameMap[tf];
                            if (!series?.length) continue;
                            const last = series[series.length - 1];
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

                return next;
            });

            return nouveaux;
        });
    }, []);

    useEffect(() => {
        const id = setInterval(simulerTick, TICK_INTERVAL_MS);
        return () => clearInterval(id);
    }, [simulerTick]);

    const reinitialiserSimulation = useCallback(() => {
        setStocks(stocksInitiaux);
        setBougies(buildInitialBougiesMap(stocksInitiaux));
        tickCountRef.current = 0;
    }, [stocksInitiaux]);

    return { stocks, bougies, reinitialiserSimulation };
}
