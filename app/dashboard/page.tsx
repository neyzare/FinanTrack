import {
  getDashboardData,
  saveSnapshot,
  getHistory,
} from "@/app/lib/performance";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const [data, chartData] = await Promise.all([
    getDashboardData(),
    getHistory(30),
  ]);

  saveSnapshot();

  return <DashboardClient data={data} initialChart={chartData} />;
}
