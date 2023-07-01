import express from 'express';

import {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  userStatistics,
} from '../controller/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .delete(protect, deleteUserProfile)
  .put(protect, updateUserProfile);
router.get('/stats', protect, userStatistics);

export default router;
