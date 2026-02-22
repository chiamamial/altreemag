import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <section className="not-found-page container">
            <p className="not-found-code">404</p>
            <h1>Pagina non trovata</h1>
            <p className="not-found-text">
                Il contenuto che cerchi non esiste o e` stato spostato.
            </p>
            <Link to="/" className="btn-primary not-found-link">
                Torna alla home
            </Link>
        </section>
    );
}
