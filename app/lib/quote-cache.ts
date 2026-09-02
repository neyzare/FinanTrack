"use server";

import { prisma } from "@/app/lib/prisma";
import { getStocks } from "@/app/lib/Finnhub";

// Durée avant qu'un prix en cache soit considéré comme périmé
const STALE_MS = 5 * 60 * 1000; // 5 minutes

export interface CachedQuoteData {
  price: number;
  variation: number | null;
}

/**
 * Lit les prix depuis la table CachedQuote.
 * Si des tickers sont périmés ou absents, déclenche un rafraîchissement en arrière-plan.
 */
export async function getQuotesForDisplay(
  tickers: string[],
): Promise<Map<string, CachedQuoteData>> {
  if (tickers.length === 0) return new Map();

  const keys = tickers.map((t) => t.toUpperCase());
  const rows = await prisma.cachedQuote.findMany({
    where: { ticker: { in: keys } },
  });

  const map = new Map<string, CachedQuoteData>();
  const staleOrMissing: string[] = [];
  const now = Date.now();

  for (const row of rows) {
    map.set(row.ticker, { price: row.price, variation: row.variation });
    if (now - row.updatedAt.getTime() > STALE_MS) {
      staleOrMissing.push(row.ticker);
    }
  }
  for (const key of keys) {
    if (!map.has(key)) staleOrMissing.push(key);
  }

  if (staleOrMissing.length > 0) {
    refreshQuotes(staleOrMissing).catch((e) =>
      console.error("[quote-cache] background refresh failed:", e),
    );
  }

  return map;
}

/**
 * Récupère un prix depuis l'API et le sauvegarde en cache.
 * Utilisé lors de l'ajout d'une action pour avoir un prix immédiat.
 */
export async function fetchAndCacheQuote(
  ticker: string,
): Promise<CachedQuoteData | null> {
  const quote = await getStocks(ticker);
  if (quote?.c == null) return null;

  const key = ticker.toUpperCase();
  await upsertQuote(key, quote.c, quote.dp ?? null);
  return { price: quote.c, variation: quote.dp ?? null };
}

// --- Fonctions internes ---

async function refreshQuotes(tickers: string[]): Promise<void> {
  for (const ticker of tickers) {
    try {
      const quote = await getStocks(ticker);
      if (quote?.c == null) continue;
      await upsertQuote(ticker, quote.c, quote.dp ?? null);
    } catch (e) {
      console.error(`[quote-cache] fetch ${ticker}:`, e);
    }
  }
}

async function upsertQuote(
  ticker: string,
  price: number,
  variation: number | null,
): Promise<void> {
  await prisma.cachedQuote.upsert({
    where: { ticker },
    update: { price, variation },
    create: { ticker, price, variation },
  });
}
