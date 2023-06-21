import asyncHandler from '../middleware/asyncMiddleware.js';
import ProjectModel from '../models/projectModel.js';
import UserModel from '../models/userModel.js';

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

  const createdProduct = await project.save();

  res.status(201).json(createdProduct);

  res.status(200);
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
  const project = await ProjectModel.findById(req.params.id);

  if (project.user._id.toString() == req.user._id.toString()) {
    res.status(200).json(project);
  } else {
    res.status(401);
    throw new Error('Unauthorized Access');
  }
});

export { createProject, listProjects, projectById };