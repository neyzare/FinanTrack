"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export function AppearanceCard() {
    const { theme, isDarkMode, setTheme } = useTheme();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                    Choisissez le thème de l&apos;interface. Le choix est conservé sur cet appareil.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        {isDarkMode ? (
                            <Moon className="w-5 h-5 text-muted-foreground" />
                        ) : (
                            <Sun className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                            <p className="font-medium">Thème {isDarkMode ? "sombre" : "clair"}</p>
                            <p className="text-sm text-muted-foreground">
                                Actuellement actif&nbsp;: <span className="font-medium">{theme}</span>
                            </p>
                        </div>
                    </div>

                    <div className="inline-flex rounded-lg border border-border bg-muted p-1">
                        <button
                            type="button"
                            onClick={() => setTheme("light")}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                                !isDarkMode
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Sun className="w-4 h-4" />
                            Clair
                        </button>
                        <button
                            type="button"
                            onClick={() => setTheme("dark")}
                            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
                                isDarkMode
                                    ? "bg-background text-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Moon className="w-4 h-4" />
                            Sombre
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
