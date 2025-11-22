import { Router } from 'express';
import { getPosts, createPost, likePost, addComment } from '../controllers/communityController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

router.get('/posts', getPosts);
router.post('/posts', verifyAuth, createPost);
router.post('/posts/:id/like', verifyAuth, likePost);
router.post('/posts/:id/comments', verifyAuth, addComment);

export default router;
