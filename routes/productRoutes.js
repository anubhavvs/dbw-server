import express from 'express';

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from '../controller/productController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id').post(protect, createProduct).put(protect, updateProduct);
router.route('/:projectID/:productID').delete(protect, deleteProduct);

export default router;
