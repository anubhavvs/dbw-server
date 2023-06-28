import asyncHandler from '../middleware/asyncMiddleware.js';
import ProjectModel from '../models/projectModel.js';
import UserModel from '../models/userModel.js';
import ProductModel from '../models/productModel.js';
import SystemModel from '../models/systemModel.js';

// Creates a new project
const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const user = await UserModel.findById(req.user._id);

  if (!user.premium && user.projects.length === 1) {
    res.status(400);
    throw new Error('Project credits exhausted.');
  }

  const project = new ProjectModel({
    user: req.user._id,
    name,
    description,
    premium: req.user.premium,
  });

  user.projects.push(project);

  user.save();

  const createdProject = await project.save();

  res.status(201).json(createdProject);
});

// Returns all the project for a user
const listProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectModel.find({ user: req.user._id });

  if (projects) {
    res.status(200).json(projects);
  }
});

// Get project by Id
const projectById = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id).populate(
    'products'
  );

  if (project && project.user._id.toString() == req.user._id.toString()) {
    res.status(200).json(project);
  } else {
    res.status(401);
    throw new Error('Project not found.');
  }
});

// Update product
const updateProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await ProjectModel.findById(req.params.id);

  if (project && project.user._id.toString() == req.user._id.toString()) {
    project.name = name;
    project.description = description;

    const updatedProject = await project.save();
    res.json(updatedProject);
  } else {
    res.status(404);
    throw new Error('Project not found.');
  }
});

const deleteProject = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id);

  if (project && project.user._id.toString() == req.user._id.toString()) {
    const user = await UserModel.findById(project.user);

    project.products.forEach(async (element) => {
      await ProductModel.deleteOne({ _id: element._id });
    });
    await project.deleteOne({ _id: project._id });
    user.projects.pull({ _id: project._id });
    user.save();
    res.json({ message: 'Project deleted.' });
  } else {
    res.status(404);
    throw new Error('Project not found.');
  }
});

// create report for all active products
const createReport = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id).populate(
    'products'
  );

  if (project) {
    let result = [];
    let labels = [];

    for (const element of project.products) {
      if (element.status === 'Active') {
        var productionList = [];
        const system = await SystemModel.findById(element.system);

        for (const item of element.weatherData) {
          var value = (item.t_ghi * ((100 - item.clouds) / 100)) / 1000;
          productionList.push(value);
        }

        labels = element.weatherData.map(
          (item) =>
            '%27' +
            item.datetime.getDate() +
            '-' +
            (item.datetime.getMonth() + 1) +
            '%27'
        );

        result.push({
          label:
            '%27' +
            encodeURIComponent(element.name + ' ') +
            '(' +
            element.location.coordinates[1].toFixed(3) +
            ',' +
            element.location.coordinates[0].toFixed(3) +
            ')' +
            '%27',
          data: productionList,
          fill: false,
        });
      }
    }

    var chartURL = `https://quickchart.io/chart?c={type:%27line%27,data:{labels:[${labels}],datasets:${JSON.stringify(
      result
    )}},options:{title:{display:true,text:%27Daily%20Electricity%20Production%27},scales:{xAxes:[{display:true,scaleLabel:{display:true,labelString:%27Days%27}}],yAxes:[{display:true,scaleLabel:{display:true,labelString:%27kWh%27}}]}}}`;

    project.result = chartURL;
    project.readOnly = true;
    for (const product of project.products) {
      product.status = 'Inactive';
      product.save();
    }
    project.save();
    res.json(chartURL.replaceAll('"', ''));
  } else {
    res.status(404);
    throw new Error('Project not found.');
  }
});

export {
  createProject,
  listProjects,
  projectById,
  updateProject,
  deleteProject,
  createReport,
};
