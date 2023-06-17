import validator from 'validator';

import asyncHandler from '../middleware/asyncMiddleware.js';
import generateToken from '../utils/generateJWT.js';
import CompanyModel from '../models/companyModel.js';

// @desc    Login company & get token
// @route   POST /api/company/login
// @access  Public
const loginCompany = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const company = await CompanyModel.findOne({ email });

  if (company && (await company.matchPassword(password))) {
    generateToken(res, company._id);

    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      website: company.isAdmin,
      location: company.status,
      description: company.premium,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

export { loginCompany };
