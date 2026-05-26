import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
    return (
        <footer className="footer sm:footer-horizontal bg-card text-card-foreground border-t border-border p-10">
            <aside>
                <Logo showText={true} />
                <p className="text-muted-foreground mt-2">
                    Suivez et simulez vos investissements en temps réel.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    Données de marché fournies par{" "}
                    <a
                        href="https://finnhub.io"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover text-[#38BDF8]"
                    >
                        Finnhub.io
                    </a>
                </p>
            </aside>

            <nav>
                <h6 className="footer-title">Navigation</h6>
                <Link href="/dashboard" className="link link-hover">Tableau de bord</Link>
                <Link href="/dashboard/portefeuille" className="link link-hover">Portefeuille</Link>
                <Link href="/dashboard/sandbox" className="link link-hover">Simulation</Link>
                <Link href="/dashboard/calculatrice" className="link link-hover">Calculatrice</Link>
            </nav>

            <nav>
                <h6 className="footer-title">Compte</h6>
                <Link href="/login" className="link link-hover">Connexion</Link>
                <Link href="/forgot-password" className="link link-hover">Mot de passe oublié</Link>
                <Link href="/dashboard/parametres" className="link link-hover">Paramètres</Link>
            </nav>

            <nav>
                <h6 className="footer-title">Légal</h6>
                <Link href="/mentions-legales" className="link link-hover">Mentions légales</Link>
                <Link href="/confidentialite" className="link link-hover">Politique de confidentialité</Link>
                <Link href="/cgu" className="link link-hover">CGU</Link>
            </nav>
        </footer>
    );
}

export default Footer;
