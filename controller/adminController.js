import validator from 'validator';

import UserModel from '../models/userModel.js';
import LogModel from '../models/logModel.js';
import CompanyModel from '../models/companyModel.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import generateToken from '../utils/generateJWT.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({});
  res.json(users);
});

// @desc    Get server logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getLogs = asyncHandler(async (req, res) => {
  const logs = await LogModel.find({});
  res.json(logs);
});

// @desc    Get deleted users
// @route   GET /api/admin/logs
// @access  Private/Admin
const getDeletedUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({ status: 'deleted' });
  res.json(users);
});

// @desc    Register a new company
// @route   POST /api/admin/company
// @access  Private/Admin
const registerCompany = asyncHandler(async (req, res) => {
  const { name, email, password, website, location, description } = req.body;

  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error('Invalid email format');
  }

  if (!validator.isStrongPassword(password)) {
    res.status(400);
    throw new Error('Password not strong');
  }

  const companyExists = await CompanyModel.findOne({ email });

  if (companyExists) {
    res.status(400);
    throw new Error('Company already exists');
  }

  const company = await CompanyModel.create({
    name,
    email,
    password,
    website,
    location,
    description,
  });

  if (company) {
    generateToken(res, company._id);

    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      website: company.website,
      location: company.location,
      description: company.description,
      products: company.products,
    });
  } else {
    res.status(400);
    throw new Error('Invalid company data');
  }
});

export { getAllUsers, getLogs, getDeletedUsers, registerCompany };
