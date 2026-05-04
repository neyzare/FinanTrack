"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Button } from "@/app/components/ui/button";
import { Activity, ChartBar, DollarSign, TrendingUp, TrendingDown, Wallet, PackageOpen } from "lucide-react";
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
    tickStocks,
    genererHistoriqueBougies,
    mettreAJourBougies,
    bougiePourChart,
    TICK_INTERVAL_MS,
} from "@/app/lib/stockSimulation";
import type { Stocksandbox, Position, OrderType, BougiesMap, Transaction } from "@/app/types/Sandbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "1h", "4h", "1j", "1M"];



function buildInitialBougiesMap(stocks: Stock[]): BougiesMap {
    const map: BougiesMap = {};
    for (const stock of stocks) {
        const parTimeframe = {} as Record<Timeframe, Bougie[]>;
        for (const tf of TIMEFRAMES) {
            parTimeframe[tf] = genererHistoriqueBougies(
                stock.price,
                stock.volatility,
                tf,
            );
        }
        map[stock.name] = parTimeframe;
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

function formatEur(n: number): string {
    return n.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function computeMaxQuantity(
    type: OrderType,
    stock: Stock | null,
    liquidite: number,
    positions: Record<string, Position>,
): number {
    if (!stock) return 0;
    if (type === "achat") return Math.floor(liquidite / stock.price);
    return positions[stock.name]?.quantity ?? 0;
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

// ─── Composant principal ─────────────────────────────────────────────

export default function SandboxStockExchange( {stockSandbox}: { stockSandbox:Stocksandbox[] } ) {
    const [stocks, setStocks] = useState<Stock[]>(stockSandbox);
    const [liquidite, setLiquidite] = useState(10_000);
    const [positions, setPositions] = useState<Record<string, Position>>({});
    const [historique, setHistorique] = useState<Transaction[]>([]);

    const [nameSelectionne, setTickerSelectionne] = useState<string>(stockSandbox[0]?.name ?? "");
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

    const bougiesRef = useRef<BougiesMap>(buildInitialBougiesMap(stockSandbox));


    const valeurActions = useMemo(() => {
        return Object.values(positions).reduce((sum, pos) => {
            const stock = stocks.find(s => s.name === pos.stockName);
            return sum + (stock ? stock.price * pos.quantity : 0);
        }, 0);
    }, [positions, stocks]);

    const valeurTotale = +(liquidite + valeurActions).toFixed(2);
    const nbTransactions = historique.length;
    const positionsList = Object.values(positions);

    // ─── Simulation des prix ─────────────────────────────────────

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
            return nouveaux;
        });
    }, []);

    useEffect(() => {
        const id = setInterval(simulerTick, TICK_INTERVAL_MS);
        return () => clearInterval(id);
    }, [simulerTick]);

    const bougiesActuelles: BougieChart[] =
        (bougiesRef.current[nameSelectionne]?.[timeframe] ?? []).map(bougiePourChart);

    const stockSelectionne = stocks.find(s => s.name === nameSelectionne) ?? stocks[0];

    // ─── Logique d'achat / vente ─────────────────────────────────

    const confirmerOrdre = () => {
        if (!modalStock || quantite < 1) return;
        const prix = modalStock.price;
        const total = +(prix * quantite).toFixed(2);
        const nom = modalStock.name;

        if (modalType === "achat") {
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
                    const { [nom]: _, ...rest } = prev;
                    return rest;
                }
                return { ...prev, [nom]: { ...existing, quantity: newQty } };
            });
        }

        setHistorique(prev => [
            { type: modalType, stockName: nom, quantity: quantite, unitPrice: prix, total, timestamp: new Date() },
            ...prev,
        ]);

        setModalOuvert(false);
    };

    const prixTotalModal = modalStock ? +(modalStock.price * quantite).toFixed(2) : 0;
    const quantiteMax = computeMaxQuantity(modalType, modalStock, liquidite, positions);
    const ordreValide = quantite >= 1 && quantite <= quantiteMax;

    // ─── Reset ───────────────────────────────────────────────────

    const reinitialiser = () => {
        setLiquidite(10_000);
        setPositions({});
        setHistorique([]);
        setStocks(stockSandbox);
        const map: Record<string, Record<Timeframe, Bougie[]>> = {};
        for (const stock of stockSandbox) {
            map[stock.name] = {} as Record<Timeframe, Bougie[]>;
            for (const tf of TIMEFRAMES) {
                map[stock.name][tf] = genererHistoriqueBougies(stock.price, stock.volatility, tf);
            }
        }
        bougiesRef.current = map;
    };

    // ─── Stats cards ─────────────────────────────────────────────

    const statsStockProfile = [
        { name: "Valeur Totale",  icon: Wallet,     valeur: `${formatEur(valeurTotale)} €` },
        { name: "Liquidité",      icon: DollarSign,  valeur: `${formatEur(liquidite)} €`,     description: "Disponible pour le trading" },
        { name: "Valeur Actions", icon: ChartBar,    valeur: `${formatEur(valeurActions)} €` },
        { name: "Transactions",   icon: Activity,    valeur: `${nbTransactions}`,              description: "total exécutées" },
    ];

    const formatXAxis = (ts: number) => formatTimeLabel(ts, timeframe);

    // ─── Rendu ───────────────────────────────────────────────────

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
                                <span className="text-base font-normal text-muted-foreground">
                                    — {stockSelectionne.name}
                                </span>
                                <span className={`text-sm font-medium ${stockSelectionne.variation >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {stockSelectionne.variation >= 0 ? '+' : ''}{stockSelectionne.variation.toFixed(2)}%
                                </span>
                            </CardTitle>
                            <p className="text-2xl font-bold mt-1">
                                {stockSelectionne.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
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
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
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

            <Tabs defaultValue="market">
                <TabsList className="w-full">
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="wallet">
                        Wallet{positionsList.length > 0 && (
                        <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                            {positionsList.length}
                        </Badge>
                    )}
                    </TabsTrigger>
                    <TabsTrigger value="history">
                        History{nbTransactions > 0 && (
                        <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                            {nbTransactions}
                        </Badge>
                    )}
                    </TabsTrigger>
                </TabsList>

                {/* ─── Market Tab ─────────────────────────────────── */}
                <TabsContent value="market">
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
                                    <th className="text-center px-6 py-3 font-medium">Détenu</th>
                                    <th className="text-right px-6 py-3 font-medium">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {stocks.map((stock) => {
                                    const hausse = stock.variation >= 0;
                                    const estSelectionne = stock.name === nameSelectionne;
                                    const held = positions[stock.name]?.quantity ?? 0;
                                    return (
                                        <tr
                                            key={stock.name}
                                            onClick={() => setTickerSelectionne(stock.name)}
                                            className={`border-b last:border-0 cursor-pointer transition-colors ${
                                                estSelectionne ? 'bg-primary/10' : 'hover:bg-muted/30'
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <p className="font-bold">{stock.name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline">{stock.secteur}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium tabular-nums">
                                                {formatEur(stock.price)}€
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                            <span className={`flex items-center justify-end gap-1 font-medium tabular-nums ${hausse ? 'text-green-500' : 'text-red-500'}`}>
                                                {hausse ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                                                {hausse ? '+' : ''}{stock.variation.toFixed(2)}%
                                            </span>
                                            </td>
                                            <td className="px-6 py-4 text-center tabular-nums">
                                                {held > 0 ? (
                                                    <Badge variant="secondary">{held}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-500 hover:bg-green-500/90 text-white"
                                                        disabled={liquidite < stock.price}
                                                        onClick={(e) => { e.stopPropagation(); ouvrirModal(stock, "achat"); }}
                                                    >
                                                        Acheter
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={held === 0}
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
                </TabsContent>

                {/* ─── Wallet Tab ─────────────────────────────────── */}
                <TabsContent value="wallet">
                    <Card>
                        <CardHeader>
                            <CardTitle>Mes Positions</CardTitle>
                            <span className="text-sm text-muted-foreground">Actions actuellement détenues</span>
                        </CardHeader>
                        <CardContent className={positionsList.length === 0 ? "" : "p-0"}>
                            {positionsList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <PackageOpen className="w-12 h-12 text-muted-foreground/40 mb-4" />
                                    <p className="text-muted-foreground font-medium">Aucune position ouverte</p>
                                    <p className="text-sm text-muted-foreground/60 mt-1">
                                        Achetez des actions dans l'onglet Market pour commencer
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="text-left px-6 py-3 font-medium">Action</th>
                                        <th className="text-right px-6 py-3 font-medium">Quantité</th>
                                        <th className="text-right px-6 py-3 font-medium">Prix moyen</th>
                                        <th className="text-right px-6 py-3 font-medium">Prix actuel</th>
                                        <th className="text-right px-6 py-3 font-medium">Valeur</th>
                                        <th className="text-right px-6 py-3 font-medium">P/L</th>
                                        <th className="text-right px-6 py-3 font-medium">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {positionsList.map((pos) => {
                                        const currentStock = stocks.find(s => s.name === pos.stockName);
                                        if (!currentStock) return null;

                                        const currentValue = currentStock.price * pos.quantity;
                                        const costBasis = pos.avgBuyPrice * pos.quantity;
                                        const pl = currentValue - costBasis;
                                        const plPercent = costBasis > 0 ? (pl / costBasis) * 100 : 0;
                                        const isProfit = pl >= 0;

                                        return (
                                            <tr
                                                key={pos.stockName}
                                                onClick={() => setTickerSelectionne(pos.stockName)}
                                                className="border-b last:border-0 cursor-pointer hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <p className="font-bold">{pos.stockName}</p>
                                                    <p className="text-xs text-muted-foreground">{currentStock.secteur}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right tabular-nums font-medium">
                                                    {pos.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-right tabular-nums">
                                                    {formatEur(pos.avgBuyPrice)} €
                                                </td>
                                                <td className="px-6 py-4 text-right tabular-nums">
                                                    {formatEur(currentStock.price)} €
                                                </td>
                                                <td className="px-6 py-4 text-right tabular-nums font-medium">
                                                    {formatEur(currentValue)} €
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className={`flex flex-col items-end tabular-nums font-medium ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                                                        <span>{isProfit ? '+' : ''}{formatEur(pl)} €</span>
                                                        <span className="text-xs">
                                                            {isProfit ? '+' : ''}{plPercent.toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={(e) => { e.stopPropagation(); ouvrirModal(currentStock, "vente"); }}
                                                        >
                                                            Vendre
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                    <tfoot>
                                    <tr className="border-t-2 font-bold">
                                        <td className="px-6 py-3">Total</td>
                                        <td className="px-6 py-3 text-right tabular-nums">
                                            {positionsList.reduce((s, p) => s + p.quantity, 0)}
                                        </td>
                                        <td colSpan={2} />
                                        <td className="px-6 py-3 text-right tabular-nums">
                                            {formatEur(valeurActions)} €
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            {(() => {
                                                const totalCost = positionsList.reduce((s, p) => s + p.avgBuyPrice * p.quantity, 0);
                                                const totalPl = valeurActions - totalCost;
                                                const totalPlPct = totalCost > 0 ? (totalPl / totalCost) * 100 : 0;
                                                const profit = totalPl >= 0;
                                                return (
                                                    <div className={`flex flex-col items-end tabular-nums ${profit ? 'text-green-500' : 'text-red-500'}`}>
                                                        <span>{profit ? '+' : ''}{formatEur(totalPl)} €</span>
                                                        <span className="text-xs">{profit ? '+' : ''}{totalPlPct.toFixed(2)}%</span>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td />
                                    </tr>
                                    </tfoot>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ─── History Tab ────────────────────────────────── */}
                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Historique des Transactions</CardTitle>
                            <span className="text-sm text-muted-foreground">Toutes les opérations effectuées</span>
                        </CardHeader>
                        <CardContent className={historique.length === 0 ? "" : "p-0"}>
                            {historique.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Activity className="w-12 h-12 text-muted-foreground/40 mb-4" />
                                    <p className="text-muted-foreground font-medium">Aucune transaction</p>
                                    <p className="text-sm text-muted-foreground/60 mt-1">
                                        Vos achats et ventes apparaîtront ici
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b text-muted-foreground">
                                        <th className="text-left px-6 py-3 font-medium">Heure</th>
                                        <th className="text-left px-6 py-3 font-medium">Type</th>
                                        <th className="text-left px-6 py-3 font-medium">Action</th>
                                        <th className="text-right px-6 py-3 font-medium">Quantité</th>
                                        <th className="text-right px-6 py-3 font-medium">Prix unit.</th>
                                        <th className="text-right px-6 py-3 font-medium">Total</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {historique.map((tx, i) => (
                                        <tr key={i} className="border-b last:border-0">
                                            <td className="px-6 py-4 text-muted-foreground text-xs tabular-nums">
                                                {tx.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={tx.type === "achat"
                                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                                }>
                                                    {tx.type === "achat" ? "Achat" : "Vente"}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 font-medium">{tx.stockName}</td>
                                            <td className="px-6 py-4 text-right tabular-nums">{tx.quantity}</td>
                                            <td className="px-6 py-4 text-right tabular-nums">{formatEur(tx.unitPrice)} €</td>
                                            <td className={`px-6 py-4 text-right tabular-nums font-medium ${tx.type === "achat" ? "text-green-500" : "text-red-500"}`}>
                                                {tx.type === "achat" ? "-" : "+"}{formatEur(tx.total)} €
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Dialog open={modalOuvert} onOpenChange={setModalOuvert}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className={modalType === "achat" ? "text-green-500" : "text-red-500"}>
                                {modalType === "achat" ? "Acheter" : "Vendre"}
                            </span>
                            {modalStock?.name}
                        </DialogTitle>
                        <DialogDescription>
                            {modalStock?.name} — {modalStock?.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} € par action
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
                                <span>{modalStock?.price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Quantité</span>
                                <span>x {quantite}</span>
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