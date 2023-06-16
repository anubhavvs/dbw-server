import express from 'express';

import {
  loginUser,
  registerUser,
  logoutUser,
} from '../controller/userController.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

export default router;
