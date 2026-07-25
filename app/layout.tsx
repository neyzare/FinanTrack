import { Inter, Bricolage_Grotesque, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { auth } from "@/app/lib/auth";
import {Theme, ThemeProvider} from "@/app/components/ThemeProvider";
import {cookies} from "next/headers";
import Script from "next/script";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const bricolage = Bricolage_Grotesque({ variable: "--font-bricolage", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
    title: "FinanTrack",
    description: "Suivez votre portefeuille, analysez vos dépenses et projetez vos rendements - comme un grand livre, en plus clair.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    const user = await auth();
    const cookieStore = await cookies()
    const theme: Theme = cookieStore.get('theme')?.value === 'light' ? "light" : "dark";
    return (
        <html lang="fr" className={theme === "dark" ? "dark" : ""} style={{colorScheme: theme}}>
        <body className={`${inter.variable} ${bricolage.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeProvider initialTheme={theme}>
            <Navbar initialAuth={!!user} />
            <main>{children}</main>
            <Footer />
        </ThemeProvider>

        <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-9WH10TP7G8"
            strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
            {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-9WH10TP7G8');
          `}
        </Script>
        </body>
        </html>
    );
}
