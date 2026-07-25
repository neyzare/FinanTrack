import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { REGIME_LABELS, SEVERITY_LABELS, type Anomaly, type AnomalyReport as Report } from "@/app/types/anomaly";

const severityStyles: Record<string, string> = {
    low: "text-muted-foreground border-current",
    medium: "text-warning border-current",
    high: "text-destructive border-current",
    critical: "bg-destructive text-white border-transparent",
};

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function AnomalyRow({ anomaly }: { anomaly: Anomaly }) {
    const severity = SEVERITY_LABELS[anomaly.severity] ?? anomaly.severity;
    const regime = REGIME_LABELS[anomaly.regime] ?? anomaly.regime;
    const scorePercent = Math.round(anomaly.composite_score * 100);

    return (
        <li className="border-t pt-4 first:border-t-0 first:pt-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-baseline gap-3">
                    <span className="font-medium">{formatDate(anomaly.date)}</span>
                    <span className="text-sm text-muted-foreground">
                        clôture {anomaly.close.toFixed(2)} $
                    </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className={severityStyles[anomaly.severity] ?? "text-foreground"}>
                        sévérité {severity}
                    </Badge>
                    <Badge variant="outline">régime {regime}</Badge>
                    <Badge variant="outline">{anomaly.anomaly_type}</Badge>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-2">
                <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${scorePercent}%` }} />
                </div>
                <span className="text-xs text-muted-foreground tabular-nums">
                    score {anomaly.composite_score.toFixed(3)}
                </span>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{anomaly.explanation}</p>
        </li>
    );
}

export function AnomalyReport({ report }: { report: Report }) {
    const metrics = [
        { label: "Séances analysées", value: report.n_observations.toString() },
        { label: "Anomalies détectées", value: report.n_anomalies.toString() },
        { label: "Facteurs", value: report.factors.join(", ") || "aucun" },
        { label: "Source", value: report.data_source },
    ];

    return (
        <Card className="border-2">
            <CardHeader>
                <CardTitle className="font-semibold">Détection d&apos;anomalies — {report.symbol}</CardTitle>
                <CardDescription>
                    {report.period_days} jours glissants
                    {report.benchmark && `, benchmark ${report.benchmark}`}
                    {" · anomalies classées par score composite décroissant"}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {metrics.map((metric) => (
                        <div key={metric.label}>
                            <p className="text-sm text-muted-foreground">{metric.label}</p>
                            <p className="text-lg">{metric.value}</p>
                        </div>
                    ))}
                </div>

                {report.anomalies.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        Aucune anomalie au-dessus du seuil sur la période : le titre est resté dans son
                        comportement statistique habituel.
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {report.anomalies.map((anomaly) => (
                            <AnomalyRow key={`${anomaly.date}-${anomaly.composite_score}`} anomaly={anomaly} />
                        ))}
                    </ul>
                )}
            </CardContent>
        </Card>
    );
}