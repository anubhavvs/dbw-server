import asyncHandler from '../middleware/asyncMiddleware.js';

import SystemModel from '../models/systemModel.js';

// @desc    Create a system
// @route   POST /api/system/
// @access  Private/Company
const createSystem = asyncHandler(async (req, res) => {
  const { name, description, cellType, capacity, efficiency, warrantyYears } =
    req.body;
  const system = new SystemModel({
    company: req.company._id,
    name,
    description,
    cellType,
    capacity,
    efficiency,
    warrantyYears,
  });

  const createdSystem = await system.save();

  if (createdSystem) {
    res.status(201).json(createdSystem);
  } else {
    res.status(401);
    throw new Error('Invalid system data');
  }
});

export { createSystem };
