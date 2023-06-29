import validator from 'validator';

import asyncHandler from '../middleware/asyncMiddleware.js';
import generateToken from '../utils/generateJWT.js';
import CompanyModel from '../models/companyModel.js';
import SystemModel from '../models/systemModel.js';

/**
 * @openapi
 * /company/login:
 *    post:
 *      summary: Authenticate an existing company
 *      tags:
 *        - Company
 *      requestBody:
 *        description: Provie the email and password of an existing company.
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/LogInUserInput'
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/LogInUserOutput'
 *        401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */
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

// get company profile data
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

// update company account
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

// delete company profile
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

// list systems of the company logged in
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
};
