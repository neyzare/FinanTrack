"use client"
import { ImageWithFallback } from "@/app/components/ImageWithFallBack";
import {
    TrendingUp,
    BarChart3,
    Calculator,
    Check,
} from "lucide-react";
import {Card, CardContent} from "@/app/components/ui/card";
import {Button} from "@/app/components/ui/button";
import Link from "next/link";

export default function Home() {
    const features = [
        {
            icon: TrendingUp,
            title: "Suivi en temps réel des actions",
            description:
                "Suivez vos investissements boursiers en temps réel avec des données actualisées.",
        },
        {
            icon: BarChart3,
            title: "Analyse automatique de portefeuille",
            description:
                "Obtenez des insights détaillés sur la performance et la diversification de votre portefeuille.",
        },
        {
            icon: Calculator,
            title: "Calculs financiers intelligents",
            description:
                "Utilisez nos outils de calcul pour planifier vos investissements et simuler vos rendements.",
        },
    ];

    return (
        <>
            {/* Section Hero */}
            <section className="hero min-h-screen">
                <div className="hero-content flex-col lg:flex-row-reverse gap-10">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#38BDF8]/20 to-[#22C55E]/20 rounded-3xl blur-3xl"></div>
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1744473755637-e09f0c2fab41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjBjaGFydHMlMjBncm93dGh8ZW58MXx8fHwxNzYxNjM4MTg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                            alt="Financial Dashboard"
                            className="relative rounded-2xl shadow-2xl w-full h-auto"
                        />
                    </div>
                    <div className="flex flex-col items-start">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            Maîtrisez vos finances, suivez vos investissements
                        </h2>
                        <p className="text-lg text-gray-500 mb-6 max-w-lg">
                            Finantrack vous aide à gérer votre portefeuille d'actions, analyser vos dépenses et optimiser vos rendements grâce à des outils intelligents.
                        </p>
                        <Link href="/dashboard">
                            <button className="btn bg-[#39BDF8] rounded-xl" >Commencer maintenant</button>

                        </Link>
                    </div>
                </div>
            </section>

            {/* Section 2 : Fonctionnalités principales */}
            <section className=" flex flex-col items-center justify-center gap-12 py-20 bg-[#1E293B] ">
                <div className="text-center max-w-2xl ">
                    <h2 className="text-4xl font-bold mb-4">Fonctionnalités principales</h2>
                    <p className="text-lg text-gray-500">
                        Tout ce dont vous avez besoin pour gérer vos finances et vos
                        investissements.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 lg:px-20 bg-[#1E293B]">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card bg-[#1E283A] border hover:border-[#39BDF8] border-[#334156] shadow-xl rounded-2xl p-8 flex flex-col items-center text-center hover:shadow-2xl transition"
                        >
                            <feature.icon className="h-10 w-10 text-primary mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 3 : */}
            <section className="flex flex-col items-center justify-center gap-8 py-20">
                <div className="text-center">
                    <h2 className="text-4xl font-bold mb-2">Comment ça marche</h2>
                    <p className="text-lg text-gray-500">
                        Commencez à suivre vos investissements en 3 étapes simples
                    </p>
                </div>

                <ul className="steps steps-vertical lg:steps-horizontal">
                    <li className="step step-primary">
                        <div className="flex flex-col gap-1 items-center">
                            <span className="font-semibold">Créer un compte</span>
                            <p className="text-sm text-gray-500">
                                Inscrivez-vous gratuitement en quelques secondes
                            </p>
                        </div>
                    </li>
                    <li className="step step-primary">
                        <div className="flex flex-col gap-1 items-center">
              <span className="font-semibold">
                Suivez et testez vos performances
              </span>
                            <p className="text-sm text-gray-500">
                                Analysez et optimisez votre portefeuille
                            </p>
                        </div>
                    </li>
                </ul>
            </section>

            {/*SECTION 4*/}
            <section className=" flex flex-col items-center justify-center gap-12 py-20 bg-[#1E293B] ">
                <div className="text-center max-w-2xl ">
                    <h2 className="text-4xl font-bold mb-4">Un petit mot du Createur</h2>
                    <p className="text-3xl text-[#51A2FF]">
                        J'ai voulu creer FinanTrack pour faciliter les calcules Financiers
                    </p>
                </div>
            </section>

            {/* Section 5 : */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <Card className="bg-gradient-to-r from-[#38BDF8] to-[#22C55E] border-0 text-white">
                        <CardContent className="p-12 text-center space-y-6">
                            <h2 className="text-3xl lg:text-5xl text-white">
                                Prêt à transformer vos finances ?
                            </h2>
                            <p className="text-xl text-white/90 max-w-2xl mx-auto">
                                Rejoignez Finantrack aujourd'hui et prenez le contrôle de vos investissements
                            </p>
                            <div className="flex flex-wrap gap-4 justify-center">
                                <Button
                                    size="lg"
                                    className="bg-white text-[#38BDF8] hover:bg-white/90"
                                    onClick={() => Link('/dashboard')}
                                >
                                    Commencer gratuitement
                                    <Check className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    );
}
