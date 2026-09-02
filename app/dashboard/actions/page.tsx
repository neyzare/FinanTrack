import { getStocksWithCachedQuotes } from "@/app/lib/stocks-db";
import ActionsClient from "./ActionsClient";

export default async function ActionsPage() {
  const initialStocks = await getStocksWithCachedQuotes();

  return <ActionsClient initialStocks={initialStocks} />;
}
