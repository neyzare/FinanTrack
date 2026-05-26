import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const metadata = {
    title: "Conditions Générales d'Utilisation — Finantrack",
};

export default function CguPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex justify-center px-4 py-12">
            <Card className="w-full max-w-3xl border-2 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl">Conditions Générales d&apos;Utilisation</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Dernière mise à jour : 26 mai 2026
                    </p>
                </CardHeader>

                <CardContent className="space-y-6 text-sm leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">1. Objet</h2>
                        <p>
                            Les présentes Conditions Générales d&apos;Utilisation (ci-après
                            « CGU ») régissent l&apos;utilisation du site Finantrack,
                            plateforme pédagogique de suivi et de simulation d&apos;investissement
                            boursier. L&apos;utilisation du service implique l&apos;acceptation
                            sans réserve des présentes CGU.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">2. Création de compte</h2>
                        <p>
                            L&apos;accès aux fonctionnalités du site nécessite la création
                            d&apos;un compte. L&apos;utilisateur s&apos;engage à fournir des
                            informations exactes et à garder ses identifiants confidentiels.
                            Toute activité réalisée depuis le compte est réputée effectuée par
                            son titulaire.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">3. Disclaimer financier</h2>
                        <p className="font-medium">
                            Finantrack est un outil éducatif. Les simulations, données et
                            indicateurs présentés <strong>ne constituent en aucun cas un
                            conseil en investissement</strong> au sens de la réglementation
                            applicable.
                        </p>
                        <p>
                            L&apos;utilisateur reconnaît qu&apos;il prend ses décisions
                            d&apos;investissement éventuelles sous sa seule responsabilité.
                            L&apos;éditeur ne pourra être tenu responsable d&apos;aucune perte
                            financière, directe ou indirecte, liée à l&apos;utilisation du
                            service.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">4. Obligations de l&apos;utilisateur</h2>
                        <p>L&apos;utilisateur s&apos;engage à :</p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>Ne pas tenter de contourner les mesures de sécurité du site</li>
                            <li>Ne pas utiliser le service à des fins illégales</li>
                            <li>Ne pas extraire massivement les données accessibles via le site</li>
                            <li>Respecter les droits de propriété intellectuelle de l&apos;éditeur et des tiers</li>
                        </ul>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">5. Disponibilité du service</h2>
                        <p>
                            L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du
                            service mais ne peut garantir un fonctionnement ininterrompu.
                            Des opérations de maintenance peuvent rendre le service
                            temporairement indisponible sans préavis.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">6. Suspension et résiliation</h2>
                        <p>
                            L&apos;utilisateur peut supprimer son compte à tout moment depuis
                            les paramètres. L&apos;éditeur se réserve le droit de suspendre
                            ou supprimer un compte en cas de non-respect des présentes CGU.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">7. Propriété intellectuelle</h2>
                        <p>
                            L&apos;ensemble des éléments du site (code, design, logos, textes)
                            est protégé par les lois en vigueur sur la propriété intellectuelle.
                            Toute reproduction non autorisée est interdite.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">8. Modifications des CGU</h2>
                        <p>
                            L&apos;éditeur se réserve le droit de modifier les présentes CGU
                            à tout moment. Les utilisateurs seront informés des modifications
                            substantielles par email. L&apos;utilisation continue du service
                            après modification vaut acceptation des nouvelles CGU.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">9. Droit applicable</h2>
                        <p>
                            Les présentes CGU sont soumises au droit français. Tout litige
                            relatif à leur interprétation ou à leur exécution relève des
                            tribunaux français compétents.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
