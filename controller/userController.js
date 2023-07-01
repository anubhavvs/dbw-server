import validator from 'validator';

import asyncHandler from '../middleware/asyncMiddleware.js';
import generateToken from '../utils/generateJWT.js';
import UserModel from '../models/userModel.js';
import ProjectModel from '../models/projectModel.js';

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await UserModel.findOne({ email });

  if (user && (await user.status) === 'deleted') {
    res.status(401);
    throw new Error('Account is deleted');
  }

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      status: user.status,
      premium: user.premium,
      projects: user.projects,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  if (!validator.isStrongPassword(password)) {
    res.status(400);
    throw new Error('Password not strong');
  }

  const userExists = await UserModel.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await UserModel.create({
    name,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      status: user.status,
      premium: user.premium,
      projects: user.projects,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      premium: user.premium,
      createdAt: user.createdAt,
      projects: user.projects,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      premium: updatedUser.premium,
      createdAt: updatedUser.createdAt,
      projects: user.projects,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user profile
// @route   PUT /api/users/profile
// @access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);

  if (user) {
    user.status = 'deleted';

    await user.save();

    res.json({ message: 'Account deleted' });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// @desc    Get stats
// @route   POST /api/users/stats
// @access  Private
const userStatistics = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);

  var activeProjectsCount = 0;
  var inactiveProjectsCount = 0;
  var activeProductsCount = 0;
  var inactiveProductsCount = 0;
  var draftProductsCount = 0;

  if (user) {
    const activeProjects = await ProjectModel.find({
      user: req.user._id,
      readOnly: false,
    });

    const inactiveProjects = await ProjectModel.find({
      user: req.user._id,
      readOnly: true,
    });

    const allProjects = await ProjectModel.find({
      user: req.user._id,
    }).populate('products');

    for (const projects of allProjects) {
      for (const products of projects.products) {
        if (products.status === 'Inactive')
          inactiveProductsCount = inactiveProductsCount + 1;
        if (products.status === 'Draft')
          draftProductsCount = draftProductsCount + 1;
        if (products.status === 'Active')
          activeProductsCount = activeProductsCount + 1;
      }
    }

    activeProjectsCount = activeProjects.length;
    inactiveProjectsCount = inactiveProjects.length;

    res.status(200).json({
      activeProjectsCount,
      inactiveProjectsCount,
      activeProductsCount,
      inactiveProductsCount,
      draftProductsCount,
    });
  }
});

export {
  loginUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  userStatistics,
};
