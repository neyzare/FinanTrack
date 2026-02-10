'use client';

import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Activity, Target } from 'lucide-react';

export default function DashboardPage() {

    const totalValue = 45234.50;
    const portfolioChange = 2.5; // +2.5%

    const monthlyRevenue = 1234.56;
    const yesterdayPerformance = -0.8;

    const globalPerformance = 15.3;
    const globalPerformanceChange = 1.2;

    const stats = [
        {
            title: 'Valeur totale du portefeuille',
            value: totalValue,
            change: portfolioChange,
            changeLabel: 'depuis hier',
            icon: DollarSign,
            iconColor: 'text-blue-500',
            iconBg: 'bg-blue-500/10',
        },
        {
            title: 'Revenus mensuels',
            value: monthlyRevenue,
            change: yesterdayPerformance,
            changeLabel: 'depuis hier',
            icon: Activity,
            iconColor: 'text-green-500',
            iconBg: 'bg-green-500/10',
        },
        {
            title: 'Performance globale',
            value: globalPerformance,
            isPercentage: true,
            change: globalPerformanceChange,
            changeLabel: 'ce mois',
            icon: Target,
            iconColor: 'text-purple-500',
            iconBg: 'bg-purple-500/10',
        },
    ];

    return (
        <>
            <div className="mb-6">
                <h3 className="text-3xl font-bold pb-2">Dashboard</h3>
                <p className="text-muted-foreground">Vue d'ensemble de votre portefeuille</p>
            </div>

            {/* Grid des 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
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
                                {stat.isPercentage ? (
                                    `${stat.value}%`
                                ) : (
                                    `${stat.value.toLocaleString('fr-FR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2
                                    })} €`
                                )}
                            </div>

                            <div className="flex items-center gap-1 text-sm">
                                {stat.change >= 0 ? (
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-500" />
                                )}
                                <span className={stat.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                                    {stat.change >= 0 ? '+' : ''}{stat.change}%
                                </span>
                                <span className="text-muted-foreground">{stat.changeLabel}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    );
}