"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { TrendingUp, Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { calculerRendement, formatEuros } from '../utils/calculs';
import { exporterPDF } from '../utils/pdfExport';

export function RendementTab() {
    const [investissementInitial, setInvestissementInitial] = useState(5000);
    const [rendementAttendu, setRendementAttendu] = useState(8);
    const [annees, setAnnees] = useState(5);

    const donnees = calculerRendement({ investissementInitial, rendementAttendu, annees });
    const valeurFinale = donnees[donnees.length - 1]?.valeur ?? 0;
    const gainTotal = valeurFinale - investissementInitial;

    const exporter = () => {
        exporterPDF('Rendement attendu', [
            {
                titre: 'Paramètres',
                lignes: [
                    { label: 'Investissement initial', valeur: formatEuros(investissementInitial) },
                    { label: 'Rendement annuel attendu', valeur: `${rendementAttendu.toLocaleString('fr-FR')} %` },
                    { label: 'Durée', valeur: `${annees} ans` },
                ],
            },
            {
                titre: 'Résultats',
                lignes: [
                    { label: 'Valeur finale', valeur: formatEuros(valeurFinale) },
                    { label: 'Gain total', valeur: formatEuros(gainTotal) },
                ],
            },
        ]);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                        Paramètres
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="investissement">Investissement initial</Label>
                        <Input
                            id="investissement"
                            type="number"
                            value={investissementInitial}
                            onChange={(e) => setInvestissementInitial(Number(e.target.value))}
                        />
                        <p className="text-xs text-muted-foreground">{investissementInitial.toLocaleString('fr-FR')} €</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="rendement">Rendement annuel attendu (%)</Label>
                        <Input
                            id="rendement"
                            type="number"
                            value={rendementAttendu}
                            onChange={(e) => setRendementAttendu(Number(e.target.value))}
                            step="0.1"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="duree">Durée (années)</Label>
                        <Input id="duree" type="number" value={annees} onChange={(e) => setAnnees(Number(e.target.value))} />
                    </div>
                    <Button className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90" onClick={exporter}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-2 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Projection de rendement</CardTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Valeur finale</p>
                            <p className="text-xl text-[#22C55E]">{valeurFinale.toLocaleString('fr-FR')} €</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Gain total</p>
                            <p className="text-xl text-[#38BDF8]">{gainTotal.toLocaleString('fr-FR')} €</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={donnees}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis
                                    dataKey="annee"
                                    label={{ value: 'Années', position: 'insideBottom', offset: -5, fill: 'currentColor' }}
                                    stroke="currentColor"
                                />
                                <YAxis
                                    stroke="currentColor"
                                    tickFormatter={(valeur: number) => `${(valeur / 1000).toFixed(0)}k€`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '0.5rem',
                                    }}
                                    labelStyle={{ color: 'var(--card-foreground)' }}
                                    itemStyle={{ color: 'var(--card-foreground)' }}
                                    formatter={(valeur) => [`${Number(valeur).toLocaleString('fr-FR')} €`, 'Valeur']}
                                />
                                <Bar dataKey="valeur" fill="#22C55E" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
