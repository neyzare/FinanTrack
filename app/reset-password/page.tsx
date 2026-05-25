"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Logo } from "../components/Logo";
import {useActionState} from "react";
import {resetPasswordAction} from "@/app/lib/resetPasswordAction";
import {useSearchParams} from "next/navigation";

export default function ResetPasswordPage() {
    const [_resetFormState, resetFormAction] = useActionState(resetPasswordAction, null)
    const token = useSearchParams().get("token") ?? ""

    return (
        <>
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md border-2 shadow-xl">
                    <CardHeader className="space-y-3">
                        <div className="flex justify-center">
                            <Logo showText={true} />
                        </div>
                        <CardTitle className="text-2xl">Nouveau mot de passe</CardTitle>
                        <CardDescription>
                            Choisissez un nouveau mot de passe pour votre compte Finantrack.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form className="space-y-4" action={resetFormAction}>
                            <input type="hidden" name="token" value={token} />

                            <div className="space-y-2">
                                <Label htmlFor="reset-password">Nouveau mot de passe</Label>
                                <Input
                                    id="reset-password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={12}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimum 12 caractères avec lettres et chiffres
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reset-confirm">Confirmer le mot de passe</Label>
                                <Input
                                    id="reset-confirm"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={12}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90"
                            >
                                Réinitialiser mon mot de passe
                            </Button>
                        </form>

                        <p className="text-sm text-center text-muted-foreground">
                            <Link href="/login" className="text-[#38BDF8] hover:underline">
                                Retour à la connexion
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}