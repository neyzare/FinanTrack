import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import {Button} from "@/app/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from '@/app/components/ui/avatar';
import { Trash2 } from 'lucide-react';
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
import {useRouter} from "next/navigation";

interface SettingsProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export function Settings({ isDarkMode, onToggleTheme }: SettingsProps) {

    const router = useRouter()
    const handleSaveProfile = () => {
        toast.success('Profil mis à jour avec succès !');
    };

    const  handleDeleteAccount = async () => {
        toast.success('Demande de suppression de compte envoyée');
        await deleteAccount()
        router.push("/")
    };

    return (
        <div className="space-y-6 max-w-4xl">
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
