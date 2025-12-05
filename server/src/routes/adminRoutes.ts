import { Router } from 'express';
import { verifyAuth } from '../middleware/auth';
import { verifyAdmin } from '../middleware/admin';
import { getAllUsers, updateUserStatus } from '../controllers/adminController';

const router = Router();

// All admin routes require authentication AND admin privileges
router.use(verifyAuth, verifyAdmin);

router.get('/users', getAllUsers);
router.patch('/users/:id/status', updateUserStatus);

export default router;
