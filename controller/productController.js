import asyncHandler from '../middleware/asyncMiddleware.js';

import ProductModel from '../models/productModel.js';
import CompanyModel from '../models/companyModel.js';

// @desc    Create product
// @route   POST /api/product/
// @access  Private/Company
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, cellType, capacity, efficiency, warrantyYears } =
    req.body;
  const company = await CompanyModel.findById(req.company._id);
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
  company.products.push(createProduct);

  if (createdProduct) {
    res.status(201).json(createdProduct);
  } else {
    res.status(401);
    throw new Error('Invalid product data');
  }
});

export { createProduct };
