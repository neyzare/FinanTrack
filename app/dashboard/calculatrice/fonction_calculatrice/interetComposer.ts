export function interetAvecApportMensuel(
    P: number,              // capital initial
    r: number,              // taux annuel (ex: 0.05 = 5%)
    n: number,              // nombre de compositions par an (12 = mensuel)
    t: number,              // durée en années
    apportMensuel: number   // apport mensuel (C)
): number {
    

    const N = n * t;
    const i = r / n;

    const A =
        P * Math.pow(1 + i, N) +
        apportMensuel * ((Math.pow(1 + i, N) - 1) / i);

    return parseFloat(A.toFixed(2));
}
