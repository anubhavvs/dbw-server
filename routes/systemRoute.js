import express from 'express';

import {
  createSystem,
  deleteSystem,
  editSystem,
  getSystems,
} from '../controller/systemController.js';
import { company, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(company, createSystem).get(protect, getSystems);
router.route('/:id').put(company, editSystem).delete(company, deleteSystem);

export default router;
