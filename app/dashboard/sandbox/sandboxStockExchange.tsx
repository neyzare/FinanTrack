"use client";

import { useMemo, useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/app/components/ui/tabs";
import type { Stock, BougieChart, Timeframe } from "@/app/types/stock";
import type {
  Stocksandbox,
  OrderType,
  SandboxState,
} from "@/app/types/Sandbox";
import { bougiePourChart } from "@/app/lib/stockSimulation";

import { computeMaxQuantity } from "./utils/format";
import { useStockSimulation } from "./hooks/useStockSimulation";
import { useTrading } from "./hooks/useTrading";
import { StatsCards } from "./components/StatsCards";
import { PriceChart } from "./components/PriceChart";
import { MarketTable } from "./components/MarketTable";
import { WalletTable } from "./components/WalletTable";
import { HistoryTable } from "./components/HistoryTable";
import { OrderDialog } from "./components/OrderDialog";

interface Props {
  stockSandbox: Stocksandbox[];
  initialState: SandboxState;
}

export default function SandboxStockExchange({
  stockSandbox,
  initialState,
}: Props) {
  const { stocks, bougies, reinitialiserSimulation } =
    useStockSimulation(stockSandbox);
  const {
    liquidite,
    positions,
    historique,
    passerOrdre,
    reinitialiserTrading,
  } = useTrading(initialState);

  const [nameSelectionne, setTickerSelectionne] = useState<string>(
    stockSandbox[0]?.name ?? "",
  );
  const [timeframe, setTimeframe] = useState<Timeframe>("1m");

  const [modalOuvert, setModalOuvert] = useState(false);
  const [modalType, setModalType] = useState<OrderType>("achat");
  const [modalStock, setModalStock] = useState<Stock | null>(null);
  const [quantite, setQuantite] = useState(1);

  const ouvrirModal = (stock: Stock, type: OrderType) => {
    setModalStock(stock);
    setModalType(type);
    setQuantite(1);
    setModalOuvert(true);
  };

  const valeurActions = useMemo(() => {
    return Object.values(positions).reduce((sum, pos) => {
      const stock = stocks.find((s) => s.name === pos.stockName);
      return sum + (stock ? stock.price * pos.quantity : 0);
    }, 0);
  }, [positions, stocks]);

  const valeurTotale = +(liquidite + valeurActions).toFixed(2);
  const positionsList = Object.values(positions);
  const stockSelectionne =
    stocks.find((s) => s.name === nameSelectionne) ?? stocks[0];

  const bougiesActuelles: BougieChart[] = useMemo(
    () => (bougies[nameSelectionne]?.[timeframe] ?? []).map(bougiePourChart),
    [bougies, nameSelectionne, timeframe],
  );

  const quantiteMax = computeMaxQuantity(
    modalType,
    modalStock,
    liquidite,
    positions,
  );

  const confirmerOrdre = () => {
    if (!modalStock) return;
    passerOrdre(modalType, modalStock, quantite);
    setModalOuvert(false);
  };

  const reinitialiser = () => {
    reinitialiserSimulation();
    reinitialiserTrading();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">SandBox Boursier</h1>
        <div className="flex flex-col gap-3 mt-2 sm:flex-row sm:justify-between sm:items-center">
          <span className="text-muted-foreground">
            Entraînez-vous au trading avec un capital virtuel de 10 000€
          </span>
          <Button
            variant="outline"
            onClick={reinitialiser}
            className="self-start sm:self-auto"
          >
            Réinitialiser
          </Button>
        </div>
      </div>

      <StatsCards
        valeurTotale={valeurTotale}
        liquidite={liquidite}
        valeurActions={valeurActions}
        nbTransactions={historique.length}
      />

      <PriceChart
        stockSelectionne={stockSelectionne}
        bougies={bougiesActuelles}
        timeframe={timeframe}
        onTimeframeChange={setTimeframe}
      />

      <Tabs defaultValue="market">
        <TabsList className="w-full">
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="wallet">
            Wallet
            {positionsList.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                {positionsList.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">
            History
            {historique.length > 0 && (
              <Badge variant="secondary" className="ml-1.5 text-xs px-1.5 py-0">
                {historique.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="market">
          <MarketTable
            stocks={stocks}
            positions={positions}
            liquidite={liquidite}
            nameSelectionne={nameSelectionne}
            onSelectStock={setTickerSelectionne}
            onOrder={ouvrirModal}
          />
        </TabsContent>

        <TabsContent value="wallet">
          <WalletTable
            positionsList={positionsList}
            stocks={stocks}
            valeurActions={valeurActions}
            onSelectStock={setTickerSelectionne}
            onSell={(stock) => ouvrirModal(stock, "vente")}
          />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTable historique={historique} />
        </TabsContent>
      </Tabs>

      <OrderDialog
        open={modalOuvert}
        onOpenChange={setModalOuvert}
        type={modalType}
        stock={modalStock}
        quantite={quantite}
        quantiteMax={quantiteMax}
        onQuantiteChange={setQuantite}
        onConfirm={confirmerOrdre}
      />
    </div>
  );
}
