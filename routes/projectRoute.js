import express from 'express';

import {
  createProject,
  listProjects,
  projectById,
  updateProject,
  deleteProject,
  createReport,
} from '../controller/projectController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createProject).get(protect, listProjects);
router
  .route('/:id')
  .post(protect, createReport)
  .get(protect, projectById)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;
