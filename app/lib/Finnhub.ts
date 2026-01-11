"use server"
import { Configuration, DefaultApi } from "finnhub-ts";

const API_KEY = process.env.FINNHUB_API_KEY!;
console.log(API_KEY)

interface StockQuote {
    c?: number,
    d?: number,
    dp?: number,
    h?: number,
    l?: number,
    o?: number,
    pc?: number,
    t?: number
}

const config = new Configuration({
    apiKey: API_KEY,
});

const finnhubClient = new DefaultApi(config);


export async function getStocks(symbols : string): Promise<StockQuote | null> {
    try {
        const { data } = await finnhubClient.quote(symbols)

        if (!data || data.c === undefined || data.c === 0) {
            return null
        }

        return data
    } catch (error) {
        console.error(error);
        return null;
    }
}
