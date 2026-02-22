import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ArrowLeft, Save } from 'lucide-react';
import { API_URL } from '../../config';

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);
    const quillRef = useRef(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [headerImage, setHeaderImage] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [published, setPublished] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(isEditing);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    }, []);

    const fetchPost = useCallback(async () => {
        try {
            // Not the best practice to fetch by slug if we only have ID, but the backend currently gets POSTs all at once, let's just get the specific one assuming we have an endpoint for ID or we just filter.
            // Wait, our backend gets by slug. We need an endpoint to get by ID or just use the slug. 
            // For simplicity in this demo, let's fetch all and find it (not ideal for prod).
            const res = await fetch(`${API_URL}/posts`);
            if (res.ok) {
                const data = await res.json();
                const post = data.find(p => p.id === id);
                if (post) {
                    setTitle(post.title || '');
                    setContent(post.content || '');
                    setHeaderImage(post.header_image || '');
                    setPublished(post.published || false);
                    setSelectedCategory(post.category_id || '');
                }
            }
        } catch (err) {
            console.error("Error fetching post", err);
        } finally {
            setFetching(false);
        }
    }, [id]);

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchPost();
        } else {
            setFetching(false);
        }
    }, [fetchCategories, fetchPost, isEditing]);

    const generateSlug = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w-]+/g, '')       // Remove all non-word chars
            .replace(/--+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploadingImage(true);

        try {
            const res = await fetch(`${API_URL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setHeaderImage(data.url);
            } else {
                alert('Errore caricamento immagine. Controlla che il Bucket sia pubblico e che il file non superi i 10MB.');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            alert('Errore di rete durante l\'upload.');
        } finally {
            setUploadingImage(false);
        }
    };

    // Custom image handler for inline images inside the article body
    const handleInlineImageUpload = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('image', file);

            try {
                const res = await fetch(`${API_URL}/upload`, {
                    method: 'POST',
                    body: formData,
                });

                if (res.ok) {
                    const data = await res.json();
                    const quill = quillRef.current.getEditor();
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', data.url);
                    quill.setSelection(range.index + 1);
                } else {
                    alert('Errore nel caricamento immagine inline.');
                }
            } catch (err) {
                console.error('Inline upload error', err);
                alert('Errore di rete.');
            }
        };
    }, []);

    const quillModules = useMemo(() => ({
        toolbar: {
            container: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
            ],
            handlers: {
                image: handleInlineImageUpload
            }
        }
    }), [handleInlineImageUpload]);

    const quillFormats = useMemo(() => [
        'header', 'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'blockquote', 'code-block',
        'link', 'image'
    ], []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const postData = {
            title,
            slug: generateSlug(title),
            content,
            header_image: headerImage,
            published,
            category_id: selectedCategory || null
        };

        try {
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing
                ? `${API_URL}/posts/${id}`
                : `${API_URL}/posts`;

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData)
            });

            if (res.ok) {
                navigate('/admin');
            } else {
                const error = await res.json();
                alert(`Errore: ${error.message || 'Salvataggio fallito'}`);
            }
        } catch (error) {
            console.error("Submit error", error);
            alert("Errore di rete");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="fade-in">
            <div className="flex-between mb-8">
                <div className="flex-align">
                    <Link to="/admin" className="btn-icon mr-4 text-muted"><ArrowLeft /></Link>
                    <h1 className="text-3xl font-bold">{isEditing ? 'Modifica Articolo' : 'Nuovo Articolo'}</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="admin-form glassmorphism" style={{ padding: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>

                    <div className="main-editor">
                        <div className="form-group">
                            <label>Titolo dell'articolo</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                className="input-premium"
                                placeholder="Inserisci un titolo accattivante..."
                                style={{ fontSize: '1.25rem', fontWeight: 'bold' }}
                            />
                        </div>

                        <div className="form-group quill-container">
                            <label>Contenuto</label>
                            <ReactQuill
                                ref={quillRef}
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                modules={quillModules}
                                formats={quillFormats}
                                style={{ height: '400px', marginBottom: '3rem', color: '#000', backgroundColor: '#fff', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <div className="sidebar-settings">
                        <div className="form-group">
                            <label>Stato Pubblicazione</label>
                            <div className="flex-align" style={{ gap: '1rem' }}>
                                <label className="flex-align" style={{ cursor: 'pointer', margin: 0 }}>
                                    <input
                                        type="radio"
                                        name="published"
                                        checked={!published}
                                        onChange={() => setPublished(false)}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    Bozza
                                </label>
                                <label className="flex-align" style={{ cursor: 'pointer', margin: 0 }}>
                                    <input
                                        type="radio"
                                        name="published"
                                        checked={published}
                                        onChange={() => setPublished(true)}
                                        style={{ marginRight: '0.5rem' }}
                                    />
                                    Pubblicato
                                </label>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Categoria</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="input-premium"
                            >
                                <option value="">Nessuna (Generale)</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Immagine di Copertina</label>

                            <div className="flex-align mb-4" style={{ gap: '1rem' }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                />
                                <label
                                    htmlFor="image-upload"
                                    className="btn-primary"
                                    style={{ cursor: 'pointer', margin: 0, textAlign: 'center', flex: 1 }}
                                >
                                    {uploadingImage ? 'Caricamento...' : 'Carica dal PC'}
                                </label>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>oppure URL:</span>
                            </div>

                            <input
                                type="url"
                                value={headerImage}
                                onChange={(e) => setHeaderImage(e.target.value)}
                                className="input-premium"
                                placeholder="https://..."
                            />
                            {headerImage && (
                                <div className="mt-4" style={{ height: '150px', backgroundImage: `url(${headerImage})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '8px' }}></div>
                            )}
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex-center mt-8">
                            <Save size={18} className="mr-2" />
                            {loading ? 'Salvataggio...' : 'Salva Articolo'}
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
}
