import express from 'express';
import UserController from '../controllers/UserController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', authenticate, authorize(['admin']), UserController.getAll);
router.get('/me', authenticate, authorize([]), UserController.getMe);
router.put('/me', authenticate, authorize([]), UserController.updateMe);
router.get('/:id', authenticate, authorize(['admin']), UserController.getById);

export default router;
