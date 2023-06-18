import validator from 'validator';

import asyncHandler from '../middleware/asyncMiddleware.js';
import generateToken from '../utils/generateJWT.js';
import CompanyModel from '../models/companyModel.js';

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

export { loginCompany };
