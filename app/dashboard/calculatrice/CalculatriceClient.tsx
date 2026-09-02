"use client";

import { JSX } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import { InteretsComposesTab } from "./tabs/InteretsComposesTab";
import { RendementTab } from "./tabs/RendementTab";
import { DepensesTab } from "./tabs/DepensesTab";

export function Calculatrice(): JSX.Element {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl mb-2">Calculatrice Financière</h1>
        <p className="text-muted-foreground">
          Outils de calcul pour planifier vos investissements et budget
        </p>
      </div>

      <Tabs defaultValue="composes" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="composes">Intérêts composés</TabsTrigger>
          <TabsTrigger value="rendement">Rendement</TabsTrigger>
          <TabsTrigger value="depenses">Dépenses</TabsTrigger>
        </TabsList>

        <TabsContent value="composes" className="space-y-6">
          <InteretsComposesTab />
        </TabsContent>

        <TabsContent value="rendement" className="space-y-6">
          <RendementTab />
        </TabsContent>

        <TabsContent value="depenses" className="space-y-6">
          <DepensesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Calculatrice;
