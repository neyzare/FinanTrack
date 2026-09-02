"use client";

import { AppearanceCard } from "./components/AppearanceCard";
import { DangerZoneCard } from "./components/DangerZoneCard";

export function Settings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <AppearanceCard />
      <DangerZoneCard />
    </div>
  );
}
