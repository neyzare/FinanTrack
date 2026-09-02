"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "financial-disclaimer-ack";

export function FinancialDisclaimer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // sessionStorage = réaffiché à chaque nouvelle session
    if (!sessionStorage.getItem(STORAGE_KEY)) setOpen(true);
  }, []);

  function accept() {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && accept()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avertissement</DialogTitle>
          <DialogDescription className="space-y-3 pt-2 text-left">
            <span className="block">
              Les analyses présentées sur cette page sont fournies à titre
              purement informatif et pédagogique. Elles ne constituent en aucun
              cas un conseil en investissement, une recommandation personnalisée
              ni une sollicitation d'achat ou de vente.
            </span>
            <span className="block">
              Les performances passées ne préjugent pas des performances
              futures. Tout investissement comporte un risque de perte en
              capital.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={accept} className="w-full">
            J'ai compris
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
