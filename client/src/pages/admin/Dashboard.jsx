import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Link } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react';
import { API_URL } from '../../config';

export default function Dashboard() {
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/posts`);
            if (res.ok) {
                const data = await res.json();
                setPosts(data);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchPosts();
    }, [fetchPosts]);

    const handleDelete = async (id) => {
        if (!window.confirm('Sei sicuro di voler eliminare questo post?')) return;
        try {
            await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
            fetchPosts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="dashboard-container fade-in">
            <header className="dashboard-header flex-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted">Gestisci i tuoi articoli e categorie</p>
                </div>
                <button onClick={handleLogout} className="btn-danger flex-align">
                    <LogOut size={16} className="mr-2" /> Esci
                </button>
            </header>

            <section className="dashboard-content">
                <div className="flex-between mb-4">
                    <h2 className="text-xl font-bold">Articoli Pubblicati</h2>
                    <div className="flex-align" style={{ gap: '0.75rem' }}>
                        <Link to="/admin/categories" className="btn-secondary flex-align">
                            Categorie
                        </Link>
                        <Link to="/admin/post/new" className="btn-primary flex-align">
                            <Plus size={16} className="mr-2" /> Nuovo Articolo
                        </Link>
                    </div>
                </div>

                <div className="table-container glassmorphism">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Titolo</th>
                                <th>Categoria</th>
                                <th>Stato</th>
                                <th>Data</th>
                                <th>Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Nessun post presente.</td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.id}>
                                        <td>{post.title}</td>
                                        <td>{post.categories?.name || '-'}</td>
                                        <td>
                                            <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                                                {post.published ? 'Pubblicato' : 'Bozza'}
                                            </span>
                                        </td>
                                        <td>{new Date(post.created_at).toLocaleDateString('it-IT')}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link to={`/admin/post/edit/${post.id}`} className="btn-icon text-blue"><Edit size={16} /></Link>
                                                <button className="btn-icon text-red" onClick={() => handleDelete(post.id)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
