import { Router } from 'express';
import { commentsController } from '../controllers/commentsController.js';
import { validationCheckMiddleware, authMiddleware } from '../middleware/index.js';

export const router = new Router();
router.post('/comment', authMiddleware, commentsController.postComment);
router.delete('/comment/:id', authMiddleware, commentsController.deleteComment);
router.get('/comment', commentsController.getComments);
