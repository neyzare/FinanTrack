"use client";

import { useEffect, useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { TradingViewChart } from "./components/TradingViewChart";
import { AnomalyReport } from "./components/AnomalyReport";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { getAnomalies } from "@/app/lib/anomalyApi";
import type { AnomalyReport as Report } from "@/app/types/anomaly";

const PERIODES = [
  { label: "1 an", days: 365 },
  { label: "2 ans", days: 730 },
  { label: "3 ans", days: 1095 },
];

export default function AnalyseClient() {
  const [saisie, setSaisie] = useState("AAPL");
  const [symbol, setSymbol] = useState("AAPL");
  const [days, setDays] = useState(365);
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  // Analyse au chargement, puis à chaque symbole validé ou changement de période
  useEffect(() => {
    startTransition(async () => {
      const result = await getAnomalies(symbol, { days });
      if (result.success) {
        setReport(result.report);
        setError("");
      } else {
        setReport(null);
        setError(result.error);
      }
    });
  }, [symbol, days]);

  const lancerAnalyse = (event: React.FormEvent) => {
    event.preventDefault();
    const ticker = saisie.trim().toUpperCase();
    if (ticker) setSymbol(ticker);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analyse</h1>
          <p className="text-muted-foreground">
            Graphique en temps réel et détection d&apos;anomalies de prix
          </p>
        </div>
        <form onSubmit={lancerAnalyse} className="flex gap-2">
          <Input
            placeholder="Entrer un symbole boursier"
            value={saisie}
            onChange={(e) => setSaisie(e.target.value)}
            className="sm:w-56"
          />
          <Button type="submit" disabled={isPending}>
            Analyser
          </Button>
        </form>
      </div>

      <TradingViewChart symbol={symbol} />

      <div className="flex gap-2">
        {PERIODES.map((periode) => (
          <Button
            key={periode.days}
            variant={days === periode.days ? "default" : "outline"}
            size="sm"
            onClick={() => setDays(periode.days)}
            disabled={isPending}
          >
            {periode.label}
          </Button>
        ))}
      </div>

      {isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
          Analyse de {symbol} en cours…
        </div>
      )}

      {error && !isPending && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {report && !isPending && <AnomalyReport report={report} />}
    </div>
  );
}
