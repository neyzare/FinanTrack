"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, TrendingDown } from "lucide-react";

export default function NotFound() {
    const router = useRouter();

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
            <div className="relative mb-8 select-none">
                <span className="text-[10rem] font-black leading-none text-muted/30 tracking-tighter">
                    404
                </span>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                        <TrendingDown className="w-14 h-14 text-primary" strokeWidth={1.5} />
                        <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                            Page introuvable
                        </span>
                    </div>
                </div>
            </div>

            <h1 className="text-2xl font-bold mb-3">
                Oups, cette page n&apos;existe pas
            </h1>
            <p className="text-muted-foreground max-w-sm mb-8">
                La page que vous cherchez a peut-être été déplacée, supprimée,
                ou n&apos;a jamais existé. Vérifiez l&apos;URL ou retournez à l&apos;accueil.
            </p>

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Retour
                </Button>
                <Button
                    onClick={() => router.push("/")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
                >
                    Accueil
                </Button>
            </div>
        </div>
    );
}
