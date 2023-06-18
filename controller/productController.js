import asyncHandler from '../middleware/asyncMiddleware.js';

import ProductModel from '../models/productModel.js';

// @desc    Create product
// @route   POST /api/product/
// @access  Private/Company
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, cellType, capacity, efficiency, warrantyYears } =
    req.body;
  const product = new ProductModel({
    company: req.company._id,
    name,
    description,
    cellType,
    capacity,
    efficiency,
    warrantyYears,
  });

  const createdProduct = await product.save();

  if (createdProduct) {
    res.status(201).json(createdProduct);
  } else {
    res.status(401);
    throw new Error('Invalid product data');
  }
});

export { createProduct };
