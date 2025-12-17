"use client"

import {JSX, useState} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Calculator as CalcIcon, TrendingUp, Save } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DonneesGraphique {
    annee: number;
    valeur: number;
}

interface DonneesDepenses {
    categorie: string;
    valeur: number;
}

function Calculatrice(): JSX.Element {
    const [capital, setCapital] = useState<number>(10000);
    const [apportMensuel, setApportMensuel] = useState<number>(200);
    const [tauxAnnuel, setTauxAnnuel] = useState<number>(7);
    const [annees, setAnnees] = useState<number>(10);

    const [investissementInitial, setInvestissementInitial] = useState<number>(5000);
    const [rendementAttendu, setRendementAttendu] = useState<number>(8);
    const [anneesInvestissement, setAnneesInvestissement] = useState<number>(5);

    const [revenus, setRevenus] = useState<number>(3000);
    const [logement, setLogement] = useState<number>(800);
    const [alimentation, setAlimentation] = useState<number>(400);
    const [transport, setTransport] = useState<number>(200);
    const [autres, setAutres] = useState<number>(300);

    const calculerInteretsComposes = (): DonneesGraphique[] => {
        const donnees: DonneesGraphique[] = [];
        let solde: number = capital;
        const tauxMensuel: number = tauxAnnuel / 100 / 12;

        for (let annee = 0; annee <= annees; annee++) {
            donnees.push({
                annee,
                valeur: Math.round(solde),
            });

            for (let mois = 0; mois < 12; mois++) {
                solde = solde * (1 + tauxMensuel) + apportMensuel;
            }
        }
        return donnees;
    };

    const calculerRendement = (): DonneesGraphique[] => {
        const donnees: DonneesGraphique[] = [];
        let valeur: number = investissementInitial;
        const taux: number = rendementAttendu / 100;

        for (let annee = 0; annee <= anneesInvestissement; annee++) {
            donnees.push({
                annee,
                valeur: Math.round(valeur),
            });
            valeur = valeur * (1 + taux);
        }
        return donnees;
    };

    const donneesDepenses: DonneesDepenses[] = [
        { categorie: 'Logement', valeur: logement },
        { categorie: 'Alimentation', valeur: alimentation },
        { categorie: 'Transport', valeur: transport },
        { categorie: 'Autres', valeur: autres },
    ];

    const totalDepenses: number = logement + alimentation + transport + autres;
    const epargne: number = revenus - totalDepenses;
    const tauxEpargne: number = (epargne / revenus) * 100;

    const donneesComposes: DonneesGraphique[] = calculerInteretsComposes();
    const donneesRendement: DonneesGraphique[] = calculerRendement();
    const valeurFinale: number = donneesComposes[donneesComposes.length - 1]?.valeur || 0;
    const totalVerse: number = capital + apportMensuel * 12 * annees;
    const totalInterets: number = valeurFinale - totalVerse;

    const sauvegarder = (typeCalcul: string): void => {
        alert(`${typeCalcul} sauvegardé !`);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl mb-2">Calculatrice Financière</h1>
                <p className="text-muted-foreground">
                    Outils de calcul pour planifier vos investissements et budget
                </p>
            </div>

            <Tabs defaultValue="composes" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="composes">Intérêts composés</TabsTrigger>
                    <TabsTrigger value="rendement">Rendement</TabsTrigger>
                    <TabsTrigger value="depenses">Dépenses</TabsTrigger>
                </TabsList>

                <TabsContent value="composes" className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card className="border-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CalcIcon className="w-5 h-5 text-[#38BDF8]" />
                                    Paramètres
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="capital">Capital initial</Label>
                                    <Input
                                        id="capital"
                                        type="number"
                                        value={capital}
                                        onChange={(e) => setCapital(Number(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground">{capital.toLocaleString('fr-FR')} €</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="apport">Apport mensuel</Label>
                                    <Input
                                        id="apport"
                                        type="number"
                                        value={apportMensuel}
                                        onChange={(e) => setApportMensuel(Number(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground">{apportMensuel.toLocaleString('fr-FR')} €</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="taux">Taux annuel (%)</Label>
                                    <Input
                                        id="taux"
                                        type="number"
                                        value={tauxAnnuel}
                                        onChange={(e) => setTauxAnnuel(Number(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="annees">Durée (années)</Label>
                                    <Input
                                        id="annees"
                                        type="number"
                                        value={annees}
                                        onChange={(e) => setAnnees(Number(e.target.value))}
                                    />
                                </div>
                                <Button
                                    className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90"
                                    onClick={() => sauvegarder('Intérêts composés')}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Sauvegarder
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Évolution du capital</CardTitle>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Valeur finale</p>
                                        <p className="text-xl text-[#22C55E]">
                                            {valeurFinale.toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Total versé</p>
                                        <p className="text-xl">
                                            {totalVerse.toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Intérêts gagnés</p>
                                        <p className="text-xl text-[#38BDF8]">
                                            {totalInterets.toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={donneesComposes}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                            <XAxis
                                                dataKey="annee"
                                                label={{ value: 'Années', position: 'insideBottom', offset: -5 }}
                                                stroke="currentColor"
                                            />
                                            <YAxis
                                                stroke="currentColor"
                                                tickFormatter={(valeur: number) => `${(valeur / 1000).toFixed(0)}k€`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    border: '1px solid hsl(var(--border))',
                                                    borderRadius: '0.5rem',
                                                }}
                                                formatter={(valeur: number) => [
                                                    `${valeur.toLocaleString('fr-FR')} €`,
                                                    'Valeur',
                                                ]}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="valeur"
                                                stroke="#38BDF8"
                                                strokeWidth={3}
                                                dot={{ fill: '#38BDF8' }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="rendement" className="space-y-6">
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
                                    <p className="text-xs text-muted-foreground">
                                        {investissementInitial.toLocaleString('fr-FR')} €
                                    </p>
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
                                    <Input
                                        id="duree"
                                        type="number"
                                        value={anneesInvestissement}
                                        onChange={(e) => setAnneesInvestissement(Number(e.target.value))}
                                    />
                                </div>
                                <Button
                                    className="w-full bg-[#22C55E] hover:bg-[#22C55E]/90"
                                    onClick={() => sauvegarder('Rendement attendu')}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Sauvegarder
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Projection de rendement</CardTitle>
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Valeur finale</p>
                                        <p className="text-xl text-[#22C55E]">
                                            {donneesRendement[donneesRendement.length - 1]?.valeur.toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Gain total</p>
                                        <p className="text-xl text-[#38BDF8]">
                                            {((donneesRendement[donneesRendement.length - 1]?.valeur || 0) - investissementInitial).toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={donneesRendement}>
                                            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                                            <XAxis
                                                dataKey="annee"
                                                label={{ value: 'Années', position: 'insideBottom', offset: -5 }}
                                                stroke="currentColor"
                                            />
                                            <YAxis
                                                stroke="currentColor"
                                                tickFormatter={(valeur: number) => `${(valeur / 1000).toFixed(0)}k€`}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'hsl(var(--card))',
                                                    border: '1px solid hsl(var(--border))',
                                                    borderRadius: '0.5rem',
                                                }}
                                                formatter={(valeur: number) => [
                                                    `${valeur.toLocaleString('fr-FR')} €`,
                                                    'Valeur',
                                                ]}
                                            />
                                            <Bar dataKey="valeur" fill="#22C55E" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="depenses" className="space-y-6">
                    <div className="grid lg:grid-cols-3 gap-6">
                        <Card className="border-2 lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Budget mensuel</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="revenus">Revenus mensuels</Label>
                                    <Input
                                        id="revenus"
                                        type="number"
                                        value={revenus}
                                        onChange={(e) => setRevenus(Number(e.target.value))}
                                    />
                                    <p className="text-xs text-muted-foreground">{revenus.toLocaleString('fr-FR')} €</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="logement">Logement</Label>
                                    <Input
                                        id="logement"
                                        type="number"
                                        value={logement}
                                        onChange={(e) => setLogement(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="alimentation">Alimentation</Label>
                                    <Input
                                        id="alimentation"
                                        type="number"
                                        value={alimentation}
                                        onChange={(e) => setAlimentation(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="transport">Transport</Label>
                                    <Input
                                        id="transport"
                                        type="number"
                                        value={transport}
                                        onChange={(e) => setTransport(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="autres">Autres dépenses</Label>
                                    <Input
                                        id="autres"
                                        type="number"
                                        value={autres}
                                        onChange={(e) => setAutres(Number(e.target.value))}
                                    />
                                </div>
                                <Button
                                    className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90"
                                    onClick={() => sauvegarder('Dépenses mensuelles')}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Sauvegarder
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-2 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Analyse des dépenses</CardTitle>
                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Total dépenses</p>
                                        <p className="text-xl text-[#EF4444]">
                                            {totalDepenses.toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Épargne</p>
                                        <p className="text-xl text-[#22C55E]">
                                            {epargne.toLocaleString('fr-FR')} €
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Taux d'épargne</p>
                                        <p className="text-xl text-[#38BDF8]">
                                            {tauxEpargne.toFixed(1)}%
                                        </p>
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
                                                    backgroundColor: 'hsl(var(--card))',
                                                    border: '1px solid hsl(var(--border))',
                                                    borderRadius: '0.5rem',
                                                }}
                                                formatter={(valeur: number) => [`${valeur} €`, 'Montant']}
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
                                                ⚠ Correct. Essayez d'épargner au moins 20% de vos revenus.
                                            </span>
                                        ) : (
                                            <span className="text-[#EF4444]">
                                                ⚠ Attention ! Votre taux d'épargne est faible. Réduisez vos dépenses si possible.
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default Calculatrice;