'use client';

import { LayoutDashboard, TrendingUp, Calculator, Wallet, Settings } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'actions', label: 'Mes Actions', icon: TrendingUp, href: '/dashboard/actions' },
    { id: 'calculatrice', label: 'Calculatrice', icon: Calculator, href: '/dashboard/calculatrice' },
    { id: 'portefeuille', label: 'Portefeuille', icon: Wallet, href: '/dashboard/portefeuille' },
    { id: 'parametres', label: 'Paramètres', icon: Settings, href: '/dashboard/parametres' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-card min-h-screen sticky top-0 hidden lg:block">
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
    );
}
