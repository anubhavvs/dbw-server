import express from 'express';

import {
  createProject,
  listProjects,
  projectById,
} from '../controller/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createProject).get(protect, listProjects);
router.route('/:id').get(protect, projectById);

export default router;
