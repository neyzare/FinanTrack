"use client"
import {useState} from "react";

export default function ActionsPage() {
    const [stocks, setStocks] = useState(undefined)

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
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="border-b border-gray-700">
                            <th className="py-3 px-4 text-gray-400 font-semibold">#</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Name</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Job</th>
                            <th className="py-3 px-4 text-gray-400 font-semibold">Favorite Color</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr className="border-b border-gray-700 hover:bg-gray-800/50">
                            <th className="py-3 px-4 text-gray-300">1</th>
                            <td className="py-3 px-4 text-white">Cy Ganderton</td>
                            <td className="py-3 px-4 text-white">Quality Control Specialist</td>
                            <td className="py-3 px-4 text-white">Blue</td>
                        </tr>
                        <tr className="border-b border-gray-700 hover:bg-gray-800/50">
                            <th className="py-3 px-4 text-gray-300">2</th>
                            <td className="py-3 px-4 text-white">Hart Hagerty</td>
                            <td className="py-3 px-4 text-white">Desktop Support Technician</td>
                            <td className="py-3 px-4 text-white">Purple</td>
                        </tr>
                        <tr className="hover:bg-gray-800/50">
                            <th className="py-3 px-4 text-gray-300">3</th>
                            <td className="py-3 px-4 text-white">Brice Swyre</td>
                            <td className="py-3 px-4 text-white">Tax Accountant</td>
                            <td className="py-3 px-4 text-white">Red</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}