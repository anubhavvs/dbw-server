import asyncHandler from '../middleware/asyncMiddleware.js';
import ProjectModel from '../models/projectModel.js';
import ProductModel from '../models/productModel.js';
import fetchWeather from '../utils/fetchWeather.js';

// @desc    Create new product
// @route   POST /api/product/:projectID
// @access  Private
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

// @desc    Update a product
// @route   PUT /api/product/:id
// @access  Private
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

    // start last 28 days fetch
    const data = await fetchWeather(
      product.location.coordinates[1],
      product.location.coordinates[0]
    );

    data.forEach((element) => {
      product.weatherData.push({
        datetime: element.datetime,
        ghi: element.ghi,
        t_ghi: element.t_ghi,
        max_uv: element.max_uv,
        clouds: element.clouds,
        temp: element.temp,
      });
    });

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(400);
    throw new Error('Product not found.');
  }
});

// @desc    Delete a product
// @route   DELETE /api/product/:projectID/:productID
// @access  Private
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
