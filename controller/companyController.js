import validator from 'validator';

import asyncHandler from '../middleware/asyncMiddleware.js';
import generateToken from '../utils/generateJWT.js';
import CompanyModel from '../models/companyModel.js';
import SystemModel from '../models/systemModel.js';

// @desc    Authenticate an existing company
// @route   POST /api/company/login
// @access  Public
const loginCompany = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const company = await CompanyModel.findOne({ email });

  if (company && (await company.matchPassword(password))) {
    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      website: company.website,
      location: company.location,
      description: company.description,
      token: generateToken(company._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new company
// @route   POST /api/company/register
// @access  Public
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
    res.status(201).json({
      _id: company._id,
      name: company.name,
      email: company.email,
      website: company.website,
      location: company.location,
      description: company.description,
      token: generateToken(company._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid company data');
  }
});

// @desc    Get company profile
// @route   GET /api/company/profile
// @access  Private/Company
const getCompanyProfile = asyncHandler(async (req, res) => {
  const company = await CompanyModel.findById(req.company._id);

  if (company) {
    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      website: company.website,
      location: company.location,
      description: company.description,
      createdAt: company.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Update company profile
// @route   PUT /api/company/profile
// @access  Private/Company
const updateCompanyProfile = asyncHandler(async (req, res) => {
  const company = await CompanyModel.findById(req.company._id);

  if (company) {
    company.name = req.body.name || company.name;
    company.email = req.body.email || company.email;
    company.website = req.body.website || company.website;
    company.location = req.body.location || company.location;
    company.description = req.body.description || company.description;

    if (req.body.password) {
      company.password = req.body.password;
    }

    const updatedCompany = await company.save();

    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      website: company.website,
      location: company.location,
      description: company.description,
    });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

// @desc    Delete company profile
// @route   DELETE /api/company/profile
// @access  Private/Company
const deleteCompanyProfile = asyncHandler(async (req, res) => {
  const company = await CompanyModel.findById(req.company._id);

  if (company) {
    await CompanyModel.deleteOne({ _id: company._id });

    res.json({ message: 'Account deleted' });
  } else {
    res.status(400);
    throw new Error('User not found');
  }
});

// @desc    Get company systems
// @route   GET /api/company/
// @access  Private/Company
const listSystems = asyncHandler(async (req, res) => {
  const systems = await SystemModel.find({ company: req.company._id });

  if (systems) {
    res.status(200).json(systems);
  }
});

export {
  loginCompany,
  listSystems,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
  registerCompany,
};
