import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export const metadata = {
    title: "Mentions légales — Finantrack",
};

export default function MentionsLegalesPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] flex justify-center px-4 py-12">
            <Card className="w-full max-w-3xl border-2 shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl">Mentions légales</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        Dernière mise à jour : 26 mai 2026
                    </p>
                </CardHeader>

                <CardContent className="space-y-6 text-sm leading-relaxed">
                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Éditeur du site</h2>
                        <p>
                            Le site Finantrack est édité par <strong>Lucas Narguet</strong>,
                            étudiant, dans le cadre d&apos;un projet de diplôme.
                        </p>
                        <p>Contact : lucas.narguet451@gmail.com</p>
                        <p>Directeur de la publication : Lucas Narguet</p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Hébergement</h2>
                        <p>
                            Le site est hébergé par <strong>IONOS SARL</strong>,
                            7 place de la Gare, 57200 Sarreguemines, France.
                        </p>
                        <p>
                            Site web :{" "}
                            <a
                                href="https://www.ionos.fr"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#38BDF8] hover:underline"
                            >
                                www.ionos.fr
                            </a>
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Propriété intellectuelle</h2>
                        <p>
                            L&apos;ensemble du contenu présent sur Finantrack (code, design,
                            textes, logos) est la propriété de Lucas Narguet, sauf mention
                            contraire. Toute reproduction, totale ou partielle, est interdite
                            sans autorisation préalable.
                        </p>
                        <p>
                            Les données de marché sont fournies par Finnhub.io et restent la
                            propriété de leur fournisseur respectif.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Limitation de responsabilité</h2>
                        <p>
                            Finantrack est un outil pédagogique de suivi et de simulation
                            d&apos;investissement. Les informations affichées ne constituent
                            pas un conseil en investissement. L&apos;éditeur ne saurait être
                            tenu responsable des décisions prises par les utilisateurs sur la
                            base des informations présentes sur le site.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h2 className="text-lg font-semibold">Droit applicable</h2>
                        <p>
                            Les présentes mentions légales sont soumises au droit français.
                            Tout litige relatif à leur interprétation ou à leur exécution
                            relève des tribunaux français compétents.
                        </p>
                    </section>
                </CardContent>
            </Card>
        </div>
    );
}
