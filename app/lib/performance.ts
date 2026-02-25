"use server"

import { getQuotesForDisplay } from "@/app/lib/quote-cache"
import { getAllStocks } from "@/app/lib/stocks-db"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export interface DashboardData {
    totalValue: number
    totalGainLoss: number
    totalGainLossPercent: number
    dailyChangePercent: number
    hasStocks: boolean
}

export interface ChartPoint {
    date: string
    valeur: number
}

export async function getDashboardData(): Promise<DashboardData> {
    const stocks = await getAllStocks()

    if (!stocks || stocks.length === 0) {
        return { totalValue: 0, totalGainLoss: 0, totalGainLossPercent: 0, dailyChangePercent: 0, hasStocks: false }
    }

    const quoteMap = await getQuotesForDisplay(stocks.map((s) => s.ticker))

    let totalValue = 0
    let totalInvested = 0
    let dailyChange = 0

    for (const stock of stocks) {
        const q = quoteMap.get(stock.ticker.toUpperCase())
        if (!q?.price) continue

        const value = q.price * stock.quantity
        totalValue += value
        totalInvested += (stock.buyPrice ?? 0) * stock.quantity
        dailyChange += value * ((q.variation ?? 0) / 100)
    }

    const totalGainLoss = totalValue - totalInvested
    const yesterdayValue = totalValue - dailyChange

    return {
        totalValue: Math.round(totalValue * 100) / 100,
        totalGainLoss: Math.round(totalGainLoss * 100) / 100,
        totalGainLossPercent: totalInvested > 0 ? Math.round((totalGainLoss / totalInvested) * 10000) / 100 : 0,
        dailyChangePercent: yesterdayValue > 0 ? Math.round((dailyChange / yesterdayValue) * 10000) / 100 : 0,
        hasStocks: true,
    }
}

export async function saveSnapshot(): Promise<void> {
    const user = await auth()
    if (!user) return

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today.getTime() + 86400000)

    const stocks = await getAllStocks()
    if (!stocks || stocks.length === 0) return

    const quoteMap = await getQuotesForDisplay(stocks.map((s) => s.ticker))

    for (const stock of stocks) {
        const q = quoteMap.get(stock.ticker.toUpperCase())
        try {
            const alreadySaved = await prisma.stockSnapshot.findFirst({
                where: { stockId: stock.id, snapshotDate: { gte: today, lt: tomorrow } },
            })
            if (alreadySaved) continue
            if (!q?.price) continue

            await prisma.stockSnapshot.create({
                data: {
                    stockId: stock.id,
                    ticker: stock.ticker,
                    userId: user.id,
                    price: q.price,
                    quantity: stock.quantity,
                    totalValue: q.price * stock.quantity,
                    snapshotDate: today,
                },
            })
        } catch {
        }
    }
}

export async function getHistory(days: number): Promise<ChartPoint[]> {
    const user = await auth()
    if (!user) return []

    const from = new Date()
    from.setDate(from.getDate() - days)
    from.setHours(0, 0, 0, 0)

    const grouped = await prisma.stockSnapshot.groupBy({
        by: ["snapshotDate"],
        where: { userId: user.id, snapshotDate: { gte: from } },
        _sum: { totalValue: true },
    })

    return grouped
        .sort((a, b) => a.snapshotDate.getTime() - b.snapshotDate.getTime())
        .map((row) => ({
            date: row.snapshotDate.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }),
            valeur: Math.round((row._sum.totalValue ?? 0) * 100) / 100,
        }))
}
