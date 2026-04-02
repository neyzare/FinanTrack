import SandboxStockExchange from "@/app/dashboard/sandbox/sandboxStockExchange";
import {getSandboxStock} from "@/app/lib/stockSimulationAction";

export default async function  sandboxPage() {
    const stockSandbox = await getSandboxStock()
    return (
        <>
            <SandboxStockExchange stockSandbox={stockSandbox}/>
        </>
    )
}