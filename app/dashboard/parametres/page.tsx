"use client";

import { useState } from "react";
import { Settings } from "@/app/dashboard/parametres/Parametres";

export default function Page() {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleToggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <Settings isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />
    );
}