"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Button } from '@/app/components/ui/button';
import { Save } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatEuros } from '../utils/calculs';
import { exporterPDF } from '../utils/pdfExport';
import type { DonneesDepenses } from '../types';

export function DepensesTab() {
    const [revenus, setRevenus] = useState(3000);
    const [logement, setLogement] = useState(800);
    const [alimentation, setAlimentation] = useState(400);
    const [transport, setTransport] = useState(200);
    const [autres, setAutres] = useState(300);

    const donneesDepenses: DonneesDepenses[] = [
        { categorie: 'Logement', valeur: logement },
        { categorie: 'Alimentation', valeur: alimentation },
        { categorie: 'Transport', valeur: transport },
        { categorie: 'Autres', valeur: autres },
    ];

    const totalDepenses = logement + alimentation + transport + autres;
    const epargne = revenus - totalDepenses;
    const tauxEpargne = revenus > 0 ? (epargne / revenus) * 100 : 0;

    const exporter = () => {
        exporterPDF('Dépenses mensuelles', [
            {
                titre: 'Budget mensuel',
                lignes: [
                    { label: 'Revenus', valeur: formatEuros(revenus) },
                    { label: 'Logement', valeur: formatEuros(logement) },
                    { label: 'Alimentation', valeur: formatEuros(alimentation) },
                    { label: 'Transport', valeur: formatEuros(transport) },
                    { label: 'Autres dépenses', valeur: formatEuros(autres) },
                ],
            },
            {
                titre: 'Analyse',
                lignes: [
                    { label: 'Total dépenses', valeur: formatEuros(totalDepenses) },
                    { label: 'Épargne', valeur: formatEuros(epargne) },
                    { label: "Taux d'épargne", valeur: `${tauxEpargne.toFixed(1)} %` },
                ],
            },
        ]);
    };

    return (
        <div className="grid lg:grid-cols-3 gap-6">
            <Card className="border-2 lg:col-span-1">
                <CardHeader>
                    <CardTitle>Budget mensuel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="revenus">Revenus mensuels</Label>
                        <Input id="revenus" type="number" value={revenus} onChange={(e) => setRevenus(Number(e.target.value))} />
                        <p className="text-xs text-muted-foreground">{revenus.toLocaleString('fr-FR')} €</p>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="logement">Logement</Label>
                        <Input id="logement" type="number" value={logement} onChange={(e) => setLogement(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="alimentation">Alimentation</Label>
                        <Input id="alimentation" type="number" value={alimentation} onChange={(e) => setAlimentation(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="transport">Transport</Label>
                        <Input id="transport" type="number" value={transport} onChange={(e) => setTransport(Number(e.target.value))} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="autres">Autres dépenses</Label>
                        <Input id="autres" type="number" value={autres} onChange={(e) => setAutres(Number(e.target.value))} />
                    </div>
                    <Button className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90" onClick={exporter}>
                        <Save className="w-4 h-4 mr-2" />
                        Sauvegarder
                    </Button>
                </CardContent>
            </Card>

            <Card className="border-2 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Analyse des dépenses</CardTitle>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Total dépenses</p>
                            <p className="text-xl text-[#EF4444]">{totalDepenses.toLocaleString('fr-FR')} €</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Épargne</p>
                            <p className="text-xl text-[#22C55E]">{epargne.toLocaleString('fr-FR')} €</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Taux d&#39;épargne</p>
                            <p className="text-xl text-[#38BDF8]">{tauxEpargne.toFixed(1)}%</p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={donneesDepenses}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                <XAxis dataKey="categorie" stroke="currentColor" />
                                <YAxis stroke="currentColor" tickFormatter={(valeur: number) => `${valeur}€`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--card)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '0.5rem',
                                    }}
                                    labelStyle={{ color: 'var(--card-foreground)' }}
                                    itemStyle={{ color: 'var(--card-foreground)' }}
                                    formatter={(valeur) => [`${valeur} €`, 'Montant']}
                                />
                                <Bar dataKey="valeur" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-6 p-4 bg-muted rounded-lg">
                        <p className="text-sm">
                            {tauxEpargne >= 20 ? (
                                <span className="text-[#22C55E]">
                                    ✓ Excellent ! Vous épargnez {tauxEpargne.toFixed(1)}% de vos revenus.
                                </span>
                            ) : tauxEpargne >= 10 ? (
                                <span className="text-[#F59E0B]">
                                    ⚠ Correct. Essayez d&apos;épargner au moins 20% de vos revenus.
                                </span>
                            ) : (
                                <span className="text-[#EF4444]">
                                    ⚠ Attention ! Votre taux d&#39;épargne est faible. Réduisez vos dépenses si possible.
                                </span>
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
