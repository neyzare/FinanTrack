"use client"

import { useEffect, useState } from "react"
import { getAllStocks } from "@/app/lib/stocks-db"

const STORAGE_KEY = "cached_stocks"

export function useStocks() {
    const [stocks, setStocks] = useState(() => {
        if (typeof window === "undefined") return []
        try {
            const cached = localStorage.getItem(STORAGE_KEY)
            return cached ? JSON.parse(cached) : []
        } catch {
            return []
        }
    })
    const [loading, setLoading] = useState(stocks.length === 0)

    useEffect(() => {
        getAllStocks()
            .then((data) => {
                const list = data ?? []
                setStocks(list)
                try {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
                } catch {}
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const invalidate = async () => {
        setLoading(true)
        try {
            const data = await getAllStocks()
            const list = data ?? []
            setStocks(list)
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
            } catch {}
        } finally {
            setLoading(false)
        }
    }

    return { stocks, loading, invalidate }
}
