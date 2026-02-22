import { supabase } from '../config/supabaseClient.js';

// Get all posts
export const getPosts = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('posts')
            .select('*, categories(name, slug)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get single post by slug
export const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { data, error } = await supabase
            .from('posts')
            .select('*, categories(name, slug)')
            .eq('slug', slug)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ message: 'Post not found' });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new post
export const createPost = async (req, res) => {
    try {
        const { title, slug, content, header_image, category_id, published, author_id } = req.body;

        const { data, error } = await supabase
            .from('posts')
            .insert([
                { title, slug, content, header_image, category_id, published, author_id }
            ])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a post
export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const { data, error } = await supabase
            .from('posts')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a post
export const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
