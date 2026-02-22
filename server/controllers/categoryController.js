import { supabase } from '../config/supabaseClient.js';

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new category
export const createCategory = async (req, res) => {
    try {
        const { name, slug } = req.body;

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name, slug }])
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
