import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import type { Stock } from "@/app/types/stock";
import type { OrderType } from "@/app/types/Sandbox";

interface OrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: OrderType;
  stock: Stock | null;
  quantite: number;
  quantiteMax: number;
  onQuantiteChange: (q: number) => void;
  onConfirm: () => void;
}

export function OrderDialog({
  open,
  onOpenChange,
  type,
  stock,
  quantite,
  quantiteMax,
  onQuantiteChange,
  onConfirm,
}: OrderDialogProps) {
  const prixTotal = stock ? +(stock.price * quantite).toFixed(2) : 0;
  const ordreValide = quantite >= 1 && quantite <= quantiteMax;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className={type === "achat" ? "text-green-500" : "text-red-500"}
            >
              {type === "achat" ? "Acheter" : "Vendre"}
            </span>
            {stock?.name}
          </DialogTitle>
          <DialogDescription>
            {stock?.name} -{" "}
            {stock?.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}{" "}
            € par action
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="quantite">Quantité</Label>
            <Input
              id="quantite"
              type="number"
              min={1}
              max={quantiteMax}
              value={quantite}
              onChange={(e) =>
                onQuantiteChange(Math.max(1, parseInt(e.target.value) || 1))
              }
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Max : {quantiteMax} action{quantiteMax > 1 ? "s" : ""}
              </p>
              <div className="flex gap-1">
                {[1, 5, 10, 25].map((q) => (
                  <button
                    key={q}
                    onClick={() => onQuantiteChange(Math.min(q, quantiteMax))}
                    className="px-2 py-0.5 text-xs rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
                <button
                  onClick={() => onQuantiteChange(quantiteMax)}
                  className="px-2 py-0.5 text-xs rounded-md bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                >
                  Max
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prix unitaire</span>
              <span>
                {stock?.price.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Quantité</span>
              <span>x {quantite}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span
                className={type === "achat" ? "text-green-500" : "text-red-500"}
              >
                {prixTotal.toLocaleString("fr-FR", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            disabled={!ordreValide}
            onClick={onConfirm}
            className={
              type === "achat"
                ? "bg-green-500 hover:bg-green-500/90 text-white"
                : "bg-red-500 hover:bg-red-500/90 text-white"
            }
          >
            Confirmer {type === "achat" ? "l'achat" : "la vente"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
