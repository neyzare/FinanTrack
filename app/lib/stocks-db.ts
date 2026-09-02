"use server";

import { Prisma } from "@prisma/client";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { getQuotesForDisplay } from "@/app/lib/quote-cache";
import { getCompanyProfile } from "@/app/lib/Finnhub";

export async function getAllStocks() {
  const user = await auth();
  if (!user) {
    return [];
  }

  return prisma.stock.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
}

export interface StockWithQuote {
  id: number;
  name: string;
  ticker: string;
  price?: number;
  variation?: number;
  quantity: number;
  value: number;
  buyPrice: number;
}

export interface StockWithQuoteAndIndustry extends StockWithQuote {
  industry: string | null;
}

export async function getStocksWithCachedQuotes(): Promise<StockWithQuote[]> {
  const stocks = await getAllStocks();
  if (stocks.length === 0) return [];

  const tickers = stocks.map((s) => s.ticker);
  const quoteMap = await getQuotesForDisplay(tickers);

  return stocks.map((s) => {
    const q = quoteMap.get(s.ticker.toUpperCase());
    const price = q?.price;
    const variation = q?.variation ?? undefined;
    return {
      id: s.id,
      name: s.name || s.ticker,
      ticker: s.ticker,
      price,
      variation,
      quantity: s.quantity,
      value: (price ?? s.buyPrice) * s.quantity,
      buyPrice: s.buyPrice,
    };
  });
}

export async function getStocksWithIndustry(): Promise<
  StockWithQuoteAndIndustry[]
> {
  const stocks = await getStocksWithCachedQuotes();
  if (stocks.length === 0) return [];

  const enriched = await Promise.all(
    stocks.map(async (s) => {
      const { industry } = await getCompanyProfile(s.ticker);
      return { ...s, industry };
    }),
  );
  return enriched;
}

export async function addStock(
  ticker: string,
  name: string,
  quantity: number = 0,
  buyPrice?: number,
  quoteToCache?: { price: number; variation?: number },
) {
  try {
    const user = await auth();
    if (!user) {
      return {
        success: false,
        message: "no user found",
      };
    }
    const stock = await prisma.stock.create({
      data: {
        ticker: ticker.toUpperCase(),
        name,
        quantity,
        buyPrice: buyPrice ?? 0,
        userId: user.id,
      },
    });
    if (quoteToCache) {
      await prisma.cachedQuote.upsert({
        where: { ticker: ticker.toUpperCase() },
        update: {
          price: quoteToCache.price,
          variation: quoteToCache.variation ?? null,
        },
        create: {
          ticker: ticker.toUpperCase(),
          price: quoteToCache.price,
          variation: quoteToCache.variation ?? null,
        },
      });
    }
    return { success: true, stock };
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        error: "Cette action existe déjà dans votre portefeuille",
      };
    }

    console.error("Erreur addStock:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Impossible d'ajouter l'action",
    };
  }
}

export async function updateStock(ticker: string, quantity: number) {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "no user found",
      };
    }

    const stock = await prisma.stock.update({
      where: {
        userId_ticker: {
          userId: user.id,
          ticker: ticker,
        },
      },
      data: {
        quantity: quantity,
      },
    });

    return stock;
  } catch (error) {
    console.error("Erreur updateStock :", error);
    return { success: false, error: "Impossible de mettre à jour" };
  }
}

export async function deleteStock(ticker: string) {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "no user found",
      };
    }

    await prisma.stock.delete({
      where: {
        userId_ticker: {
          userId: user.id,
          ticker: ticker,
        },
      },
    });
  } catch (error) {
    console.error("erreur deleteStock : ", error);
    return { success: false, error };
  }
}

export async function deleteAllUserStocks() {
  try {
    const user = await auth();

    if (!user) {
      return {
        success: false,
        message: "no user found",
      };
    }

    await prisma.stock.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("erreur deleteAllUserStocks : ", error);
    return { success: false, error };
  }
}
