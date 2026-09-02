"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { useTheme } from "@/app/components/ThemeProvider";

export function TradingViewChart({ symbol }: { symbol: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!container.current) return;

    container.current.innerHTML = "";
    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.height = "calc(100% - 32px)";
    widget.style.width = "100%";
    container.current.appendChild(widget);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      allow_symbol_change: false,
      calendar: false,
      details: false,
      hide_side_toolbar: true,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: false,
      interval: "D",
      locale: "fr",
      save_image: true,
      style: "1",
      symbol,
      theme,
      timezone: "Etc/UTC",
      backgroundColor: theme === "dark" ? "#0F0F0F" : "#FFFFFF",
      gridColor: "rgba(242, 242, 242, 0.06)",
      watchlist: [],
      withdateranges: false,
      compareSymbols: [],
      studies: [],
      autosize: true,
    });
    container.current.appendChild(script);
  }, [symbol, theme]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-semibold">{symbol}</CardTitle>
        <CardDescription>
          Graphique en temps quasi réel via TradingView
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-120 rounded-lg overflow-hidden border">
          <div
            className="tradingview-widget-container"
            ref={container}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <div className="tradingview-widget-copyright mt-2 text-xs">
          <a
            href={`https://www.tradingview.com/symbols/${symbol}/`}
            rel="noopener nofollow"
            target="_blank"
          >
            <span className="blue-text">{symbol}</span>
          </a>
          <span className="trademark"> by TradingView</span>
        </div>
      </CardContent>
    </Card>
  );
}
