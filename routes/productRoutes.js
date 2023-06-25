import express from 'express';

import { createProduct } from '../controller/productController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:id').post(protect, createProduct);

export default router;
