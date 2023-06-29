import express from 'express';

import {
  loginCompany,
  listSystems,
  getCompanyProfile,
  updateCompanyProfile,
  deleteCompanyProfile,
} from '../controller/companyController.js';
import { company } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', loginCompany);
router.get('/', company, listSystems);
router
  .route('/profile')
  .get(company, getCompanyProfile)
  .put(company, updateCompanyProfile)
  .delete(company, deleteCompanyProfile);

export default router;
