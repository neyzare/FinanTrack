import { describe, it, expect } from 'vitest'
import {interetAvecApportMensuel} from "@/app/dashboard/calculatrice/fonction_calculatrice/interetComposer";

describe('interetComposer', () => {
    it('devrait calculer les intérêts composés correctement', () => {
        const resultat = interetAvecApportMensuel(1000, 0.05, 12, 10, 100);
        expect(resultat).toEqual({
            capitalInitial: 1000,
            interetsGagnes: 4175.24,
            montantFinal: 17175.24,
            totalApports: 12000,
        })
    })
})