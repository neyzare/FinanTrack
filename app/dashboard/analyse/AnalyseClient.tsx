"use client";

import { useState } from "react";
import { TradingViewChart } from "./components/TradingViewChart";
import { IndicatorCards } from "./components/IndicatorCards";
import { AnalysisSummary } from "./components/AnalysisSummary";
import {Input} from "@/app/components/ui/input";

export default function AnalyseClient() {
    const [symbol, setSymbol] = useState("AAPL");

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Analyse</h1>
                    <p className="text-muted-foreground">Graphique en temps réel et analyse technique de l&apos;action</p>
                </div>
                <Input
                placeholder={"entrer un symbol Boursier"}
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                />
            </div>

            <TradingViewChart symbol={symbol} />

        </div>
    );
}
