import { LayoutDashboard, TrendingUp, Calculator, Wallet, Settings } from 'lucide-react';
import { Button } from './ui/button';

interface SidebarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'actions', label: 'Mes Actions', icon: TrendingUp },
    { id: 'calculator', label: 'Calculatrice', icon: Calculator },
    { id: 'portfolio', label: 'Portefeuille', icon: Wallet },
    { id: 'settings', label: 'Paramètres', icon: Settings },
];

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
    return (
        <aside className="w-64 border-r bg-card min-h-screen sticky top-16 hidden lg:block">
            <nav className="p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.id;

                    return (
                        <Button
                            key={item.id}
                            variant={isActive ? 'default' : 'ghost'}
                            className={`w-full justify-start gap-3 ${
                                isActive ? 'bg-[#38BDF8] hover:bg-[#38BDF8]/90 text-white' : ''
                            }`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <Icon className="w-5 h-5" />
                            {item.label}
                        </Button>
                    );
                })}
            </nav>
        </aside>
    );
}
