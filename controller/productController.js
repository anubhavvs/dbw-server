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
        throw new Error('Project not found.');
      }
    }
  }
});

// update a product
const updateProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.id);

  if (product) {
    product.system = req.body.system;
    product.location = {
      type: 'Point',
      coordinates: [req.body.longitude, req.body.latitude],
    };
    product.azimuth = req.body.azimuth;
    product.inclination = req.body.inclination;
    product.area = req.body.area;
    product.systemLoss = req.body.systemLoss;
    product.status = 'Active';

    // start cron job

    // start last 1 year fetch

    const updatedProduct = await product.save();
  } else {
    res.status(400);
    throw new Error('Product not found.');
  }

  res.json(product);
});

// delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await ProductModel.findById(req.params.productID);
  const project = await ProjectModel.findById(req.params.projectID);

  if (product && project.user._id.toString() == req.user._id.toString()) {
    await project.products.pull({ _id: product._id });
    await ProductModel.deleteOne({ _id: product._id });

    project.save();

    // delete cron job
    res.json({ message: 'Product deleted.' });
  } else {
    res.status(400);
    throw new Error('Product not found.');
  }
});

export { createProduct, updateProduct, deleteProduct };
