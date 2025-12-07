import { Router } from 'express';
import { getHistory, addHistoryItem, deleteHistoryItem, clearHistory } from '../controllers/promptController';
import { verifyAuth } from '../middleware/auth';

const router = Router();

router.get('/', verifyAuth, getHistory);
router.post('/', verifyAuth, addHistoryItem);
router.delete('/:id', verifyAuth, deleteHistoryItem);
router.delete('/', verifyAuth, clearHistory);
router.post('/enhance', verifyAuth, enhancePromptComponent);

export default router;
