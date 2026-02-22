import { useEffect, useState } from 'react';

export default function useTheme() {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('altreemag-theme') || 'light';
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('altreemag-theme', theme);
    }, [theme]);

    const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');

    return { theme, toggle };
}
