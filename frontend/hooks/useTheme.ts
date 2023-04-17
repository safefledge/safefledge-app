"use client";

import { useState } from "react";
import { Theme } from "@/types/types";

export default function useTheme() {
    const [theme, setTheme] = useState<Theme>('light');

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
}