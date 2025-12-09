"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Logo } from "../components/Logo";
import { ImageWithFallback } from "@/app/components/ImageWithFallBack";
import { loginAction } from "@/app/data/action/authAction";
import { registerAction } from "@/app/data/action/registerAction";
import { useFormState, useFormStatus } from "react-dom";

// Composant pour le bouton avec état de chargement
function SubmitButton({ children, variant = "login" }: { children: React.ReactNode; variant?: "login" | "signup" }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className={`w-full ${variant === "signup" ? "bg-[#22C55E] hover:bg-[#22C55E]/90" : "bg-[#38BDF8] hover:bg-[#38BDF8]/90"}`}
            disabled={pending}
        >
            {pending ? "Chargement..." : children}
        </Button>
    );
}

export default function AuthForm() {
    const [loginState, loginFormAction] = useFormState(loginAction, null);
    const [registerState, registerFormAction] = useFormState(registerAction, null);

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

                <div className="hidden lg:block">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#38BDF8]/20 to-[#22C55E]/20 rounded-3xl blur-3xl"></div>
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1758411898049-4de9588be514?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkYXNoYm9hcmQlMjBpbnRlcmZhY2V8ZW58MXx8fHwxNzYxNjAyNjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Dashboard Preview"
                            className="relative rounded-2xl shadow-2xl"
                        />
                        <div className="absolute bottom-8 left-8 right-8 bg-card/95 backdrop-blur-sm p-6 rounded-xl border-2">
                            <Logo showText={true} />
                            <p className="mt-3 text-muted-foreground">
                                Faites confiance à Finantrack pour gérer votre portefeuille.
                            </p>
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

                            {/* Formulaire de connexion */}
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
                                            <a href="#" className="text-sm text-[#38BDF8] hover:underline">
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
                                    <SubmitButton variant="login">Se connecter</SubmitButton>
                                </form>
                            </TabsContent>

                            {/* Formulaire d'inscription */}
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
                                            Minimum 8 caractères avec lettres et chiffres
                                        </p>
                                    </div>
                                    <SubmitButton variant="signup">Créer un compte</SubmitButton>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}