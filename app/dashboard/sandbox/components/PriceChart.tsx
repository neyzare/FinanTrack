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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import type { Stock, BougieChart, Timeframe } from "@/app/types/stock";
import { TIMEFRAME_LABELS } from "@/app/types/stock";
import { TIMEFRAMES, formatTimeLabel } from "../utils/format";

interface CandlestickShapeProps extends Pick<BougieChart, "open" | "high" | "low" | "close"> {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
}

function CandlestickShape(props: CandlestickShapeProps) {
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

interface PriceChartProps {
    stockSelectionne: Stock;
    bougies: BougieChart[];
    timeframe: Timeframe;
    onTimeframeChange: (tf: Timeframe) => void;
}

export function PriceChart({ stockSelectionne, bougies, timeframe, onTimeframeChange }: PriceChartProps) {
    const formatXAxis = (ts: number) => formatTimeLabel(ts, timeframe);

    return (
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
                                onClick={() => onTimeframeChange(tf)}
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
                <div className="h-100 w-full">
                    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
                        <BarChart data={bougies} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
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
                            <Bar dataKey="barDataKey" shape={(props) => <CandlestickShape {...(props as unknown as CandlestickShapeProps)} />}>
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
    );
}
