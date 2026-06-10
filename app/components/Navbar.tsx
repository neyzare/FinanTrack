"use client";

import {useEffect, useState} from "react";
import {Button} from "./ui/button";
import {Logo} from "./Logo";
import {Moon, Sun, User, UserRoundCog} from "lucide-react";
import {useRouter, usePathname} from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {auth} from "@/app/lib/auth";
import Link from "next/link";
import {authLogout} from "@/app/lib/authLogout";
import {useTheme} from "@/app/components/ThemeProvider";

interface NavbarProps {
    initialAuth?: boolean;
    onNavigate?: (page: string) => void;
    onLogout?: () => void;
}

export function Navbar({ initialAuth = false, onNavigate }: NavbarProps) {
    const { isDarkMode, toggleTheme } = useTheme();
    const [isAuth, setIsAuth] = useState<boolean>(initialAuth)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await auth()
                setIsAuth(!!user)
            } catch {
                setIsAuth(false)
            }
        }

        void checkAuth()
    }, [pathname])

    const handleLogout = async () => {
        try {
            await authLogout()
            router.push("/login")
        }
        catch (error) {
            console.error("Erreur lors de la déconnexion:", error)
        }
    }

    return (
        <nav className="border-b sticky top-0 z-50 backdrop-blur-sm bg-card/95 overscroll-none">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">

                <Link href="/">
                    <div
                        onClick={() => onNavigate?.(isAuth ? "dashboard" : "landing")}
                        className="cursor-pointer"

                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                onNavigate?.(isAuth ? "dashboard" : "landing");
                            }
                        }}
                    >
                        <Logo />
                    </div>
                </Link>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="rounded-full"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </Button>

                    {isAuth ? (
                        <>
                            <Link href="/dashboard">
                                <button className="font-bold">
                                    Dashboard
                                </button>
                            </Link>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="rounded-full p-1 hover:bg-accent transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                                        <UserRoundCog />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => onNavigate?.("settings")}>
                                       <Link href="/parametre">
                                           <User className="w-4 h-4 mr-2" />
                                           Paramètres
                                       </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
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
