"use client"
import {useState} from "react";
import {getStocks} from "@/app/lib/Finnhub";

interface Stock {
    id: number,
    name: string,
    ticker: string,
    price?: number,
    variation?: number,
    quantity: number,
    value: number
}

export default function ActionsPage() {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [shearchValue, setShearchValue] = useState<string>("")
    const [errors, setErrors] = useState<string>("")

    const updateQuantity = (stockId: number, newQuantity: number) => {
        setStocks(stocks.map(stock =>
            stock.id === stockId
                ? { ...stock, quantity: newQuantity, value: (stock.price || 0) * newQuantity }
                : stock
        ))
    }

    const handleInputChange = (e) => {
        setShearchValue(e.target.value)
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            shearchStocks()
        }
    }

    const shearchStocks = async () => {
        const symbols = shearchValue.trim().toUpperCase()

        if (!symbols) {
            setErrors("veuillez entre un symbole d'action valide.")
            return
        }

        if (stocks.find((s => s.ticker === symbols))) {
            setErrors("cette action est deja dans votre liste.")
            return
        }

        try {
            const data = await getStocks(symbols)

            const newStock: Stock = {
                id: Date.now(),
                name: symbols,
                ticker: symbols,
                price: data.c,
                variation: data.dp,
                quantity: 0,
                value: 0
            }

            setStocks([...stocks, newStock])
            setShearchValue("")
            setErrors("")
        } catch (error) {
            setErrors("impossible de recuperer les donnees pour ce symbole")
            console.error(error)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Mes Actions</h1>
                <p className="text-muted-foreground">Suivez vos actions et leur performance</p>
            </div>

            <div className="p-6 border rounded-lg bg-[#1E283A]">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-white font-semibold">Liste des actions</span>
                    <input
                        className="px-2 py-1 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 bg-transparent"
                        type="text"
                        placeholder="Rechercher une action..."
                        value={shearchValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyPress}
                    />
                </div>

                {errors && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded text-red-400">
                        {errors}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse table-fixed">
                        <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-3 px-4 text-gray-400 font-semibold w-[20%]">Action</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold w-[15%]">Ticker</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold w-[15%]">Prix</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold w-[15%]">Variation</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold w-[15%]">Quantité</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold w-[20%]">Valeur</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            stocks.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                        Aucune action ajoutée. Recherchez une action ci-dessus.
                                    </td>
                                </tr>
                            ) : (
                                stocks.map((stock) => (
                                    <tr key={stock.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                        <td className="py-3 px-4 text-gray-300">{stock.name}</td>
                                        <td className="py-3 px-4 text-gray-300">{stock.ticker}</td>
                                        <td className="py-3 px-4 text-gray-300">${stock.price?.toFixed(2)}</td>
                                        <td className={`py-3 px-4 ${stock.variation && stock.variation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {stock.variation?.toFixed(2)}%
                                        </td>
                                        <td className="py-3 px-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={stock.quantity}
                                                onChange={(e) => updateQuantity(stock.id, Number(e.target.value))}
                                                className="w-full px-2 py-1 bg-gray-700 text-gray-300 rounded border border-gray-600 focus:outline-none focus:border-blue-400"
                                            />
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">${stock.value.toFixed(2)}</td>
                                    </tr>
                                ))
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}