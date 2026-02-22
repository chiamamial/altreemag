import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

export default function Post() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${API_URL}/posts/${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setPost(data);
                    // SEO
                    document.title = `${data.title} - AltreeMAG`;
                }
            } catch (error) {
                console.error("Error fetching post:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;
    if (!post) return <div className="container mt-8"><p>Articolo non trovato.</p><Link to="/" className="btn-primary mt-4">Torna alla Home</Link></div>;

    return (
        <article className="post-detail-container fade-in">
            <Link to="/" className="back-link">
                <ArrowLeft size={20} /> Torna indietro
            </Link>

            {post.header_image && (
                <div className="post-header-image" style={{ backgroundImage: `url(${post.header_image})` }}></div>
            )}

            <div className="post-content-wrapper">
                <header className="post-header">
                    <span className="post-category-badge">{post.categories?.name || 'Generale'}</span>
                    <h1 className="post-main-title">{post.title}</h1>
                    <div className="post-meta-details">
                        Pubblicato il {new Date(post.created_at).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </header>

                <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
            </div>
        </article>
    );
}
