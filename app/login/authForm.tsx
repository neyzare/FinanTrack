"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Logo } from "../components/Logo";
import { loginAction } from "@/app/lib/authAction";
import { registerAction } from "@/app/lib/registerAction";
import { useFormStatus } from "react-dom";
import { useActionState } from "react";

function SubmitButton({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Chargement..." : children}
    </Button>
  );
}

export default function AuthForm() {
  const [loginState, loginFormAction] = useActionState(loginAction, null);
  const [registerState, registerFormAction] = useActionState(
    registerAction,
    null,
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block">
          <div className="paper-grid border border-border rounded-2xl p-10 h-full flex flex-col justify-between gap-10 bg-card/40">
            <div>
              <Logo showText={true} />
              <h2 className="font-display text-3xl font-semibold mt-8 leading-tight">
                Chaque chiffre
                <br />a sa ligne.
              </h2>
              <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
                Votre portefeuille, vos dépenses et vos rendements - tenus au
                centime, comme un grand livre.
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <span className="eyebrow">Aperçu</span>
                <span className="tabular text-xs text-success">+2,14 %</span>
              </div>
              {[
                { t: "NVDA", v: "2 310,75" },
                { t: "AAPL", v: "1 240,00" },
                { t: "MSFT", v: "980,50" },
              ].map((r) => (
                <div
                  key={r.t}
                  className="flex items-center justify-between px-5 py-2.5 border-b border-border last:border-b-0"
                >
                  <span className="tabular text-sm font-semibold">{r.t}</span>
                  <span className="tabular text-sm text-muted-foreground">
                    {r.v} €
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Card className="border-2 shadow-xl">
          <CardHeader className="space-y-3">
            <div className="lg:hidden flex justify-center">
              <Logo showText={true} />
            </div>
            <CardTitle className="text-2xl">Bienvenue sur Finantrack</CardTitle>
            <CardDescription>
              Connectez-vous ou créez un compte pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Connexion</TabsTrigger>
                <TabsTrigger value="signup">Inscription</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                {loginState?.error && (
                  <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
                    {loginState.error}
                  </div>
                )}

                <form action={loginFormAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Mot de passe</Label>
                      <a
                        href="/forgot-password"
                        className="text-sm text-primary hover:underline"
                      >
                        Mot de passe oublié ?
                      </a>
                    </div>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <SubmitButton>Se connecter</SubmitButton>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {registerState?.error && (
                  <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-lg text-sm mb-4">
                    {registerState.error}
                  </div>
                )}

                <form action={registerFormAction} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Nom complet</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      name="fullname"
                      placeholder="Jean Dupont"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      name="email"
                      placeholder="nom@exemple.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Mot de passe</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimum 12 caractères avec lettres et chiffres
                    </p>
                  </div>
                  <SubmitButton>Créer un compte</SubmitButton>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
