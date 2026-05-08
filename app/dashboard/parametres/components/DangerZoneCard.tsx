"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Trash2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import deleteAccount from "@/app/lib/deleteAccount";

export function DangerZoneCard() {
    const router = useRouter();

    const handleDeleteAccount = async () => {
        toast.success("Demande de suppression de compte envoyée");
        await deleteAccount();
        router.push("/");
    };

    return (
        <Card className="border-2 border-destructive">
            <CardHeader>
                <CardTitle className="text-destructive">Zone dangereuse</CardTitle>
                <CardDescription>Actions irréversibles sur votre compte</CardDescription>
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
                                className="bg-destructive hover:bg-destructive/90 text-white"
                            >
                                Oui, supprimer mon compte
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
