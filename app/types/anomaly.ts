export type AnomalySeverity = "low" | "medium" | "high" | "critical";

export interface Anomaly {
    date: string;
    close: number;
    regime: string;
    anomaly_type: string;
    composite_score: number;
    severity: string;
    explanation: string;
}

export interface AnomalyReport {
    symbol: string;
    benchmark: string | null;
    factors: string[];
    period_days: number;
    data_source: string;
    n_observations: number;
    n_anomalies: number;
    anomalies: Anomaly[];
}

export type AnomalyResult =
    | { success: true; report: AnomalyReport }
    | { success: false; error: string };

export const REGIME_LABELS: Record<string, string> = {
    calm: "calme",
    normal: "normal",
    stressed: "stressé",
    crisis: "crise",
};

export const SEVERITY_LABELS: Record<string, string> = {
    low: "faible",
    medium: "moyenne",
    high: "élevée",
    critical: "critique",
};