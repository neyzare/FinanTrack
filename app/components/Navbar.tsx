import { Button } from './ui/button';
import { Logo } from './Logo';
import { Bell, User, Moon, Sun } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NavbarProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
    isAuthenticated?: boolean;
    onNavigate?: (page: string) => void;
    onLogout?: () => void;
}

export function Navbar({ isDarkMode, onToggleTheme, isAuthenticated, onNavigate, onLogout }: NavbarProps) {
    return (
        <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div
                    onClick={() => onNavigate?.(isAuthenticated ? 'dashboard' : 'landing')}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            onNavigate?.(isAuthenticated ? 'dashboard' : 'landing');
                        }
                    }}
                >
                    <Logo />
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleTheme}
                        className="rounded-full"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>

                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="icon" className="rounded-full relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-[#22C55E] rounded-full"></span>
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="rounded-full p-1 hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onNavigate?.('settings')}>
                                        <User className="w-4 h-4 mr-2" />
                                        Paramètres
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={onLogout} className="text-destructive">
                                        Se déconnecter
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <Button onClick={() => onNavigate?.('auth')} className="bg-[#38BDF8] hover:bg-[#38BDF8]/90">
                            Connexion
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
