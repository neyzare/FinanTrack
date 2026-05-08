"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, Activity, Target } from "lucide-react"
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import type { DashboardData, ChartPoint } from "@/app/lib/performance"
import { getHistory } from "@/app/lib/performance"

const PERIODS = [
    { days: 7, label: "Semaine" },
    { days: 30, label: "Mois" },
    { days: 365, label: "Année" },
]

export default function DashboardClient({ data, initialChart }: { data: DashboardData; initialChart: ChartPoint[] }) {
    const [selectedDays, setSelectedDays] = useState(30)
    const [chartData, setChartData] = useState<ChartPoint[]>([])
    const [loading, setLoading] = useState(false)

    const displayChartData = selectedDays === 30 ? initialChart : chartData

    useEffect(() => {
        if (selectedDays === 30) return
        if (!data.hasStocks) return
        setLoading(true)
        getHistory(selectedDays)
            .then(setChartData)
            .catch(() => setChartData([]))
            .finally(() => setLoading(false))
    }, [selectedDays, data.hasStocks])

    const stats = [
        {
            title: "Valeur totale du portefeuille",
            value: data.totalValue,
            change: data.dailyChangePercent,
            changeLabel: "aujourd'hui",
            icon: DollarSign,
            iconColor: "text-blue-500",
            iconBg: "bg-blue-500/10",
        },
        {
            title: "Gain / Perte total",
            value: data.totalGainLoss,
            change: data.totalGainLossPercent,
            changeLabel: "depuis l'achat",
            icon: Activity,
            iconColor: data.totalGainLoss >= 0 ? "text-green-500" : "text-red-500",
            iconBg: data.totalGainLoss >= 0 ? "bg-green-500/10" : "bg-red-500/10",
        },
        {
            title: "Performance globale",
            value: data.totalGainLossPercent,
            isPercentage: true,
            change: data.dailyChangePercent,
            changeLabel: "aujourd'hui",
            icon: Target,
            iconColor: data.totalGainLossPercent >= 0 ? "text-purple-500" : "text-red-500",
            iconBg: data.totalGainLossPercent >= 0 ? "bg-purple-500/10" : "bg-red-500/10",
        },
    ]

    return (
        <>
            <div className="mb-6">
                <h3 className="text-3xl font-bold pb-2">Dashboard</h3>
                <p className="text-muted-foreground">Vue d'ensemble de votre portefeuille</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-3">
                                {stat.isPercentage
                                    ? `${stat.value >= 0 ? "+" : ""}${stat.value.toFixed(2)}%`
                                    : `${stat.value.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`
                                }
                            </div>
                            {data.hasStocks ? (
                                <div className="flex items-center gap-1 text-sm">
                                    {stat.change >= 0
                                        ? <TrendingUp className="w-4 h-4 text-green-500" />
                                        : <TrendingDown className="w-4 h-4 text-red-500" />
                                    }
                                    <span className={stat.change >= 0 ? "text-green-500" : "text-red-500"}>
                                        {stat.change >= 0 ? "+" : ""}{stat.change.toFixed(2)}%
                                    </span>
                                    <span className="text-muted-foreground">{stat.changeLabel}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Ajoutez des actions pour voir vos performances
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="mt-6">
                <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <CardTitle>Évolution du portefeuille</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Valeur totale au fil du temps</p>
                    </div>
                    <div className="flex gap-1 bg-muted p-1 rounded-lg">
                        {PERIODS.map((p) => (
                            <button
                                key={p.days}
                                onClick={() => setSelectedDays(p.days)}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                                    selectedDays === p.days
                                        ? "bg-background text-foreground shadow-sm font-medium"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </CardHeader>
                <CardContent className="h-80">
                    {!data.hasStocks ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Ajoutez des actions pour voir le graphique</p>
                        </div>
                    ) : loading ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Chargement...</p>
                        </div>
                    ) : displayChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={displayChartData}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis dataKey="date" stroke="currentColor" tick={{ fontSize: 12 }} />
                                <YAxis
                                    stroke="currentColor"
                                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(1)}k€` : `${v}€`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "hsl(var(--card))",
                                        border: "1px solid hsl(var(--border))",
                                        borderRadius: "0.5rem",
                                    }}
                                    formatter={(value) => [`${Number(value).toLocaleString("fr-FR")} €`, "Valeur"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="valeur"
                                    stroke="#38bdf8"
                                    strokeWidth={2}
                                    dot={displayChartData.length < 15 ? { fill: "#38bdf8", r: 3 } : false}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <p>Visitez le dashboard chaque jour pour construire l'historique</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    )
}
