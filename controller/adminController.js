import validator from 'validator';

import UserModel from '../models/userModel.js';
import LogModel from '../models/logModel.js';
import CompanyModel from '../models/companyModel.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import generateToken from '../utils/generateJWT.js';

/**
 * @openapi
 * /admin/allUsers:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: Get all the user
 *      tags:
 *        - Users
 *      responses:
 *        200:
 *          description: Success
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AllUsers'
 *        401:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UnauthorizedError'
 */
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

export { getAllUsers, getLogs, getDeletedUsers };
