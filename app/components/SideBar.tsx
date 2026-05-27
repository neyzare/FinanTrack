'use client';

import { LayoutDashboard, TrendingUp, Calculator, Wallet, Settings, ChartCandlestick, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'actions', label: 'Action', icon: TrendingUp, href: '/dashboard/actions' },
    { id: 'calculatrice', label: 'Calculatrice', icon: Calculator, href: '/dashboard/calculatrice' },
    { id: 'sandbox', label: 'Sandbox', icon: ChartCandlestick, href: '/dashboard/sandbox' },
    { id: 'portefeuille', label: 'Portefeuille', icon: Wallet, href: '/dashboard/portefeuille' },
    { id: 'parametres', label: 'Paramètres', icon: Settings, href: '/dashboard/parametres' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="fixed top-20 left-4 z-30 lg:hidden p-2 rounded-md bg-card border border-border shadow-md"
                aria-label="Ouvrir le menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`
                    w-64 border-r bg-card
                    fixed top-0 left-0 h-screen z-50 transition-transform
                    ${open ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:sticky lg:top-0 lg:min-h-screen lg:z-auto
                `}
            >
                <div className="lg:hidden flex justify-end p-2">
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-md hover:bg-accent"
                        aria-label="Fermer le menu"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link key={item.id} href={item.href}>
                                <Button
                                    variant={isActive ? 'default' : 'ghost'}
                                    className={`w-full justify-start gap-3 ${
                                        isActive ? 'bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-white' : ''
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
