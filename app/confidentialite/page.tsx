import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const metadata = {
    title: "Politique de confidentialité — Finantrack",
};

export default function ConfidentialitePage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex justify-center px-4 py-12">
            <Card className="w-full max-w-3xl border-2 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl">Politique de confidentialité</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Dernière mise à jour : 26 mai 2026
                    </p>
                </CardHeader>

                <CardContent className="space-y-6 text-sm leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Responsable du traitement</h2>
                        <p>
                            Le responsable du traitement des données personnelles collectées
                            sur Finantrack est <strong>Lucas Narguet</strong>, joignable à
                            l&apos;adresse lucas.narguet451@gmail.com.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Données collectées</h2>
                        <p>
                            Lors de la création d&apos;un compte, Finantrack collecte les
                            données suivantes :
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Nom complet</li>
                            <li>Adresse email</li>
                            <li>Mot de passe (stocké sous forme de hash bcrypt)</li>
                        </ul>
                        <p>
                            Lors de l&apos;utilisation du service, sont également enregistrées
                            les données suivantes :
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Positions et historique de votre portefeuille de simulation</li>
                            <li>Préférences d&apos;affichage (thème)</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Finalités</h2>
                        <p>Ces données sont utilisées exclusivement pour :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Permettre la création et l&apos;accès à votre compte</li>
                            <li>Vous permettre d&apos;utiliser les fonctionnalités du site</li>
                            <li>Vous envoyer un email de réinitialisation de mot de passe à votre demande</li>
                        </ul>
                        <p>
                            Aucune donnée n&apos;est revendue ni transmise à des tiers à des
                            fins commerciales.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Cookies</h2>
                        <p>
                            Finantrack utilise un cookie de session strictement nécessaire au
                            fonctionnement du service (maintien de votre connexion). Ce cookie
                            ne nécessite pas de consentement préalable.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Durée de conservation</h2>
                        <p>
                            Vos données personnelles sont conservées tant que votre compte est
                            actif. Elles sont supprimées dans un délai raisonnable après la
                            suppression de votre compte.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Sous-traitants</h2>
                        <p>Finantrack fait appel aux prestataires suivants :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li><strong>IONOS</strong> (hébergement)</li>
                            <li><strong>Resend</strong> (envoi d&apos;emails transactionnels)</li>
                            <li><strong>Finnhub.io</strong> (données de marché — aucune donnée personnelle transmise)</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Vos droits (RGPD)</h2>
                        <p>
                            Conformément au Règlement Général sur la Protection des Données,
                            vous disposez à tout moment des droits suivants :
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Droit d&apos;accès à vos données</li>
                            <li>Droit de rectification</li>
                            <li>Droit à l&apos;effacement (suppression de compte)</li>
                            <li>Droit à la portabilité</li>
                            <li>Droit d&apos;opposition</li>
                        </ul>
                        <p>
                            Pour exercer ces droits, contactez-nous à
                            lucas.narguet451@gmail.com. Vous disposez également du droit de
                            saisir la CNIL en cas de litige (www.cnil.fr).
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
