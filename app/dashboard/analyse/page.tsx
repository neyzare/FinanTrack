import AnalyseClient from "./AnalyseClient";
import { FinancialDisclaimer } from "@/app/dashboard/analyse/components/FinancialDisclaimer";

export default function AnalysePage() {
  return (
    <>
      <FinancialDisclaimer />
      <AnalyseClient />
    </>
  );
}
