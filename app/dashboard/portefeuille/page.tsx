import Portefeuille from "@/app/dashboard/portefeuille/porteFeuille";
import { getStocksWithIndustry } from "@/app/lib/stocks-db";

export default async function PorteFeuillePage() {
    const stocks = await getStocksWithIndustry();

    return <Portefeuille stocks={stocks} />;
}