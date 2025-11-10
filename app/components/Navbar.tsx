"use client"; // ✅ Obligatoire pour utiliser les hooks et l'interactivité

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { Bell, User, Moon, Sun } from "lucide-react";
import { useRouter} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface NavbarProps {
    isAuthenticated?: boolean;
    onNavigate?: (page: string) => void;
    onLogout?: () => void;
}

export function Navbar({ isAuthenticated, onNavigate, onLogout }: NavbarProps) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const router = useRouter()

    // gere le dark mode dans le localStorage ou par défaut
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme === "light") {
            document.documentElement.classList.remove("dark");
            setIsDarkMode(false);
        } else {
            document.documentElement.classList.add("dark");
            setIsDarkMode(true);
            if (!storedTheme) localStorage.setItem("theme", "dark");
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            document.documentElement.classList.toggle("dark", newMode);
            localStorage.setItem("theme", newMode ? "dark" : "light");
            return newMode;
        });
    };

    return (
        <nav className="border-b bg-card sticky top-0 z-50 backdrop-blur-sm bg-card/95 overscroll-none">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <div
                    onClick={() => onNavigate?.(isAuthenticated ? "dashboard" : "landing")}
                    className="cursor-pointer"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            onNavigate?.(isAuthenticated ? "dashboard" : "landing");
                        }
                    }}
                >
                    <Logo />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    {/* Dark mode toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>

                    {isAuthenticated ? (
                        <>
                            {/* Notifications */}
                            <Button variant="ghost" size="icon" className="rounded-full relative">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
                            </Button>

                            {/* Avatar + Dropdown */}
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
                                    <DropdownMenuItem onClick={() => onNavigate?.("settings")}>
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
                        <Button
                            onClick={() => router.push("./login")}
                            className="bg-blue-400 hover:bg-blue-400/90"

                        >
                            Connexion
                        </Button>
                    )}
                </div>
            </div>
        </nav>
    );
}
