import asyncHandler from '../middleware/asyncMiddleware.js';
import ProjectModel from '../models/projectModel.js';
import UserModel from '../models/userModel.js';
import ProductModel from '../models/productModel.js';

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
    throw new Error('No project found');
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
    throw new Error('No project found');
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
    throw new Error('Product not found');
  }
});

export {
  createProject,
  listProjects,
  projectById,
  updateProject,
  deleteProject,
};
