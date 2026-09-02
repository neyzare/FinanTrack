"use server";
import { Configuration, DefaultApi } from "finnhub-ts";

const API_KEY = process.env.FINNHUB_API_KEY!;

export interface StockQuote {
  c?: number;
  d?: number;
  dp?: number;
  h?: number;
  l?: number;
  o?: number;
  pc?: number;
  t?: number;
}

const config = new Configuration({
  apiKey: API_KEY,
});

const finnhubClient = new DefaultApi(config);

const MAX_CONCURRENT = 2;
let inFlight = 0;
const queue: Array<() => void> = [];

async function acquire(): Promise<void> {
  if (inFlight < MAX_CONCURRENT) {
    inFlight++;
    return;
  }
  await new Promise<void>((r) => queue.push(r));
  return acquire();
}

function release(): void {
  inFlight--;
  const next = queue.shift();
  if (next) next();
}

export async function getStocks(symbols: string): Promise<StockQuote | null> {
  await acquire();
  try {
    const { data } = await finnhubClient.quote(symbols);
    if (!data || data.c === undefined || data.c === 0) return null;
    return data;
  } catch (error) {
    console.error("[Finnhub]", error);
    return null;
  } finally {
    release();
  }
}

export async function getCompanyProfile(
  ticker: string,
): Promise<{ industry: string | null }> {
  await acquire();
  try {
    const { data } = await finnhubClient.companyProfile2(ticker);
    const industry = data?.finnhubIndustry ?? null;
    return { industry };
  } catch (error) {
    console.error("[Finnhub] companyProfile2", error);
    return { industry: null };
  } finally {
    release();
  }
}
