import express from 'express';

import {
  getAllUsers,
  getLogs,
  getDeletedUsers,
} from '../controller/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/allUsers', protect, admin, getAllUsers);
router.get('/logs', protect, admin, getLogs);
router.get('/deletedUsers', protect, admin, getDeletedUsers);

export default router;
