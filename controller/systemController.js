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
    res.status(400);
    throw new Error('Invalid system data.');
  }
});

// @desc    Get all the system
// @route   GET /api/system/
// @access  Private/Company
const getSystems = asyncHandler(async (req, res) => {
  const systems = await SystemModel.find({});
  res.json(systems);
});

const editSystem = asyncHandler(async (req, res) => {
  const { name, description, cellType, capacity, efficiency, warrantyYears } =
    req.body;

  const system = await SystemModel.findById(req.params.id);

  if (system && system.company._id.toString() == req.company._id.toString()) {
    system.name = name;
    system.description = description;
    system.cellType = cellType;
    system.capacity = capacity;
    system.efficiency = efficiency;
    system.warrantyYears = warrantyYears;

    const createdSystem = await system.save();
    res.status(201).json(createdSystem);
  } else {
    res.status(400);
    throw new Error('System not found.');
  }
});

// @desc    Delete a system
// @route   DELETE /api/system/:id
// @access  Private/Company
const deleteSystem = asyncHandler(async (req, res) => {
  const system = await SystemModel.findById(req.params.id);

  if (system && system.company._id.toString() == req.company._id.toString()) {
    await SystemModel.deleteOne({ _id: system._id });
    res.json({ message: 'System deleted.' });
  } else {
    res.status(400);
    throw new Error('System not found.');
  }
});

export { createSystem, getSystems, editSystem, deleteSystem };
