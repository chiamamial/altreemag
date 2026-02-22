import { supabaseAdmin } from '../config/supabaseClient.js';
import crypto from 'crypto';

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const file = req.file;
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        // Upload to Supabase Storage bucket 'blog-images'
        const { data, error } = await supabaseAdmin.storage
            .from('blog-images')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;

        // Get public URL
        const { data: publicUrlData } = supabaseAdmin.storage
            .from('blog-images')
            .getPublicUrl(filePath);

        res.status(200).json({ url: publicUrlData.publicUrl });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ error: error.message });
    }
};
