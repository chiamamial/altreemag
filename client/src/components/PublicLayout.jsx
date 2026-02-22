import { Link, Outlet } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

export default function PublicLayout() {
    const { theme, toggle } = useTheme();

    return (
        <div className="public-layout">
            <header className="navbar">
                <div className="container logo-container">
                    <a href="/" className="logo">
                        Altree<span className="logo-accent">MAG</span>
                    </a>
                    <button
                        onClick={toggle}
                        className="theme-toggle"
                        aria-label="Toggle dark mode"
                    >
                        {theme === 'dark' ? 'LIGHT' : 'DARK'}
                    </button>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <div className="container">
                    <p>&copy; 2026 AltreeMAG. Tutti i diritti riservati.</p>
                    <nav className="legal-links" aria-label="Legal links">
                        <Link to="/note-legali">Note Legali</Link>
                        <span aria-hidden="true">•</span>
                        <Link to="/privacy">Privacy Policy</Link>
                        <span aria-hidden="true">•</span>
                        <Link to="/cookie-policy">Cookie Policy</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}
