"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/app/components/ui/button";
import { Activity, ChartBar, DollarSign, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
    Bar,
    BarChart,
    CartesianGrid,
    DefaultZIndexes,
    ErrorBar,
    Rectangle,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { Stock, Bougie, BougieChart, Timeframe } from "@/app/types/stock";
import { TIMEFRAME_LABELS } from "@/app/types/stock";
import {
    STOCKS_INITIAUX,
    tickStocks,
    genererHistoriqueBougies,
    mettreAJourBougies,
    bougiePourChart,
} from "@/app/lib/stockSimulation";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "1h", "4h", "1j", "1M"];
const TICK_INTERVAL_MS = 3000;

type OrderType = "achat" | "vente";
type BougiesMap = Record<string, Record<Timeframe, Bougie[]>>;

function buildInitialBougiesMap(stocks: Stock[]): BougiesMap {
    const map: BougiesMap = {};
    for (const stock of stocks) {
        const parTimeframe = {} as Record<Timeframe, Bougie[]>;
        for (const tf of TIMEFRAMES) {
            parTimeframe[tf] = genererHistoriqueBougies(
                stock.prix,
                stock.volatilite,
                stock.drift,
                tf,
            );
        }
        map[stock.ticker] = parTimeframe;
    }
    return map;
}

