import express from 'express';

import { createSystem, getSystems } from '../controller/systemController.js';
import { company, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(company, createSystem).get(protect, getSystems);

export default router;
