"use server"

import { z } from "zod"
import type { AnomalyResult } from "@/app/types/anomaly"

const API_URL = process.env.ANOMALY_API_URL

// L'API recalcule tout le modèle à chaque appel, il faut lui laisser le temps
const TIMEOUT_MS = 30_000

const anomalySchema = z.object({
    date: z.string(),
    close: z.number(),
    regime: z.string(),
    anomaly_type: z.string(),
    composite_score: z.number(),
    severity: z.string(),
    explanation: z.string(),
})

const reportSchema = z.object({
    symbol: z.string(),
    benchmark: z.string().nullable(),
    factors: z.array(z.string()),
    period_days: z.number(),
    data_source: z.string(),
    n_observations: z.number(),
    n_anomalies: z.number(),
    anomalies: z.array(anomalySchema),
})

export interface AnomalyOptions {
    benchmark?: string | null
    sector?: string
    styles?: boolean
    days?: number
    threshold?: number
}

/**
 * Interroge l'API Python de détection d'anomalies pour un symbole donné.
 * L'appel reste côté serveur : l'URL de l'API n'est jamais exposée au navigateur.
 */
export async function getAnomalies(symbol: string, options: AnomalyOptions = {}): Promise<AnomalyResult> {
    if (!API_URL) {
        return { success: false, error: "ANOMALY_API_URL n'est pas configurée." }
    }

    const ticker = symbol.trim().toUpperCase()
    if (!/^[A-Z0-9.\-]{1,12}$/.test(ticker)) {
        return { success: false, error: "Symbole boursier invalide." }
    }

    const params = new URLSearchParams()
    // benchmark à null = on désactive le facteur marché côté API
    if (options.benchmark !== undefined && options.benchmark !== null) {
        params.set("benchmark", options.benchmark)
    }
    if (options.sector) params.set("sector", options.sector)
    if (options.styles) params.set("styles", "true")
    if (options.days) params.set("days", String(options.days))
    if (options.threshold !== undefined) params.set("threshold", String(options.threshold))

    try {
        const response = await fetch(
            `${API_URL}/stocks/${encodeURIComponent(ticker)}/anomalies?${params}`,
            { signal: AbortSignal.timeout(TIMEOUT_MS), cache: "no-store" },
        )

        if (!response.ok) {
            if (response.status === 404) {
                return { success: false, error: `Aucune donnée de marché pour ${ticker}.` }
            }
            if (response.status === 422) {
                return { success: false, error: "Paramètres d'analyse refusés par l'API." }
            }
            return { success: false, error: `L'API d'analyse a répondu ${response.status}.` }
        }

        const parsed = reportSchema.safeParse(await response.json())
        if (!parsed.success) {
            console.error("[anomalyApi] réponse inattendue", parsed.error)
            return { success: false, error: "Réponse inattendue de l'API d'analyse." }
        }

        return { success: true, report: parsed.data }
    } catch (error) {
        console.error("[anomalyApi]", error)
        if (error instanceof Error && error.name === "TimeoutError") {
            return { success: false, error: "L'analyse a dépassé le temps imparti." }
        }
        return { success: false, error: "Service d'analyse injoignable." }
    }
}