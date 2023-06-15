import dotenv from 'dotenv';

import UserModel from '../models/userModel.js';
import connectDB from '../config/db.js';

dotenv.config();

connectDB();

const destroyData = async () => {
  try {
    await UserModel.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

destroyData();
