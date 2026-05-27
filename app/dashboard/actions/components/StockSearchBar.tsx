"use client";

import { useState } from "react";

interface StockSearchBarProps {
    onSearch: (symbole: string) => Promise<boolean>;
}

export function StockSearchBar({ onSearch }: StockSearchBarProps) {
    const [value, setValue] = useState("");

    const submit = async () => {
        const ok = await onSearch(value);
        if (ok) setValue("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") submit();
    };

    return (
        <input
            className="w-full sm:w-64 px-2 py-1 border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary bg-input-background"
            type="text"
            placeholder="Rechercher une action..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyPress}
        />
    );
}
