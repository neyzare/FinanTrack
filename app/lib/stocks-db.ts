"use server"

import { prisma} from "@/app/lib/prisma";
import {auth} from "@/app/lib/auth";

export async function gettAllStocks() {
    try {
        const user = await auth();

        if (!user) {
            throw new Error("Utilisateur non authentifié");
        }

        const stocks = await prisma.stock.findMany({
            where: {
                userId: user.id,
            },
            orderBy: { createdAt: 'desc' }
        })
        return stocks
    } catch (e) {
        console.log("erreur", e)
    }

}

export async function addStock(
    ticker: string,
    name: string,
    quantity: number = 0,
    buyPrice?: number) {
    try {
        const user = await auth();
        if (!user) {
            throw new Error("Utilisateur non authentifié");
        }
        const stock = await prisma.stock.create({
            data: {
                ticker: ticker.toUpperCase(),
                name,
                quantity,
                buyPrice,
                userId: user.id,
            }
        })
        return {success: true, stock}
    } catch (error: any) {

    if (error.code === 'P2002') {
        return {
            success: false,
            error: 'Cette action existe déjà dans votre portefeuille'
        };
    }

    console.error('Erreur addStock:', error);
    return {
        success: false,
        error: error.message || 'Impossible d\'ajouter l\'action'
    };
}
}

export async function updateStock(ticker: string, quantity: number) {
    try {
        const user = await auth();

        if (!user) {
            throw new Error("Utilisateur non authentifié");
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
        return { success: false, error: 'Impossible de mettre à jour' };

    }
}

export async function deleteStock(ticker: string) {
    try {
        const user = await auth()

        if (!user) {
            throw new Error("Utilisateur non authentifié");
        }

        await prisma.stock.delete({
            where: {
                userId_ticker: {
                    userId: user.id,
                    ticker: ticker
                }
            }
        });
    } catch (error) {
        console.error('erreur deleteStock : ', error)
        return {sucess: false, error}
    }

}

export async function deleteAllUserStocks() {
    try {
        const user = await auth()

        if (!user) {
            throw new Error('Utilisateur non authentifié')
        }

        await prisma.stock.findMany({
            where: {
                userId : user.id
            }
        })

        return {sucess: true}
    } catch (error) {
        console.error('erreur deleteAllUserStocks : ', error)
        return {sucess: false, error}
    }
}
