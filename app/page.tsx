import {
  TrendingUp,
  BarChart3,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: TrendingUp,
    title: "Suivi des positions",
    description:
      "Vos actions, leur valeur du jour et l'écart avec votre prix d'achat.",
  },
  {
    icon: BarChart3,
    title: "Analyse",
    description:
      "Indicateurs, graphique et détection des mouvements de prix inhabituels.",
  },
  {
    icon: Calculator,
    title: "Calculatrice",
    description:
      "Intérêts composés, rendement, dépenses : les calculs que vous faisiez sur un coin de feuille.",
  },
];

// Données affichées dans l'aperçu du hero
const positions = [
  {
    ticker: "NVDA",
    name: "NVIDIA",
    value: "2 310,75",
    change: "+3,4",
    up: true,
  },
  {
    ticker: "AAPL",
    name: "Apple",
    value: "1 240,00",
    change: "+1,2",
    up: true,
  },
  {
    ticker: "MSFT",
    name: "Microsoft",
    value: "980,50",
    change: "+0,8",
    up: true,
  },
  { ticker: "TSLA", name: "Tesla", value: "612,30", change: "-0,4", up: false },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="paper-grid border-b border-border">
        <div className="container mx-auto px-6 lg:px-10 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="eyebrow">Grand livre personnel</span>
              <h1 className="font-display text-4xl lg:text-6xl font-semibold leading-[1.05] mt-5 mb-6">
                Vos finances,
                <br />
                tenues au centime.
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mb-8 leading-relaxed">
                Vos positions, vos dépenses et vos rendements au même endroit,
                avec les cours du marché mis à jour.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/dashboard">
                  <Button size="lg">
                    Ouvrir mon registre
                    <ArrowUpRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link
                  href="/login"
                  className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-border"
                >
                  J’ai déjà un compte
                </Link>
              </div>
            </div>

            {/* Feuille de compte */}
            <div className="relative">
              <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                  <span className="eyebrow">Portefeuille</span>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground tabular">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    14:32
                  </span>
                </div>
                <div className="px-6 py-6">
                  <p className="text-sm text-muted-foreground mb-1">
                    Valeur totale
                  </p>
                  <div className="flex items-end gap-3">
                    <span className="tabular text-4xl font-semibold text-foreground">
                      24 817,40 €
                    </span>
                    <span className="flex items-center gap-0.5 text-success tabular text-sm mb-1.5">
                      <ArrowUpRight className="w-4 h-4" />
                      +2,14 %
                    </span>
                  </div>
                </div>
                <div className="border-t border-border">
                  {positions.map((p) => (
                    <div
                      key={p.ticker}
                      className="flex items-center justify-between px-6 py-3 border-b border-border last:border-b-0"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="tabular font-semibold text-sm w-12">
                          {p.ticker}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {p.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="tabular text-sm text-foreground">
                          {p.value} €
                        </span>
                        <span
                          className={`tabular text-sm flex items-center gap-0.5 w-16 justify-end ${
                            p.up ? "text-success" : "text-destructive"
                          }`}
                        >
                          {p.up ? (
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5" />
                          )}
                          {p.change} %
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="container mx-auto px-6 lg:px-10 py-24">
        <div className="max-w-2xl mb-14">
          <span className="eyebrow">Ce qu’il y a dedans</span>
          <h2 className="font-display text-3xl lg:text-4xl font-semibold mt-4">
            Tout votre argent sur une même page
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border border border-border rounded-xl overflow-hidden">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card p-8 hover:bg-accent transition-colors"
            >
              <div className="w-11 h-11 rounded-[10px] bg-accent flex items-center justify-center mb-5">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-y border-border bg-muted/40">
        <div className="container mx-auto px-6 lg:px-10 py-24">
          <div className="max-w-2xl mb-14">
            <span className="eyebrow">Pour commencer</span>
            <h2 className="font-display text-3xl lg:text-4xl font-semibold mt-4">
              Deux étapes, pas plus
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-border border border-border rounded-xl overflow-hidden">
            {[
              {
                step: "01",
                title: "Créez votre compte",
                text: "Un email, un mot de passe. Rien à payer, rien à installer.",
              },
              {
                step: "02",
                title: "Ajoutez vos actions",
                text: "Suivez vos vraies positions, ou entraînez-vous d'abord sur le portefeuille fictif.",
              },
            ].map((s) => (
              <div key={s.step} className="bg-card p-8 flex gap-5">
                <span className="tabular text-2xl font-semibold text-brass shrink-0">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">
                    {s.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {s.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi ce projet */}
      <section className="container mx-auto px-6 lg:px-10 py-24">
        <div className="max-w-3xl">
          <span className="eyebrow">Pourquoi ce projet</span>
          <blockquote className="font-display text-2xl lg:text-3xl leading-snug mt-5 text-foreground">
            « Je suivais mon portefeuille sur un tableur, et je passais plus de
            temps à rattraper mes formules qu’à regarder mes positions.
            FinanTrack est né{" "}
            <span className="text-primary">de ce fichier Excel</span>. »
          </blockquote>
          <p className="text-sm text-muted-foreground mt-6 tabular">
            Lucas, créateur de FinanTrack
          </p>
        </div>
      </section>

      {/* CTA final */}
      <section className="container mx-auto px-6 lg:px-10 pb-24">
        <Card className="bg-primary border-0 text-primary-foreground overflow-hidden paper-grid">
          <CardContent className="p-12 lg:p-16 text-center flex flex-col items-center gap-6">
            <h2 className="font-display text-3xl lg:text-5xl font-semibold max-w-2xl">
              Ouvrez votre registre
            </h2>
            <p className="text-lg text-primary-foreground/80 max-w-xl">
              Commencez sur le portefeuille fictif si vous préférez tester
              avant.
            </p>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-card text-primary hover:bg-card/90"
              >
                Commencer gratuitement
                <Check className="w-4 h-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
