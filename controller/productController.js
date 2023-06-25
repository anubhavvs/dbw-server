import asyncHandler from '../middleware/asyncMiddleware.js';
import ProjectModel from '../models/projectModel.js';
import ProductModel from '../models/productModel.js';

// create a new product
const createProduct = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);

  if (project) {
    if (!project.premium && project.products.length === 3) {
      res.status(400);
      throw new Error('Project credits exhausted.');
    } else {
      if (project.user._id.toString() == req.user._id.toString()) {
        const product = new ProductModel({
          project: project._id,
          name: `Product ${project.products.length + 1}`,
          location: {
            type: 'Point',
            coordinates: [12.92137, 50.827847],
          },
          azimuth: 180,
          inclination: 30,
          area: 25,
          systemLoss: 14,
          status: 'Draft',
        });

        const createdProduct = await product.save();

        project.products.push(product);

        project.save();

        res.status(201).json(createdProduct);
      } else {
        res.status(401);
        throw new Error('No project found');
      }
    }
  }
});

export { createProduct };
