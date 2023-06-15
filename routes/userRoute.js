import express from 'express';

import {
  loginUser,
  registerUser,
  logoutUser,
  getAllUsers,
} from '../controller/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getAllUsers);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
