"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Moon, Sun, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { toast } from "sonner";
import deleteAccount from "@/app/lib/deleteAccount";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/components/ThemeProvider";

export function Settings() {
    const router = useRouter();
    const { theme, isDarkMode, setTheme } = useTheme();

    const handleDeleteAccount = async () => {
        toast.success("Demande de suppression de compte envoyée");
        await deleteAccount();
        router.push("/");
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <Card>
                <CardHeader>
                    <CardTitle>Apparence</CardTitle>
                    <CardDescription>
                        Choisissez le thème de l&apos;interface. Le choix est conservé sur cet appareil.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            {isDarkMode ? (
                                <Moon className="w-5 h-5 text-muted-foreground" />
                            ) : (
                                <Sun className="w-5 h-5 text-muted-foreground" />
                            )}
                            <div>
                                <p className="font-medium">
                                    Thème {isDarkMode ? "sombre" : "clair"}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Actuellement actif&nbsp;: <span className="font-medium">{theme}</span>
                                </p>
                            </div>
                        </div>

                        <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                            <button
                                type="button"
                                onClick={() => setTheme("light")}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                                    !isDarkMode
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Sun className="w-4 h-4" />
                                Clair
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme("dark")}
                                className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                                    isDarkMode
                                        ? "bg-background text-foreground shadow-sm"
                                        : "text-muted-foreground hover:text-foreground"
                                }`}
                            >
                                <Moon className="w-4 h-4" />
                                Sombre
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-2 border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
                    <CardDescription>
                        Actions irréversibles sur votre compte
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="gap-2">
                                <Trash2 className="w-4 h-4" />
                                Supprimer mon compte
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Cela supprimera définitivement votre
                                    compte et toutes vos données de nos serveurs.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    Oui, supprimer mon compte
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
