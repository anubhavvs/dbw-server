import express from 'express';

import { loginCompany } from '../controller/companyController.js';

const router = express.Router();

router.post('/login', loginCompany);

export default router;
