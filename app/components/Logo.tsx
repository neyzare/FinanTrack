interface LogoProps {
    showText?: boolean;
}

/**
 * Marque « Le Registre » : un F tracé au trait dont les deux bras se
 * prolongent en lignes de grand livre, ponctuées d'un tiret laiton -
 * la marque d'une écriture validée dans un compte.
 */
export function Logo({ showText = true }: LogoProps) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center shadow-sm">
                <svg
                    viewBox="0 0 40 40"
                    className="w-9 h-9"
                    fill="none"
                    aria-hidden="true"
                >
                    {/* Montant du F */}
                    <path
                        d="M14 11 V29"
                        className="stroke-primary-foreground"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                    />
                    {/* Bras haut - prolongé en ligne de registre */}
                    <path
                        d="M14 12.6 H28"
                        className="stroke-primary-foreground"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                    />
                    {/* Bras médian - plus court, comme une sous-ligne */}
                    <path
                        d="M14 20 H24"
                        className="stroke-primary-foreground"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                    />
                    {/* Tiret doré : l'écriture cochée. Teinte fixe pour rester
                        lisible sur le sceau vert dans les deux thèmes (logo,
                        exempté des contraintes de contraste WCAG). */}
                    <path
                        d="M20 28 H27"
                        stroke="#D0A24E"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                    />
                </svg>
            </div>
            {showText && (
                <span className="text-xl font-display font-semibold tracking-tight text-foreground">
                    Finan<span className="text-primary">track</span>
                </span>
            )}
        </div>
    );
}
