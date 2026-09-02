import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { PieChart } from "lucide-react";
import type { SectorSlice } from "../types";

interface SectorAllocationProps {
  sectors: SectorSlice[];
}

export function SectorAllocation({ sectors }: SectorAllocationProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Allocation par secteur
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {sectors.map((sector) => (
          <div key={sector.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: sector.color }}
                />
                <span>{sector.name}</span>
              </div>
              <span className="text-muted-foreground">{sector.value}%</span>
            </div>
            <Progress value={sector.value} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
