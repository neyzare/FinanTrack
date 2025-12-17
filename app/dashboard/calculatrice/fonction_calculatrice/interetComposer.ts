export interface ResultatInteretCompose {
    montantFinal: number;
    capitalInitial: number;
    totalApports: number;
    interetsGagnes: number;
}

export function interetAvecApportMensuel(
    P: number,        // Capital initial investi au début
    r: number,        // Taux d'intérêt annuel (format décimal)
    n: number = 12,        // Fréquence de capitalisation par an
    t: number,        // Durée en années
    apportMensuel: number  // Versement mensuel régulier
): ResultatInteretCompose {
    const N = n * t;
    const i = r / n;
    const A = P * Math.pow(1 + i, N) + apportMensuel * ((Math.pow(1 + i, N) - 1) / i);
    const montantFinal = parseFloat(A.toFixed(2));
    const totalApports = apportMensuel * N;

    return {
        montantFinal: montantFinal,
        capitalInitial: P,
        totalApports: totalApports,
        interetsGagnes: parseFloat((montantFinal - P - totalApports).toFixed(2))
    };
}