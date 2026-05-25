"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Logo } from "../components/Logo";
import { forgotPasswordAction } from "@/app/lib/forgotPasswordAction";
import {useActionState} from "react";

export default function ForgotPasswordPage() {

    const [forgotPasswordState, forgotFormAction] = useActionState(forgotPasswordAction, null);
    return (
        <>
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
                <Card className="w-full max-w-md border-2 shadow-xl">
                    <CardHeader className="space-y-3">
                        <div className="flex justify-center">
                            <Logo showText={true} />
                        </div>
                        <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
                        <CardDescription>
                            Entrez votre adresse email, nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <form className="space-y-4" action={forgotFormAction}>
                            <div className="space-y-2">
                                <Label htmlFor="forgot-email">Email</Label>
                                <Input
                                    id="forgot-email"
                                    name="email"
                                    type="email"
                                    placeholder="nom@exemple.com"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-[#38BDF8] hover:bg-[#38BDF8]/90"
                            >
                                Envoyer le lien de réinitialisation
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