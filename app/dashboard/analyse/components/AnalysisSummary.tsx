import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";

const signalBadges = {
    achat: { label: "Achat", className: "bg-green-500" },
    neutre: { label: "Neutre", className: "bg-gray-500" },
    vente: { label: "Vente", className: "bg-red-500" },
};

interface AnalysisSummaryProps {
    signal: "achat" | "neutre" | "vente";
    score: number;
    supports: number[];
    resistances: number[];
    summary: string;
    updatedAt: string;
}

export function AnalysisSummary({ signal, score, supports, resistances, summary, updatedAt }: AnalysisSummaryProps) {
    const badge = signalBadges[signal];

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-semibold">Synthèse de l&apos;analyse</CardTitle>
                <CardDescription>Générée le {updatedAt}</CardDescription>
                <CardAction>
                    <Badge className={`${badge.className} text-white border-transparent`}>{badge.label}</Badge>
                </CardAction>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Score de confiance</span>
                        <span className="font-medium">{score} / 100</span>
                    </div>
                    <Progress value={score} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Supports</p>
                        <div className="flex gap-2">
                            {supports.map((niveau) => (
                                <Badge key={niveau} variant="outline" className="text-green-500 border-green-500">
                                    {niveau.toFixed(2)} $
                                </Badge>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground mb-2">Résistances</p>
                        <div className="flex gap-2">
                            {resistances.map((niveau) => (
                                <Badge key={niveau} variant="outline" className="text-red-500 border-red-500">
                                    {niveau.toFixed(2)} $
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <p className="text-sm leading-relaxed">{summary}</p>
            </CardContent>
        </Card>
    );
}
