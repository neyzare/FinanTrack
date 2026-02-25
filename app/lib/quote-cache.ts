"use server"

import { prisma } from "@/app/lib/prisma"
import { getStocks } from "@/app/lib/Finnhub"

const STALE_MS = 5 * 60 * 1000

export interface CachedQuoteData {
    price: number
    variation: number | null
}

export async function getCachedQuotes(tickers: string[]): Promise<Map<string, CachedQuoteData>> {
    if (tickers.length === 0) return new Map()

    const keys = tickers.map((t) => t.toUpperCase())
    const rows = await prisma.cachedQuote.findMany({
        where: { ticker: { in: keys } },
    })

    const map = new Map<string, CachedQuoteData>()
    for (const row of rows) {
        map.set(row.ticker, {
            price: row.price,
            variation: row.variation,
        })
    }
    return map
}

export async function getQuotesForDisplay(tickers: string[]): Promise<Map<string, CachedQuoteData>> {
    if (tickers.length === 0) return new Map()

    const keys = tickers.map((t) => t.toUpperCase())
    const rows = await prisma.cachedQuote.findMany({
        where: { ticker: { in: keys } },
    })

    const map = new Map<string, CachedQuoteData>()
    const staleOrMissing: string[] = []
    const now = Date.now()

    for (const row of rows) {
        map.set(row.ticker, { price: row.price, variation: row.variation })
        if (now - row.updatedAt.getTime() > STALE_MS) {
            staleOrMissing.push(row.ticker)
        }
    }
    for (const key of keys) {
        if (!map.has(key)) staleOrMissing.push(key)
    }

    if (staleOrMissing.length > 0) {
        refreshQuotesInBackground(staleOrMissing).catch((e) =>
            console.error("[quote-cache] background refresh failed:", e)
        )
    }

    return map
}

async function refreshQuotesInBackground(tickers: string[]): Promise<void> {
    for (const ticker of tickers) {
        try {
            const quote = await getStocks(ticker)
            if (quote?.c == null) continue

            await prisma.cachedQuote.upsert({
                where: { ticker },
                update: {
                    price: quote.c,
                    variation: quote.dp ?? null,
                },
                create: {
                    ticker,
                    price: quote.c,
                    variation: quote.dp ?? null,
                },
            })
        } catch (e) {
            console.error(`[quote-cache] fetch ${ticker}:`, e)
        }
    }
}

export async function fetchAndCacheQuote(ticker: string): Promise<CachedQuoteData | null> {
    const quote = await getStocks(ticker)
    if (quote?.c == null) return null

    const key = ticker.toUpperCase()
    await prisma.cachedQuote.upsert({
        where: { ticker: key },
        update: { price: quote.c, variation: quote.dp ?? null },
        create: { ticker: key, price: quote.c, variation: quote.dp ?? null },
    })
    return { price: quote.c, variation: quote.dp ?? null }
}
