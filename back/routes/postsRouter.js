import Router from 'express';
import { postsController } from '../controllers/postsController.js';
import { postCreateValidation } from '../validations/postsValidation.js';
import { authMiddleware, validationCheckMiddleware } from '../middleware/index.js';

export const router = new Router();

router.post('/posts', authMiddleware, postCreateValidation, validationCheckMiddleware, postsController.createPost);
router.get('/posts', postsController.getPosts);
router.get('/tags', postsController.getTags);
router.get('/posts/:id', postsController.getOnePost);
router.delete('/posts/:id', authMiddleware, postsController.deletePost);
router.patch('/posts/:id', authMiddleware, postsController.updatePost);
