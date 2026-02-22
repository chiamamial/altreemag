import express from 'express';
import {
    getPosts,
    getPostBySlug,
    createPost,
    updatePost,
    deletePost
} from '../controllers/postController.js';

const router = express.Router();

router.get('/', getPosts);
router.get('/:slug', getPostBySlug);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

export default router;
