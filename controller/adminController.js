import validator from 'validator';

import UserModel from '../models/userModel.js';
import LogModel from '../models/logModel.js';
import asyncHandler from '../middleware/asyncMiddleware.js';

// @desc    Get all users
// @route   GET /api/admin/allUsers
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
// @route   GET /api/admin/deletedUsers
// @access  Private/Admin
const getDeletedUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find({ status: 'deleted' });
  res.json(users);
});

export { getAllUsers, getLogs, getDeletedUsers };
