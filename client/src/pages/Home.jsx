import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

export default function Home() {
    const HERO_TITLE_MAX_CHARS = 60;
    const heroSectionStyle = { height: '50vh', minHeight: '26rem', overflow: 'hidden' };
    const heroTitleStyle = { fontSize: 'clamp(1.5rem, 2.8vw, 2.8rem)' };
    const feedTitleStyle = { fontSize: 'clamp(1.4rem, 2.8vw, 2.4rem)' };
    const heroMetaLabelSpacing = { marginTop: '0.75rem' };
    const heroMetaTextStyle = { marginTop: '0.75rem', lineHeight: 1.4, fontSize: '0.82rem', color: 'var(--text-muted)' };
    const heroDateTextStyle = { marginTop: '0.75rem', fontSize: '0.82rem' };
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
        fetchCategories();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await fetch(`${API_URL}/posts`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data.filter(p => p.published));
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const getGridColumn = (index) => {
        // Creates a sparse looking editorial grid
        const columns = [
            '1 / 2', '3 / 4', '2 / 3', '4 / 5',
            '1 / 2', '4 / 5', '2 / 3', '3 / 4'
        ];
        return columns[index % columns.length];
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    const filteredPosts = activeCategory
        ? posts.filter(p => p.category_id === activeCategory)
        : posts;

    const heroPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
    const feedPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];
    const marqueePosts = filteredPosts.slice(0, 12);
    const heroTitle = heroPost?.title
        ? (heroPost.title.length > HERO_TITLE_MAX_CHARS
            ? `${heroPost.title.slice(0, HERO_TITLE_MAX_CHARS).trimEnd()}...`
            : heroPost.title)
        : '';

    return (
        <div className="home-container fade-in">
            {/* Editorial Split Hero */}
            {heroPost ? (
                <section className="editorial-hero" style={heroSectionStyle}>
                    <div className="hero-left">
                        <Link to={`/post/${heroPost.slug}`}>
                            <h1 className="hero-main-title" style={heroTitleStyle}>{heroTitle}</h1>
                        </Link>
                        <div className="hero-meta-grid">
                            <div className="hero-meta-label">Category</div>
                            <div>{heroPost.categories?.name || 'General'}</div>
                            <div className="hero-meta-label" style={heroMetaLabelSpacing}>Summary</div>
                            <div style={heroMetaTextStyle}>
                                {heroPost.content
                                    ? heroPost.content.replace(/<[^>]+>/g, '').slice(0, 80) + '…'
                                    : 'Leggi l\'articolo completo →'}
                            </div>
                            <div className="hero-meta-label" style={heroMetaLabelSpacing}>Date</div>
                            <div style={heroDateTextStyle}>
                                {new Date(heroPost.created_at).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    <div className="hero-center">
                        <div className="vertical-text">L · A · T · E · S · T</div>
                    </div>

                    <div className="hero-right">
                        {heroPost.header_image ? (
                            <img src={heroPost.header_image} alt={heroPost.title} className="hero-image" />
                        ) : (
                            <div className="hero-image" style={{ background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>No Image</div>
                        )}

                        <div className="hero-right-label">
                            <Link to={`/post/${heroPost.slug}`} style={{ textDecoration: 'none' }}>
                                Read Article &rarr;
                            </Link>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="editorial-hero" style={heroSectionStyle}>
                    <div className="hero-left">
                        <h1 className="hero-main-title" style={heroTitleStyle}>No<br />Articles<br />Yet</h1>
                    </div>
                    <div className="hero-center"></div>
                    <div className="hero-right"></div>
                </section>
            )}

            {marqueePosts.length > 0 && (
                <section className="titles-marquee" aria-label="Article titles marquee">
                    <div className="marquee-track">
                        {[0, 1].map(copy => (
                            <div className="marquee-group" key={copy}>
                                {marqueePosts.map(post => (
                                    <span className="marquee-item" key={`${copy}-${post.id}`}>
                                        <Link to={`/post/${post.slug}`} className="marquee-link">
                                            {post.title}
                                        </Link>
                                        <span className="marquee-star" aria-hidden="true">★</span>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Post Feed */}
            <section className="feed-section">
                <header className="feed-header">
                    <h2 className="section-title text-center" style={feedTitleStyle}>ALL NEWS</h2>
                    <div className="category-pills">
                        <button
                            className={`category-pill ${activeCategory === '' ? 'active' : ''}`}
                            onClick={() => setActiveCategory('')}
                        >
                            ALL
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="posts-grid sparse-grid">
                    {feedPosts.length === 0 ? (
                        <p className="no-posts font-bold">No other articles available.</p>
                    ) : (
                        feedPosts.map((post, index) => (
                            <Link
                                to={`/post/${post.slug}`}
                                key={post.id}
                                className="post-card sparse-post-card"
                                style={{ gridColumn: getGridColumn(index) }}
                            >
                                <div className="post-card-image-wrapper">
                                    <div className="post-card-corner top-left"></div>
                                    <div className="post-card-corner top-right"></div>
                                    <div className="post-card-corner bottom-left"></div>
                                    <div className="post-card-corner bottom-right"></div>

                                    {post.header_image ? (
                                        <div className="post-card-image" style={{ backgroundImage: `url(${post.header_image})` }}></div>
                                    ) : (
                                        <div className="post-card-image placeholder-image"></div>
                                    )}
                                </div>
                                <div className="post-card-content">
                                    <h2 className="post-title">{post.title}</h2>
                                    <div className="post-meta">
                                        {new Date(post.created_at).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }).replace(/\//g, '.')}
                                        {' '}by MinimalBlog
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                {feedPosts.length > 0 && (
                    <div className="view-more-container flex-center">
                        <button className="view-more-btn">
                            VIEW<br />MORE
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
}
