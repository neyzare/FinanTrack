export interface PortefeuilleStats {
  totalValue: number;
  totalInvested: number;
  totalGain: number;
  gainPercent: number;
}

export interface SectorSlice {
  name: string;
  value: number;
  color: string;
}
