"use client"
import {useState} from "react";
import {getStocks} from "@/app/lib/Finnhub";

interface Stock {
    id: number,
    name: string,
    ticker:string,
    price?: number,
    variation?: number,
    quantity: number,
    value: number

}

export default function ActionsPage() {
    const [stocks, setStocks] = useState<Stock[]>([])
    const [shearchValue, setShearchValue] = useState<string>("")
    const [errors, setErrors] = useState<string>("")

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

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-3 px-4 text-gray-400 font-semibold">Action</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Ticker</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Prix</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Variation</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Quantité</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Valeur</th>


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
                            ) :

                                (
                            stocks.map((stock) => (
                                <tr key={stock.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                    <th className="py-3 px-4 text-gray-300">{stock.name}</th>
                                    <th className="py-3 px-4 text-gray-300">{stock.ticker}</th>
                                    <th className="py-3 px-4 text-gray-300">{stock.price}</th>
                                    <th className="py-3 px-4 text-gray-300">{stock.variation}</th>
                                    <th className="py-3 px-4 text-gray-300">{stock.quantity}</th>
                                    <th className="py-3 px-4 text-gray-300">{stock.value}</th>
                                </tr>
                            )))
                        }

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}