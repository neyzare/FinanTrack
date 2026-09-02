"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Button } from "@/app/components/ui/button";
import { Calculator as CalcIcon, Save } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { calculerInteretsComposes, formatEuros } from "../utils/calculs";
import { exporterPDF } from "../utils/pdfExport";

export function InteretsComposesTab() {
  const [capital, setCapital] = useState(10000);
  const [apportMensuel, setApportMensuel] = useState(200);
  const [tauxAnnuel, setTauxAnnuel] = useState(7);
  const [annees, setAnnees] = useState(10);

  const donnees = calculerInteretsComposes({
    capital,
    apportMensuel,
    tauxAnnuel,
    annees,
  });
  const valeurFinale = donnees[donnees.length - 1]?.valeur ?? 0;
  const totalVerse = capital + apportMensuel * 12 * annees;
  const totalInterets = valeurFinale - totalVerse;

  const exporter = () => {
    exporterPDF("Intérêts composés", [
      {
        titre: "Paramètres",
        lignes: [
          { label: "Capital initial", valeur: formatEuros(capital) },
          { label: "Apport mensuel", valeur: formatEuros(apportMensuel) },
          {
            label: "Taux annuel",
            valeur: `${tauxAnnuel.toLocaleString("fr-FR")} %`,
          },
          { label: "Durée", valeur: `${annees} ans` },
        ],
      },
      {
        titre: "Résultats",
        lignes: [
          { label: "Valeur finale", valeur: formatEuros(valeurFinale) },
          { label: "Total versé", valeur: formatEuros(totalVerse) },
          { label: "Intérêts gagnés", valeur: formatEuros(totalInterets) },
        ],
      },
    ]);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="border-2 lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalcIcon className="w-5 h-5 text-primary" />
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
            <p className="text-xs text-muted-foreground">
              {capital.toLocaleString("fr-FR")} €
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="apport">Apport mensuel</Label>
            <Input
              id="apport"
              type="number"
              value={apportMensuel}
              onChange={(e) => setApportMensuel(Number(e.target.value))}
            />
            <p className="text-xs text-muted-foreground">
              {apportMensuel.toLocaleString("fr-FR")} €
            </p>
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
          <Button className="w-full" onClick={exporter}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </CardContent>
      </Card>

      <Card className="border-2 lg:col-span-2">
        <CardHeader>
          <CardTitle>Évolution du capital</CardTitle>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valeur finale</p>
              <p className="text-xl text-success">
                {valeurFinale.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total versé</p>
              <p className="text-xl">{totalVerse.toLocaleString("fr-FR")} €</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Intérêts gagnés</p>
              <p className="text-xl text-primary">
                {totalInterets.toLocaleString("fr-FR")} €
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={donnees}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis
                  dataKey="annee"
                  label={{
                    value: "Années",
                    position: "insideBottom",
                    offset: -5,
                    fill: "currentColor",
                  }}
                  stroke="currentColor"
                />
                <YAxis
                  stroke="currentColor"
                  tickFormatter={(valeur: number) =>
                    `${(valeur / 1000).toFixed(0)}k€`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "0.5rem",
                  }}
                  labelStyle={{ color: "var(--card-foreground)" }}
                  itemStyle={{ color: "var(--card-foreground)" }}
                  formatter={(valeur) => [
                    `${Number(valeur).toLocaleString("fr-FR")} €`,
                    "Valeur",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="valeur"
                  stroke="var(--chart-1)"
                  strokeWidth={3}
                  dot={{ fill: "var(--chart-1)" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
