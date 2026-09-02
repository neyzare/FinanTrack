"use server";

import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import type {
  CandlesMap,
  OrderType,
  Position,
  SandboxState,
  SavedCandle,
  Transaction,
} from "@/app/types/Sandbox";

const INITIAL_CAPITAL = 10_000;

const emptyState: SandboxState = {
  liquidite: INITIAL_CAPITAL,
  positions: [],
  historique: [],
  candles: {},
};

export async function getSandboxState(): Promise<SandboxState> {
  const user = await auth();
  if (!user) return emptyState;

  const row = await prisma.sandboxState.findUnique({
    where: { userId: user.id },
  });

  if (!row) {
    await prisma.sandboxState.create({
      data: {
        userId: user.id,
        liquidite: INITIAL_CAPITAL,
        positions: [],
        historique: [],
        candles: {},
      },
    });
    return emptyState;
  }

  const historique = (row.historique as unknown as Transaction[]).map((t) => ({
    ...t,
    timestamp: new Date(t.timestamp),
  }));

  return {
    liquidite: row.liquidite,
    positions: row.positions as unknown as Position[],
    historique,
    candles: row.candles as unknown as CandlesMap,
  };
}

export async function placeOrder(
  type: OrderType,
  stockName: string,
  quantity: number,
  unitPrice: number,
) {
  try {
    const user = await auth();
    if (!user) return { success: false, message: "no user found" };
    if (quantity < 1) return { success: false, error: "Quantity invalide" };

    const stock = await prisma.sandboxStock.findFirst({
      where: { name: stockName },
    });
    if (!stock) return { success: false, error: "Action no found" };

    const total = +(unitPrice * quantity).toFixed(2);
    const state = await getSandboxState();

    let liquidite = state.liquidite;
    let positions = state.positions;
    const index = positions.findIndex((p) => p.stockName === stockName);

    if (type === "achat") {
      if (liquidite < total)
        return { success: false, error: "Liquidité insuffisante" };
      liquidite = +(liquidite - total).toFixed(2);

      if (index >= 0) {
        const pos = positions[index];
        const newQuantity = pos.quantity + quantity;
        const newAverage =
          (pos.avgBuyPrice * pos.quantity + unitPrice * quantity) / newQuantity;
        positions = positions.map((p, i) =>
          i === index
            ? {
                ...p,
                quantity: newQuantity,
                avgBuyPrice: +newAverage.toFixed(4),
              }
            : p,
        );
      } else {
        positions = [
          ...positions,
          { stockName, quantity, avgBuyPrice: unitPrice },
        ];
      }
    } else {
      const held = index >= 0 ? positions[index].quantity : 0;
      if (quantity > held)
        return { success: false, error: "Quantité détenue insuffisante" };

      liquidite = +(liquidite + total).toFixed(2);
      const remaining = held - quantity;
      positions =
        remaining <= 0
          ? positions.filter((_, i) => i !== index)
          : positions.map((p, i) =>
              i === index ? { ...p, quantity: remaining } : p,
            );
    }

    const transaction: Transaction = {
      type,
      stockName,
      quantity,
      unitPrice,
      total,
      timestamp: new Date(),
    };
    const historique = [transaction, ...state.historique];

    await prisma.sandboxState.update({
      where: { userId: user.id },
      data: {
        liquidite,
        positions: positions as unknown as object,
        historique: historique as unknown as object,
      },
    });

    return { success: true, liquidite, positions, transaction };
  } catch (error) {
    console.error("Erreur placeOrder :", error);
    return { success: false, error: "Impossible de passer l'ordre" };
  }
}

export async function saveCandles(candles: SavedCandle[]) {
  try {
    const user = await auth();
    if (!user) return { success: false, message: "no user found" };
    if (candles.length === 0) return { success: true, count: 0 };

    const state = await getSandboxState();
    const map: CandlesMap = { ...state.candles };

    for (const c of candles) {
      const byTimeframe = map[c.stockName] ?? {};
      byTimeframe[c.timeframe] = {
        time: c.time,
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      };
      map[c.stockName] = byTimeframe;
    }

    await prisma.sandboxState.update({
      where: { userId: user.id },
      data: { candles: map as unknown as object },
    });

    return { success: true, count: candles.length };
  } catch (error) {
    console.error("Erreur saveCandles :", error);
    return { success: false, error: "Impossible d'enregistrer les bougies" };
  }
}

export async function resetSandbox() {
  try {
    const user = await auth();
    if (!user) return { success: false, message: "no user found" };

    await prisma.sandboxState.upsert({
      where: { userId: user.id },
      update: {
        liquidite: INITIAL_CAPITAL,
        positions: [],
        historique: [],
        candles: {},
      },
      create: {
        userId: user.id,
        liquidite: INITIAL_CAPITAL,
        positions: [],
        historique: [],
        candles: {},
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Erreur resetSandbox :", error);
    return { success: false, error: "Impossible de réinitialiser" };
  }
}
