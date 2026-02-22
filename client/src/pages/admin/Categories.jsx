import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { API_URL } from '../../config';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const generateSlug = (text) =>
        text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API_URL}/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName.trim(), slug: generateSlug(newName) }),
            });
            if (res.ok) {
                setNewName('');
                fetchCategories();
            } else {
                const err = await res.json();
                alert(`Errore: ${err.message || 'Creazione fallita'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Errore di rete');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Eliminare questa categoria?')) return;
        try {
            await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
            fetchCategories();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fade-in">
            <div className="flex-between mb-8">
                <div className="flex-align">
                    <Link to="/admin" className="btn-icon mr-4 text-muted"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold">Categorie</h1>
                </div>
            </div>

            {/* Create form */}
            <form onSubmit={handleCreate} className="admin-form glassmorphism flex-align mb-8" style={{ padding: '1.5rem', gap: '1rem' }}>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="input-premium"
                    placeholder="Nome categoria (es. Moda)"
                    style={{ flex: 1 }}
                />
                <button type="submit" disabled={saving} className="btn-primary flex-align" style={{ whiteSpace: 'nowrap' }}>
                    <Plus size={16} className="mr-2" />
                    {saving ? 'Salvataggio...' : 'Aggiungi'}
                </button>
            </form>

            {/* Categories list */}
            <div className="table-container glassmorphism">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Slug</th>
                            <th>Azioni</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center py-4">Caricamento...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-4">Nessuna categoria. Creane una!</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id}>
                                    <td className="font-bold">{cat.name}</td>
                                    <td className="text-muted" style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{cat.slug}</td>
                                    <td>
                                        <button
                                            className="btn-icon text-red"
                                            onClick={() => handleDelete(cat.id)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
