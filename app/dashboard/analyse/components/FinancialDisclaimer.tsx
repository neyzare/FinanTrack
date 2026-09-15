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

// le storage peut être inaccessible (navigation privée, cookies bloqués) :
// cet état mémoire fait foi, sessionStorage ne sert qu'à survivre au rechargement
let acknowledged: boolean | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function readStorage() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

function isAcknowledged() {
  if (acknowledged === null) {
    acknowledged = readStorage();
  }
  return acknowledged;
}

function acknowledge() {
  acknowledged = true;
  try {
    sessionStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // pas mémorisé : l'avertissement réapparaîtra au prochain chargement
  }
  listeners.forEach((listener) => listener());
}

export function FinancialDisclaimer() {
  // le serveur ne connaît pas sessionStorage : on rend la modale fermée,
  // puis on relit le storage une fois hydraté
  const isAck = useSyncExternalStore(subscribe, isAcknowledged, () => true);

  // seul « J'ai compris » vaut acquittement : Échap, le clic extérieur et la
  // croix sont désactivés pour ne pas enregistrer un avertissement non lu
  return (
    <Dialog open={!isAck} disablePointerDismissal>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
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