function formatTimeLabel(ts: number, timeframe: Timeframe) {
    const d = new Date(ts * 1000);
    if (timeframe === "1j" || timeframe === "1M") {
        return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
    }
    return d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function computeMaxQuantity(
    type: OrderType,
    stock: Stock | null,
    liquidite: number,
    valeurActions: number,
): number {
    if (!stock) return 0;
    const maxAchat = Math.floor(liquidite / stock.prix);
    const maxVente = Math.floor(valeurActions / stock.prix);
    return type === "achat" ? maxAchat : maxVente;
}

function CandlestickShape(props: any) {
    const color = props.open < props.close ? "#22c55e" : "#ef4444";
    return <Rectangle {...props} fill={color} stroke={color} />;
}

function CandlestickTooltip({ active, payload, timeframe }: any) {
    if (!active || !payload?.length) return null;
    const { time, open, high, low, close, isBullish } = payload[0].payload as BougieChart;
    const color = isBullish ? "#22c55e" : "#ef4444";
    const tf = timeframe as Timeframe;

    return (
        <div className="rounded-lg border bg-card p-3 shadow-md text-sm space-y-1">
            <p className="text-muted-foreground text-xs">{formatTimeLabel(time, tf)}</p>
            <p>O : <b>{open.toFixed(2)}</b> &nbsp; H : <b className="text-green-500">{high.toFixed(2)}</b></p>
            <p>L : <b className="text-red-500">{low.toFixed(2)}</b> &nbsp; C : <b style={{ color }}>{close.toFixed(2)}</b></p>
        </div>
    );
}

export default function SandboxStockExchange() {
    const [stocks, setStocks] = useState<Stock[]>(STOCKS_INITIAUX);
    const [liquidite, setLiquidite] = useState(10_000);
    const [valeurActions, setValeurActions] = useState(0);
    const [transactions, setTransactions] = useState(0);

    const [tickerSelectionne, setTickerSelectionne] = useState<string>("AAPL");
    const [timeframe, setTimeframe] = useState<Timeframe>("1m");

    const [modalOuvert, setModalOuvert] = useState(false);
    const [modalType, setModalType] = useState<OrderType>("achat");
    const [modalStock, setModalStock] = useState<Stock | null>(null);
    const [quantite, setQuantite] = useState(1);

    const ouvrirModal = (stock: Stock, type: OrderType) => {
        setModalStock(stock);
        setModalType(type);
        setQuantite(1);
        setModalOuvert(true);
    };

    const bougiesRef = useRef<BougiesMap>(buildInitialBougiesMap(STOCKS_INITIAUX));

    const simulerTick = useCallback(() => {
        setStocks(prev => {
            const nouveaux = tickStocks(prev);
            for (const stock of nouveaux) {
                const tickerMap = bougiesRef.current[stock.ticker];
                if (!tickerMap) continue;
                for (const tf of TIMEFRAMES) {
                    tickerMap[tf] = mettreAJourBougies(tickerMap[tf], stock.prix, tf);
                }
            }
            return nouveaux;
        });
    }, []);

    useEffect(() => {
        const id = setInterval(simulerTick, TICK_INTERVAL_MS);
        return () => clearInterval(id);
    }, [simulerTick]);

    const bougiesActuelles: BougieChart[] =
        (bougiesRef.current[tickerSelectionne]?.[timeframe] ?? []).map(bougiePourChart);

    const stockSelectionne = stocks.find(s => s.ticker === tickerSelectionne) ?? stocks[0];

    const confirmerOrdre = () => {
        if (!modalStock || quantite < 1) return;
        const total = +(modalStock.prix * quantite).toFixed(2);

        if (modalType === "achat") {
            if (liquidite < total) return;
            setLiquidite(prev => +(prev - total).toFixed(2));
            setValeurActions(prev => +(prev + total).toFixed(2));
        } else {
            if (valeurActions < total) return;
            setLiquidite(prev => +(prev + total).toFixed(2));
            setValeurActions(prev => Math.max(0, +(prev - total).toFixed(2)));
        }

        setTransactions(prev => prev + quantite);
        setModalOuvert(false);
    };

    const prixTotalModal = modalStock ? +(modalStock.prix * quantite).toFixed(2) : 0;
    const quantiteMax = computeMaxQuantity(modalType, modalStock, liquidite, valeurActions);
    const ordreValide = quantite >= 1 && quantite <= quantiteMax;

    const reinitialiser = () => {
        setLiquidite(10_000);
        setValeurActions(0);
        setTransactions(0);
        setStocks(STOCKS_INITIAUX);
        const map: Record<string, Record<Timeframe, Bougie[]>> = {};
        for (const stock of STOCKS_INITIAUX) {
            map[stock.ticker] = {} as Record<Timeframe, Bougie[]>;
            for (const tf of TIMEFRAMES) {
                map[stock.ticker][tf] = genererHistoriqueBougies(stock.prix, stock.volatilite, stock.drift, tf);
            }
        }
        bougiesRef.current = map;
    };

    const valeurTotale = +(liquidite + valeurActions).toFixed(2);

    const statsStockProfile = [
        { name: "Valeur Totale",  icon: Wallet,     valeur: `${valeurTotale.toLocaleString('fr-FR')} €` },
        { name: "Liquidité",      icon: DollarSign,  valeur: `${liquidite.toLocaleString('fr-FR')} €`,     description: "Disponible pour le trading" },
        { name: "Valeur Actions", icon: ChartBar,    valeur: `${valeurActions.toLocaleString('fr-FR')} €` },
        { name: "Transactions",   icon: Activity,    valeur: `${transactions}`,                              description: "total exécutées" },
    ];

    const formatXAxis = (ts: number) => formatTimeLabel(ts, timeframe);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl mb-2">SandBox Boursier</h1>
                <div className="flex justify-between mt-2">
                    <span className="text-muted-foreground">Entraînez-vous au trading avec un capital virtuel de 10 000€</span>
                    <Button variant="outline" onClick={reinitialiser}>Réinitialiser</Button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6">
                {statsStockProfile.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="border-2">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                                    <Icon className="w-5 h-5 text-muted-foreground" />
                                </div>
                                <p className="text-2xl font-bold">{stat.valeur}</p>
                                {"description" in stat && stat.description && (
                                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                {stockSelectionne.ticker}
                                <span className="text-base font-normal text-muted-foreground">
                                    — {stockSelectionne.name}
                                </span>
                                <span className={`text-sm font-medium ${stockSelectionne.variation >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {stockSelectionne.variation >= 0 ? '+' : ''}{stockSelectionne.variation.toFixed(2)}%
                                </span>
                            </CardTitle>
                            <p className="text-2xl font-bold mt-1">
                                {stockSelectionne.prix.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                            </p>
                        </div>
                        <div className="flex gap-1 bg-muted rounded-lg p-1">
                            {TIMEFRAMES.map(tf => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                                        timeframe === tf
                                            ? 'bg-card text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {TIMEFRAME_LABELS[tf]}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={bougiesActuelles} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={formatXAxis}
                                    tickLine={false}
                                    axisLine={false}
                                    stroke="currentColor"
                                    fontSize={11}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tickFormatter={(v: number) => `${v.toFixed(0)}€`}
                                    tickLine={false}
                                    axisLine={false}
                                    width={55}
                                    stroke="currentColor"
                                    fontSize={11}
                                />
                                <Bar dataKey="barDataKey" shape={<CandlestickShape />}>
                                    <ErrorBar dataKey="whiskerDataKey" width={0} strokeWidth={1.5} zIndex={DefaultZIndexes.bar - 1} />
                                </Bar>
                                <Tooltip
                                    content={<CandlestickTooltip timeframe={timeframe} />}
                                    cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Actions Disponibles</CardTitle>
                    <p className="text-sm text-muted-foreground">Prix actualisés toutes les 3 secondes</p>
                </CardHeader>
                <CardContent className="p-0">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b text-muted-foreground">
                                <th className="text-left px-6 py-3 font-medium">Action</th>
                                <th className="text-left px-6 py-3 font-medium">Secteur</th>
                                <th className="text-right px-6 py-3 font-medium">Prix</th>
                                <th className="text-right px-6 py-3 font-medium">Variation</th>
                                <th className="text-right px-6 py-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stocks.map((stock) => {
                                const hausse = stock.variation >= 0;
                                const estSelectionne = stock.ticker === tickerSelectionne;
                                return (
                                    <tr
                                        key={stock.ticker}
                                        onClick={() => setTickerSelectionne(stock.ticker)}
                                        className={`border-b last:border-0 cursor-pointer transition-colors ${
                                            estSelectionne ? 'bg-primary/10' : 'hover:bg-muted/30'
                                        }`}
                                    >
                                        <td className="px-6 py-4">
                                            <p className="font-bold">{stock.ticker}</p>
                                            <p className="text-xs text-muted-foreground">{stock.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="outline">{stock.secteur}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium tabular-nums">
                                            {stock.prix.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}€
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`flex items-center justify-end gap-1 font-medium tabular-nums ${hausse ? 'text-green-500' : 'text-red-500'}`}>
                                                {hausse ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                {hausse ? '+' : ''}{stock.variation.toFixed(2)}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-500 hover:bg-green-500/90 text-white"
                                                    disabled={liquidite < stock.prix}
                                                    onClick={(e) => { e.stopPropagation(); ouvrirModal(stock, "achat"); }}
                                                >
                                                    Acheter
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={valeurActions < stock.prix}
                                                    onClick={(e) => { e.stopPropagation(); ouvrirModal(stock, "vente"); }}
                                                >
                                                    Vendre
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </CardContent>
            </Card>

            <Dialog open={modalOuvert} onOpenChange={setModalOuvert}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className={modalType === "achat" ? "text-green-500" : "text-red-500"}>
                                {modalType === "achat" ? "Acheter" : "Vendre"}
                            </span>
                            {modalStock?.ticker}
                        </DialogTitle>
                        <DialogDescription>
                            {modalStock?.name} — {modalStock?.prix.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € par action
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="quantite">Quantité</Label>
                            <Input
                                id="quantite"
                                type="number"
                                min={1}
                                max={quantiteMax}
                                value={quantite}
                                onChange={(e) => setQuantite(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Max : {quantiteMax} action{quantiteMax > 1 ? 's' : ''}
                                </p>
                                <div className="flex gap-1">
                                    {[1, 5, 10, 25].map(q => (
                                        <button
                                            key={q}
                                            onClick={() => setQuantite(Math.min(q, quantiteMax))}
                                            className="px-2 py-0.5 text-xs rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setQuantite(quantiteMax)}
                                        className="px-2 py-0.5 text-xs rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                                    >
                                        Max
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-muted p-4 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Prix unitaire</span>
                                <span>{modalStock?.prix.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Quantité</span>
                                <span>× {quantite}</span>
                            </div>
                            <div className="border-t border-border pt-2 flex justify-between font-bold">
                                <span>Total</span>
                                <span className={modalType === "achat" ? "text-green-500" : "text-red-500"}>
                                    {prixTotalModal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                                </span>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setModalOuvert(false)}>
                            Annuler
                        </Button>
                        <Button
                            disabled={!ordreValide}
                            onClick={confirmerOrdre}
                            className={modalType === "achat"
                                ? "bg-green-500 hover:bg-green-500/90 text-white"
                                : "bg-red-500 hover:bg-red-500/90 text-white"
                            }
                        >
                            Confirmer {modalType === "achat" ? "l'achat" : "la vente"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
