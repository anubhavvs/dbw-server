import express from 'express';

import { createProduct } from '../controller/productController.js';
import { company } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', company, createProduct);

export default router;
