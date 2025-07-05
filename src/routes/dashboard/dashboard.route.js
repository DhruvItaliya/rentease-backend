import express from 'express';
import auth from '../../middlewares/auth.middleware.js'
import { dashboardStats } from '../../controllers/dashboard.controller.js';
const router = express.Router();

router.get('/get-dashboard', auth, dashboardStats);

export default router;