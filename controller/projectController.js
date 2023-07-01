import asyncHandler from '../middleware/asyncMiddleware.js';
import ProjectModel from '../models/projectModel.js';
import UserModel from '../models/userModel.js';
import ProductModel from '../models/productModel.js';
import SystemModel from '../models/systemModel.js';
import mailReport from '../utils/mailReport.js';

// @desc    Create new project
// @route   POST /api/project/
// @access  Private
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

// @desc    Returns all project by user
// @route   GET /api/project/
// @access  Private
const listProjects = asyncHandler(async (req, res) => {
  const projects = await ProjectModel.find({ user: req.user._id });

  if (projects) {
    res.status(200).json(projects);
  }
});

// @desc    Get project by ID
// @route   GET /api/project/:id
// @access  Private
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

// @desc    Update a project
// @route   PUT /api/project/:id
// @access  Private
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

// @desc    Delete a project
// @route   DELETE /api/project/:id
// @access  Private
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

// @desc    Create Report
// @route   POST /api/project/:id
// @access  Private
const createReport = asyncHandler(async (req, res) => {
  const project = await ProjectModel.findById(req.params.id).populate(
    'products'
  );
  const user = await UserModel.findById(req.user._id);

  if (project) {
    let result = [];
    let labels = [];
    let emailData = [];

    for (const element of project.products) {
      if (element.status === 'Active') {
        var productionList = [];
        const system = await SystemModel.findById(element.system);

        for (const item of element.weatherData) {
          var value =
            (item.t_ghi *
              element.area *
              ((100 - item.clouds / item.max_uv) / 100) *
              ((100 - element.systemLoss) / 100) *
              Math.cos(element.azimuth - 180) *
              Math.cos(element.inclination - 30) *
              (system.efficiency / 100)) /
            1000;

          productionList.push(value);
          emailData.push({
            date: item.datetime,
            value: value,
            product: element.name,
            location: [
              element.location.coordinates[1],
              element.location.coordinates[0],
            ],
          });
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
    try {
      mailReport(
        chartURL.replaceAll('"', ''),
        user.email,
        project.name,
        emailData
      );
    } catch (error) {
      res.status(500);
      throw new Error('Unable to send email');
    }

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
