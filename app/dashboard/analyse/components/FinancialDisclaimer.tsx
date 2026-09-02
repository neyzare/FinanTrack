"use client";

import { useSyncExternalStore } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// sessionStorage = réaffiché à chaque nouvelle session
const STORAGE_KEY = "financial-disclaimer-ack";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function isAcknowledged() {
  return sessionStorage.getItem(STORAGE_KEY) !== null;
}

function acknowledge() {
  sessionStorage.setItem(STORAGE_KEY, "1");
  listeners.forEach((listener) => listener());
}

export function FinancialDisclaimer() {
  // le serveur ne connaît pas sessionStorage : on rend la modale fermée,
  // puis on relit le storage une fois hydraté
  const acknowledged = useSyncExternalStore(
    subscribe,
    isAcknowledged,
    () => true,
  );

  return (
    <Dialog open={!acknowledged} onOpenChange={(v) => !v && acknowledge()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avertissement</DialogTitle>
          <DialogDescription className="space-y-3 pt-2 text-left">
            <span className="block">
              Les analyses présentées sur cette page sont fournies à titre
              purement informatif et pédagogique. Elles ne constituent en aucun
              cas un conseil en investissement, une recommandation personnalisée
              ni une sollicitation d&apos;achat ou de vente.
            </span>
            <span className="block">
              Les performances passées ne préjugent pas des performances
              futures. Tout investissement comporte un risque de perte en
              capital.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={acknowledge} className="w-full">
            J&apos;ai compris
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
