import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/uploadController.js';

const router = express.Router();

// Memory storage for Multer: we don't save to disk, we pass the buffer directly to Supabase
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

router.post('/', upload.single('image'), uploadImage);

export default router;
