import SandboxStockExchange from "@/app/dashboard/sandbox/sandboxStockExchange";
import { getSandboxStock } from "@/app/lib/stockSimulationAction";
import { getSandboxState } from "@/app/lib/sandboxAction";

export default async function sandboxPage() {
    const [stockSandbox, initialState] = await Promise.all([
        getSandboxStock(),
        getSandboxState(),
    ]);
    return (
        <SandboxStockExchange stockSandbox={stockSandbox} initialState={initialState} />
    );
}