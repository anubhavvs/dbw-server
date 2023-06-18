import express from 'express';

import { createSystem } from '../controller/systemController.js';
import { company } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', company, createSystem);

export default router;
