"use client"

import {Button} from "@/app/components/ui/button";
import {Activity, ChartBar, DollarSign, Wallet} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/app/components/ui/card";
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


export default function SandboxStockExchange() {

    const statsStockProfile = [
        {
            name: "Valeur Totale",
            icon: Wallet,
            value: 10_000,
            description: undefined,
        },
        {
            name: "Liquidité",
            icon: DollarSign,
            value: 10_000,
            description: "Disponible pour le trading"
        },
        {
            name: "Valeur Actions",
            icon: ChartBar,
            value: undefined,
            description: undefined
        },
        {
            name: "Description",
            icon: Activity,
            value: undefined,
            description: "total exécutées"
        }
    ]

    const rawData = [
        { time: 1700000000, open: 100, high: 115, low:  95, close: 107 },
        { time: 1700000060, open: 107, high: 120, low: 104, close: 118 },
        { time: 1700000120, open: 118, high: 122, low: 110, close: 112 },
        { time: 1700000180, open: 112, high: 113, low:  98, close:  99 },
        { time: 1700000240, open:  99, high: 108, low:  96, close: 106 },
        { time: 1700000300, open: 106, high: 106, low:  90, close:  92 },
    ];

    const data = rawData.map(({ time, open, high, low, close }) => {
        const bodyBottom = Math.min(open, close);
        const bodyTop    = Math.max(open, close);
        const bodyCenter = (bodyBottom + bodyTop) / 2;
        return {
            time, open, high, low, close,
            isBullish:      close >= open,
            barDataKey:     [bodyBottom, bodyTop],
            whiskerDataKey: [bodyCenter - low, high - bodyCenter],
        };
    });

    const CandlestickShape = (props: any) => {
        const color = props.open < props.close ? "#22c55e" : "#ef4444";
        return <Rectangle {...props} fill={color} stroke={color} />;
    };

    const CandlestickTooltip = ({ active, payload }: any) => {
        if (!active || !payload?.length) return null;
        const { time, open, high, low, close, isBullish } = payload[0].payload;
        const color = isBullish ? "#22c55e" : "#ef4444";
        return (
            <div className="rounded-lg border bg-card p-3 shadow-md text-sm space-y-1">
                <p className="text-muted-foreground text-xs">
                    {new Date(time * 1000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p>O : <b>{open}</b> &nbsp; H : <b className="text-green-500">{high}</b></p>
                <p>L : <b className="text-red-500">{low}</b> &nbsp; C : <b style={{ color }}>{close}</b></p>
            </div>
        );
    };

    return (
        <>
            <div className="space-y-6">
                <h1 className="text-3xl mb-2">SandBox Boursier</h1>
                <div className="flex justify-between mt-5 mb-5">
                    <span>Entraînez-vous au trading avec un capital virtuel de 10 000€</span>
                    <Button>Réinitialiser</Button>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-6">
                {statsStockProfile.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className={"border-2"}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm text-muted-foreground">{stat.name}</p>
                                    <Icon className={"w-5 h-5"}/>
                                </div>
                                <p className={`text-2xl ${stat.value}`}>{stat.description}</p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Graphique de l'évolution du portefeuille</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" aspect={1.618}>
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
                        >
                            <CartesianGrid vertical={false} />

                            <XAxis
                                dataKey="time"
                                tickFormatter={(ts) => new Date(ts * 1000).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                                tickLine={false}
                                axisLine={false}
                            />

                            <YAxis
                                domain={['dataMin - 5', 'dataMax + 5']}
                                tickFormatter={(v) => `$${v}`}
                                tickLine={false}
                                axisLine={false}
                                width={45}
                            />

                            <Bar dataKey="barDataKey" shape={CandlestickShape}>
                                <ErrorBar dataKey="whiskerDataKey" width={0} strokeWidth={1.5} zIndex={DefaultZIndexes.bar - 1} />
                            </Bar>

                            <Tooltip content={<CandlestickTooltip />} cursor={{ fill: "hsl(var(--muted) / 0.3)" }} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </>
    )
}